import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/panda_logo.png';
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
import ShareComponent from './ShareComponent';

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
  const [isCardSendHovered, setIsCardSendHovered] = useState<boolean>(false);
  const [isReaction, setIsReaction] = useState<ReactionStateTypes>(null);
  const [shareContent, setShareContent] = useState<string>('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
  );

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
    navigate(`/boards/read?id=${id}`);
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
                <ImagePreview
                  key={`${id}-${index}`}
                  src={image}
                  alt={`Preview image ${index}`}
                />
              ))}
            </MediaContainer>
          ) : (
            <>
              {content.map((video: string, index: number) => (
                <VideoContainer key={`${id}-${index}`}>
                  {video && (
                    <YouTube
                      videoId={getYouTubeVideoId({ url: video })}
                      opts={{
                        width: '100%',
                        height: '400px',
                        playerVars: { modestbranding: 1 },
                      }}
                      style={{ borderRadius: '20px' }} // 추가된 부분
                    />
                  )}
                </VideoContainer>
              ))}
            </>
          )}
        </ContentContainer>

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
          <ShareComponent
            shareCount={shareCount}
            title={title}
            content={content}
            id={id}
          />

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
      </CardContainer>

      <HrTag />
    </>
  );
};

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
  height: 100%;
  max-height: 600px;
  max-width: 600px;
  margin: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  position: relative;
  
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const MediaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #606060;
  text-align: center;
  border: 2px solid darkgray;
  //object-fit: contain;
  border-radius: 20px;
  margin: 10px auto;
`;

const ImagePreview = styled.img`
  max-width: 700px;
  max-height: 400px;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: block;
  object-fit: contain;
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

const VideoContainer = styled.div`
  border-radius: 20px;
  overflow: hidden;
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
  height: 100%;
  margin-top: 5px;
  height: 100%;
  max-height: 80px;
`;

const ReactionWrapper = styled.div`
  margin-right: 5px;
  border-radius: 30px;
  width: 150px;
  height: 40px;
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
  height: 40px;
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

const ScirpWrapper = styled.div`
  margin-left: -7px;
  border-radius: 30px;
  width: 75px;
  height: 40px;
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
  margin: 5px 0;
  width: 100%;
  max-width: 600px;
`;

export default Card;
