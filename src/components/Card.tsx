import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/panda_logo.png';
import kakao from '../assets/img/kakao.png';
import instagram from '../assets/img/instagram.png';
import facebook from '../assets/img/facebook.png';
import twitter from '../assets/img/twitter.png';
import copy from '../assets/img/copy.png';
import {
  ReactionApi,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from '../pages/api/reactionApi';
import {
  BoardProps,
  ReactionStateTypes,
  ReactionType,
} from '../_common/collectionTypes';
import YouTube from 'react-youtube';
import sanitizeHtml from 'sanitize-html';
import debounce from 'lodash.debounce';
import { UserModalState } from '../reducers/modalStateSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import styled from 'styled-components';
import { shareCountApi } from '../pages/api/boardApi';

const getYouTubeVideoId = ({ url }: { readonly url: string }): string => {
  try {
    return url.includes('v=')
      ? url?.split('v=')[1]?.split('&')[0]
      : url?.split('youtu.be/')[1]?.split('?')[0];
  } catch (e) {
    console.error('Invalid URL', e);
    return '';
  }
};

const Card = ({
  id,
  category,
  content,
  createdAt,
  nickname,
  title,
  type,
  shareCount,
}: BoardProps) => {
  const navigate = useNavigate();
  const [isCardCount, setIsCardCount] = useState<number>(0);
  const [localCount, setLocalCount] = useState<number>(0);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);
  const [isCardUpHovered, setIsCardUpHovered] = useState<boolean>(false);
  const [isCardDownHovered, setIsCardDownHovered] = useState<boolean>(false);
  const [isCardCommentHovered, setIsCardCommentHovered] =
    useState<boolean>(false);
  const [isCardShareHovered, setIsCardShareHovered] = useState<boolean>(false);
  const [isCardSendHovered, setIsCardSendHovered] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<number>(0); // 조회수 상태 추가
  const [isReaction, setIsReaction] = useState<ReactionStateTypes>(null);
  const [shareContent, setShareContent] = useState<string>('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
  );
  const [active, setIsActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [domain, setDomain] = useState<string>('');
  const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const USER_ID: string = localStorage.getItem('id') as string;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 760);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const videoOptions = {
    width: isSmallScreen ? '100%' : '760px',
    height: isSmallScreen ? '330px' : '400px',
    playerVars: { modestbranding: 1 },
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsActive(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (baseUrl === 'http://127.0.0.1:9898') {
      setDomain('http://localhost:3000/');
    } else {
      setDomain('jaychis.com');
    }

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoApiKey);
    }
  }, [kakaoApiKey]);

  const reactionButton = async (userReaction: ReactionStateTypes) => {
    if (userReaction !== null) {
      const param: ReactionParams = {
        boardId: id,
        userId: USER_ID,
        type: userReaction,
        reactionTarget: 'BOARD',
      };
      try {
        const res = await ReactionApi(param);
        const status: number = res.status;
        const type = res.data.response?.type;
        if (
          userReaction === 'DISLIKE' &&
          isReaction === 'DISLIKE' &&
          localCount === 0
        ) {
          setIsReaction(null);
        } else if (
          userReaction === 'LIKE' &&
          isReaction === 'DISLIKE' &&
          localCount === 0
        ) {
          setIsReaction('LIKE');
          setIsCardCount((prevCount) => prevCount + 1);
        } else if (userReaction === 'LIKE' && isReaction === 'LIKE') {
          setIsReaction(null);
          setIsCardCount((prevCount) => prevCount - 1);
        } else if (userReaction === 'LIKE' && isReaction === 'DISLIKE') {
          setIsReaction('LIKE');
          setIsCardCount((prevCount) => prevCount + 2);
        } else if (userReaction === 'LIKE' && isReaction === null) {
          setIsReaction('LIKE');
          setIsCardCount((prevCount) => prevCount + 1);
        } else if (
          userReaction === 'DISLIKE' &&
          isReaction === null &&
          localCount === 0
        ) {
          setIsReaction('DISLIKE');
        } else if (
          userReaction === 'DISLIKE' &&
          isReaction === 'LIKE' &&
          isCardCount === 1
        ) {
          setIsReaction('DISLIKE');
          setIsCardCount((prev) => prev - 1);
        } else if (
          userReaction === 'DISLIKE' &&
          isReaction === null &&
          localCount != 0
        ) {
          setIsReaction('DISLIKE');
          setIsCardCount((prevCount) => prevCount - 1);
        } else if (userReaction === 'DISLIKE' && isReaction === 'DISLIKE') {
          setIsReaction(null);
          setIsCardCount((prevCount) => prevCount + 1);
        } else if (userReaction === 'DISLIKE' && isReaction === 'LIKE') {
          setIsReaction('DISLIKE');
          setIsCardCount((prevCount) => prevCount - 2);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const goBoardRead = () => {
    sessionStorage.setItem('boardId', id);
    sessionStorage.setItem('boardTitle', title);
    navigate(`/boards/read?id=${id}&title=${title}&content=${content}`);
  };

  const fetchReactionList = async (boardId: string) => {
    try {
      const res = await ReactionListAPI({ boardId });
      const response = res.data.response;

      response.forEach((el: ReactionType) => {
        if (USER_ID === el.user_id) {
          setIsReaction(el.type);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReactionCount = async (boardId: string) => {
    try {
      const res = await ReactionCountAPI({ boardId });
      const resCount = res.data.response;
      if (resCount.board_score > 0) {
        setIsCardCount(resCount.board_score);
        setLocalCount(resCount.board_score);
      } else {
        setIsCardCount(0);
        setLocalCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedFetchReactionList = debounce(fetchReactionList, 300);
  const debouncedFetchReactionCount = debounce(fetchReactionCount, 300);

  useEffect(() => {
    debouncedFetchReactionList(id);
    debouncedFetchReactionCount(id);
    const temp = extractTextFromHTML(content[0]);
    setShareContent(temp);
  }, []);

  useEffect(() => {
    if (localCount < 0) {
      setLocalCount(0);
    }
  }, [localCount]);

  const extractTextFromHTML = (htmlString: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.innerText || tempDiv.textContent || '';
  };

  const handleShaerTwitter = () => {
    const twitterShareUrl: string = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent('https://naver.com')}`;
    shareCountApi(id);
    setIsActive(false);
    window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = () => {
    const instagramShareUrl: string = `https://www.instagram.com/direct/inbox/?url=${encodeURIComponent(domain)}&text=${encodeURIComponent('여기에 내용 넣으면 됨')}`;
    navigator.clipboard.writeText(domain);
    shareCountApi(id);
    setIsActive(false);
    window.open(instagramShareUrl, '_blank', 'noopener,noreferrer');
  };

  const handelShareFaceBook = () => {
    const facebookShareUrl: string = `https:///www.facebook.com/sharer/sharer.php?u=naver.com`;
    shareCountApi(id);
    setIsActive(false);
    window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyClipBoard = (url: any) => {
    navigator.clipboard.writeText(url);
    shareCountApi(id);
    setIsActive(false);
    alert('링크가 복사되었습니다.');
  };

  const handleShareKakao = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      shareCountApi(id);
      setIsActive(false);
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${title}`,
          description: `${content}`,
          imageUrl: 'https://i.postimg.cc/jd4cY735/3.png',
          link: {
            mobileWebUrl: 'https://naver.com',
            webUrl: 'https://naver.com',
          },
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: 'https://naver.com',
              webUrl: 'https://naver.com',
            },
          },
        ],
      });
    } else {
      console.error('Kakao SDK가 초기화되지 않았습니다.');
    }
  };

  return (
    <>
      <CardContainer
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        isHovered={isCardHovered}
        modalState={modalState.modalState}
      >
        {/* Card Image */}
        <LogoContainer>
          <LogoImg src={logo} />
          <NicknameWrapper
            onClick={() => navigate(`/users/inquiry?nickname=${nickname}`)}
          >
            {nickname}
          </NicknameWrapper>
        </LogoContainer>

        {/* Card Content */}
        <ContentContainer>
          <BoardTitle onClick={goBoardRead}>{title}</BoardTitle>

          {type === 'TEXT' ? (
            <TextContainer>
              {content?.map((co, index) => {
                return (
                  <div
                    key={`${id}-${index}`}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(co) }}
                  />
                );
              })}
            </TextContainer>
          ) : type === 'MEDIA' ? (
            <MediaContainer>
              {content.map((image, index) => (
                <div key={`${id}-${index}`}>
                  <ImagePreview src={image} alt={`Preview image ${index}`} />
                </div>
              ))}
            </MediaContainer>
          ) : (
            <>
              {content.map((video: string, index: number) => (
                <VideoContainer key={`${id}-${index}`}>
                  {video && (
                    <ResponsiveVideoContainer>
                      <VideoWrapper>
                        <YouTube
                          videoId={getYouTubeVideoId({ url: video })}
                          opts={videoOptions}
                        />
                      </VideoWrapper>
                    </ResponsiveVideoContainer>
                  )}
                </VideoContainer>
              ))}
            </>
          )}
        </ContentContainer>
      </CardContainer>

      <ButtonContainer modalState={modalState.modalState}>
        <ReactionWrapper>
          <LikeButton
            isLiked={isReaction === 'LIKE'}
            isHovered={isCardUpHovered}
            onMouseEnter={() => setIsCardUpHovered(true)}
            onMouseLeave={() => setIsCardUpHovered(false)}
            onClick={() => reactionButton('LIKE')}
          >
            좋아요
          </LikeButton>
          <ReactionCount>{isCardCount}</ReactionCount>
          <DisLikeButton
            isDisliked={isReaction === 'DISLIKE'}
            isHovered={isCardDownHovered}
            onMouseEnter={() => setIsCardDownHovered(true)}
            onMouseLeave={() => setIsCardDownHovered(false)}
            onClick={() => reactionButton('DISLIKE')}
          >
            싫어요
          </DisLikeButton>
        </ReactionWrapper>
        <CommentWrapper>
          <CommentButton
            isHovered={isCardCommentHovered}
            onMouseEnter={() => setIsCardCommentHovered(true)}
            onMouseLeave={() => setIsCardCommentHovered(false)}
            onClick={goBoardRead}
          >
            댓글
          </CommentButton>
        </CommentWrapper>

        {/* 공유 */}
        <ShareWrapper ref={dropdownRef}>
          <DropdownContainer>
            <ShareButton
              isHovered={isCardShareHovered}
              onMouseEnter={() => setIsCardShareHovered(true)}
              onMouseLeave={() => setIsCardShareHovered(false)}
              onClick={() => {
                setIsActive((prev) => !prev);
              }}
            >
              <ShareImageTag
                src="https://img.icons8.com/ios/50/forward-arrow.png"
                alt="Share Icon"
              />
              <ShareCountTag>{shareCount}</ShareCountTag>
            </ShareButton>
            {active && (
              <DropdownMenu>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleShareKakao();
                  }}
                >
                  <ShareIcon src={kakao} />
                  카카오톡
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleShareInstagram();
                  }}
                >
                  <ShareIcon src={instagram} />
                  인스타그램
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handelShareFaceBook();
                  }}
                >
                  <ShareIcon src={facebook} />
                  페이스북
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleShaerTwitter();
                  }}
                >
                  <ShareIcon src={twitter} />
                  트위터
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleCopyClipBoard(domain);
                  }}
                >
                  <ShareIcon src={copy} />
                  링크 복사
                </DropdownItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
        </ShareWrapper>

        <ScirpWrapper>
          <ScripButton
            isHovered={isCardSendHovered}
            onMouseEnter={() => setIsCardSendHovered(true)}
            onMouseLeave={() => setIsCardSendHovered(false)}
          >
            보내기
          </ScripButton>
        </ScirpWrapper>
        {/*<div*/}
        {/*  style={{*/}
        {/*    marginLeft: "auto", // 자동 여백을 사용하여 오른쪽 정렬*/}
        {/*    borderRadius: "30px",*/}
        {/*    width: "auto", // 너비 자동 조정*/}
        {/*    height: "50px",*/}
        {/*    display: "flex",*/}
        {/*    justifyContent: "right",*/}
        {/*    alignItems: "center",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <span*/}
        {/*    style={{*/}
        {/*      fontSize: "14px",*/}
        {/*      color: "#000",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    /!* 조회수  *!/*/}
        {/*    {viewCount}회*/}
        {/*  </span>*/}
        {/*</div>*/}
      </ButtonContainer>
      <HrTag />
    </>
  );
};

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 160px;
`;

const DropdownItem = styled.a`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  color: black;
  text-decoration: none;
  font-size: 14px;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const CardContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isHovered', 'modalState'].includes(prop),
})<{
  isHovered: boolean;
  modalState: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  min-height: 200px;
  margin: 10px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  z-index: ${(props) => (props.modalState ? -10 : 999)};

  @media (max-width: 768px) {
    margin: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px;
`;

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 30px;
`;

const NicknameWrapper = styled.div`
  font-size: 15px;
`;

const ContentContainer = styled.div`
  width: 100%;
  overflow: visible;
`;

const BoardTitle = styled.h3`
  font-weight: bold;
  text-align: left;
  white-space: normal;
  font-size: 1.5rem;
`;

const TextContainer = styled.div`
  text-align: left;
  white-space: normal;
  word-break: break-word;
  width: 100%;
`;

const ImagePreview = styled.img`
  width: 85%;
  height: 85%;
  border-radius: 20px;
  object-fit: contain;
  margin-top: 10px;
`;

const MediaContainer = styled.div`
  
  background: #606060;
  text-align: center;
  border: 2px solid darkgray;
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 20px;
  overflow: hidden;
  max-width: 760px;
  margin: 0 auto;
`;

const ResponsiveVideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* Aspect ratio 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 20px;
`;

const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ButtonContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'modalState',
})<{
  modalState: boolean;
}>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
  z-index: ${(props) => (props.modalState ? -10 : 1000)};

`;

const ReactionWrapper = styled.div`
  margin-right: 5px;
  border-radius: 30px;
  width: 150px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 120px;
  }
`;

const LikeButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isLiked', 'isHovered'].includes(prop),
})<{
  isLiked: boolean;
  isHovered: boolean;
}>`
  border: ${(props) => (props.isLiked ? '2px solid blue' : '1px solid gray')};
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  width: 100%;
  height: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 50px;
    height: 40px;
    font-size: 10px;
  }
`;

const ReactionCount = styled.span`
  margin: 10px;
  width: 10px;
  height: 10px;

  @media (max-width: 768px) {
    margin: 5px;
  }
`;

const DisLikeButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isDisliked', 'isHovered'].includes(prop),
})<{
  isDisliked: boolean;
  isHovered: boolean;
}>`
  border: ${(props) => (props.isDisliked ? '1px solid red' : '1px solid gray')};
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  width: 100%;
  height: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 50px;
    height: 40px;
    font-size: 10px;
  }
`;

const CommentWrapper = styled.div`
  width: 75px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 45px;
    margin-right: 7px;
  }
`;

const CommentButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHovered',
})<{
  isHovered: boolean;
}>`
  border: 1px solid gray;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  height: 100%;
  width: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 45px;
    height: 40px;
    font-size: 10px;
  }
`;

const ShareWrapper = styled.div`
  width: 15%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ShareIcon = styled.img`
  width: 30px !important;
  height: 30px !important;
  object-fit: contain !important;
  border-radius: 45% !important;
  margin-right: 10px;
`;

const ShareButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHovered',
})<{
  isHovered: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  border: 1px solid gray;
  height: 50px;
  width: 80px;
  border-radius: 30px;
  margin-left: -7px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 65px;
    height: 40px;
    font-size: 10px;
    margin-left: 5px;
    margin-right: 7px;
  }
`;

const ShareImageTag = styled.img`
  height: 35px;
  width: 25px;
`;

const ShareCountTag = styled.p`
  display: flex;
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 700;
`;

const ScirpWrapper = styled.div`
  margin-left: -7px;
  border-radius: 30px;
  width: 75px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    margin-left: 0px;
  }
`;

const ScripButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHovered', // isHovered를 DOM에 전달하지 않음
})<{
  isHovered: boolean; // isHovered 타입 정의
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  border: 1px solid gray;
  height: 100%;
  width: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 65px;
    height: 40px;
    font-size: 10px;
  }
`;

const HrTag = styled.hr`
  border: none;
  height: 2px;
  background-color: #f0f0f0;
  margin: 16px 0;
  width: 100%;
  max-width: 900px;
`;

export default Card;
