import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/panda_logo.png";
import kakao from "../assets/img/kakao.png"
import instagram from "../assets/img/instagram.png"
import facebook from "../assets/img/facebook.png"
import twitter from "../assets/img/twitter.png"
import copy from "../assets/img/copy.png"
import {
  ReactionAPI,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from "../pages/api/ReactionApi";
import {
  BoardProps,
  ReactionStateTypes,
  ReactionType,
} from "../_common/CollectionTypes";
import YouTube from "react-youtube";
import sanitizeHtml from "sanitize-html";
import { LogViewedBoardAPI } from "../pages/api/ViewedBoardsApi";
import debounce from "lodash.debounce";
import {  UserModalState, modalState, setModalState } from "../reducers/modalStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import styled from "styled-components";
import { shareCountApi } from "../pages/api/BoardApi";

const getYouTubeVideoId = ({ url }: { readonly url: string }): string => {
  try {
    const urlObj: URL = new URL(url);

    return urlObj.searchParams.get("v") || "";
  } catch (e) {
    console.error("Invalid URL", e);
    return "";
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
  shareCount
}: BoardProps) => {
  
  const navigate = useNavigate();
  const [isCardCount, setIsCardCount] = useState<number>(0);
  const [localCount, setLocalCount] = useState<number>(0);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);
  const [isCardUpHovered, setIsCardUpHovered] = useState<boolean>(false);
  const [isCardDownHovered, setIsCardDownHovered] = useState<boolean>(false);
  const [isCardCommentHovered, setIsCardCommentHovered] =useState<boolean>(false);
  const [isCardShareHovered, setIsCardShareHovered] = useState<boolean>(false);
  const [isCardSendHovered, setIsCardSendHovered] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<number>(0); // 조회수 상태 추가
  const [isReaction, setIsReaction] = useState<ReactionStateTypes>(null);
  const [shareContent, setShareContent] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>();
  const modalState : UserModalState = useSelector((state: RootState) => state.modalState);
  const [active, setIsActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [domain, setDomain] = useState<string>('');
  const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;
  const baseUrl = process.env.REACT_APP_API_BASE_URL
  
  const USER_ID: string = localStorage.getItem("id") as string;
  
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
      setIsActive(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if(baseUrl === 'http://127.0.0.1:9898'){
      setDomain('http://localhost:3000/')
    }
    else{
      setDomain('jaychis.com')
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
        type :userReaction,
        reactionTarget: "BOARD",
      };
      try {
        const res = await ReactionAPI(param);
        const status: number = res.status;
        const type = res.data.response?.type;
        if (userReaction === "DISLIKE" && isReaction === "DISLIKE" && localCount === 0) { setIsReaction(null)}
        else if (userReaction === "LIKE" && isReaction === 'DISLIKE' && localCount === 0) {setIsReaction("LIKE"); setIsCardCount((prevCount) => prevCount + 1);}
        else if (userReaction === "LIKE" && isReaction === 'LIKE') {setIsReaction(null); setIsCardCount((prevCount) => prevCount - 1); }
        else if (userReaction === "LIKE" && isReaction === 'DISLIKE') {setIsReaction("LIKE"); setIsCardCount((prevCount) => prevCount + 2);}
        else if (userReaction === "LIKE" && isReaction === null) {setIsReaction("LIKE"); setIsCardCount((prevCount) => prevCount +1);}

        else if (userReaction === "DISLIKE" && isReaction === null && localCount === 0) {setIsReaction('DISLIKE');}
        else if (userReaction === "DISLIKE" && isReaction === 'LIKE' && isCardCount === 1) { setIsReaction('DISLIKE'); setIsCardCount((prev) => prev - 1)}
        else if (userReaction === "DISLIKE" && isReaction === null && localCount != 0) {setIsReaction("DISLIKE"); setIsCardCount((prevCount) => prevCount - 1);}
        else if (userReaction === "DISLIKE" && isReaction === 'DISLIKE') {setIsReaction(null); setIsCardCount((prevCount) => prevCount + 1);}
        else if (userReaction === "DISLIKE" && isReaction === 'LIKE') {setIsReaction("DISLIKE"); setIsCardCount((prevCount) => prevCount -2);}
      } catch (err) {
        console.error(err);
      }
    }
  };

  const goBoardRead = () => {
    sessionStorage.setItem("boardId", id);
    sessionStorage.setItem("boardTitle", title);
    navigate(`/boards/read?id=${id}&title=${title}&content=${content}`);
  };
  
  const fetchReactionList = async (boardId: string) => {
    try {
      const res = await ReactionListAPI({ boardId });
      const response = res.data.response;
      
      response.forEach((el: ReactionType) => {
        if (USER_ID === el.user_id) {
          setIsReaction(el.type);}
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchReactionCount = async (boardId: string) => {
    try {
      const res = await ReactionCountAPI({ boardId });
      const resCount = res.data.response;
      if(resCount.board_score  > 0){
        setIsCardCount(resCount.board_score)
        setLocalCount(resCount.board_score)
      }
      else{
        setIsCardCount(0);
        setLocalCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = () => {
    dispatch(setModalState(!modalState.modalState));
  };

  useEffect(() => {
      if( modalState.modalState === true && isModal === false){
        openModal()
      }
  },[isModal])

  const debouncedFetchReactionList = debounce(fetchReactionList, 300);
  const debouncedFetchReactionCount = debounce(fetchReactionCount, 300);

  useEffect(() => {
    debouncedFetchReactionList(id);
    debouncedFetchReactionCount(id);
    const temp = extractTextFromHTML(content[0])
    setShareContent(temp)
  },[]);

  useEffect(() => {
    if(localCount < 0){
      setLocalCount(0)
    }
  },[localCount])
  
  const boardClickTracking = async () => {
    try {
      const boardTracking = await LogViewedBoardAPI({
        boardId: id,
        userId: localStorage.getItem("id") as string,
      });

      if (!boardTracking) return;
      console.log("boardTracking : ", boardTracking);
    } catch (err) {
      console.error(err);
    }
  };

  const extractTextFromHTML = (htmlString : string):string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.innerText || tempDiv.textContent ||'';
  }

  const handleShaerTwitter = () => {
    const twitterShareUrl: string = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent('https://naver.com')}`;
    shareCountApi(id);
    setIsActive(false);
    window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = () => {
    const instagramShareUrl : string = `https://www.instagram.com/direct/inbox/?url=${encodeURIComponent(domain)}&text=${encodeURIComponent('여기에 내용 넣으면 됨')}`;
    navigator.clipboard.writeText(domain);
    shareCountApi(id);
    setIsActive(false);
    window.open(instagramShareUrl, '_blank', 'noopener,noreferrer');
  }

  const handelShareFaceBook = () => {
    const facebookShareUrl : string = `https:///www.facebook.com/sharer/sharer.php?u=naver.com`
    shareCountApi(id);
    setIsActive(false);
    window.open(facebookShareUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyClipBoard = (url : any) => {
    navigator.clipboard.writeText(url);
    shareCountApi(id);
    setIsActive(false);
    alert("링크가 복사되었습니다.");
  }

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
}

  return (
    <>
      <CardContainer
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        onClick={boardClickTracking}
        isHovered = {isCardHovered}
        modalState={modalState.modalState}
      >
        {/* Card Image */}
        <ImageContainer>
          <LogoImg src = {logo}/>
          <NicknameWrapper onClick={() => navigate(`/users/inquiry?nickname=${nickname}`)}>
            {nickname}
          </NicknameWrapper>
        </ImageContainer>
        
        {/* Card Content */}
        <ContentContainer>
          <BoardTitle onClick={goBoardRead}>
            {title}
          </BoardTitle>

          {type === "TEXT" ? (
            <TextContainer>
                {content?.map((co, index) => {
                  // console.log("card content : ", co);
                  return (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(co) }}
                    />
                  );
                })}
            </TextContainer>
          ) : type === "MEDIA" ? (
              <MediaContainer>
              {content.map((image, index) => (
                <div key={index}>
                  <ImagePreview src={image}alt={`Preview image ${index}`}/>
                </div>
              ))}
              </MediaContainer>
          ) : (
            <>
              {content.map((video: string, index: number) => (
                <VideoContainer key={index}>
                  {video && (
                    <YouTube
                      videoId={getYouTubeVideoId({ url: video })}
                      opts={{
                        width: "760px",
                        height: "400px",
                        playerVars: { modestbranding: 1 },
                      }}
                      style={{ borderRadius: "20px" }} // 추가된 부분
                    />
                  )}
                </VideoContainer>
              ))}
            </>
          )}
        </ContentContainer>
      </CardContainer>

      <ButtonContainer modalState = {modalState.modalState}>
        <ReactionWrapper>
          <LikeButton
          isLiked={isReaction === 'LIKE'}
          isHovered={isCardUpHovered}
          onMouseEnter={() => setIsCardUpHovered(true)}
          onMouseLeave={() => setIsCardUpHovered(false)}
          onClick={() => reactionButton("LIKE")}
          >
            좋아요
          </LikeButton>
          <ReactionCount>
            {isCardCount}
          </ReactionCount>
          <DisLikeButton
          isDisliked={isReaction === 'DISLIKE'}
          isHovered={isCardDownHovered}
          onMouseEnter={() => setIsCardDownHovered(true)}
          onMouseLeave={() => setIsCardDownHovered(false)}
          onClick={() => reactionButton("DISLIKE")}
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
          onClick={() => {setIsActive((prev) => !prev)}}
          >
          <ShareImage src="https://img.icons8.com/ios/50/forward-arrow.png" alt="Share Icon" />
          <ShareCount>{shareCount}</ShareCount>
          </ShareButton>
          {active && ( 
            <DropdownMenu>
              <DropdownItem href="#" onClick = {() => {handleShareKakao()}}><ShareIcon src = {kakao}/>카카오톡</DropdownItem>
              <DropdownItem href="#" onClick = {() => {handleShareInstagram()}}><ShareIcon src = {instagram}/>인스타그램</DropdownItem>
              <DropdownItem href="#" onClick = {() => {handelShareFaceBook()}}><ShareIcon src = {facebook}/>페이스북</DropdownItem>
              <DropdownItem href="#" onClick = {() => {handleShaerTwitter()}}><ShareIcon src = {twitter}/>트위터</DropdownItem>
              <DropdownItem href="#" onClick = {() => {handleCopyClipBoard(domain)}}><ShareIcon src = {copy}/>링크 복사</DropdownItem>
            </DropdownMenu>)}
          </DropdownContainer>
        </ShareWrapper>

        {/* 추후 삭제될 수 있는 기능이라 생각해 styled 컴포넌트로 변환하지않음*/}
        <div
          style={{
            marginLeft : '-7px',
            borderRadius: "30px",
            width: "75px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onMouseEnter={() => setIsCardSendHovered(true)}
            onMouseLeave={() => setIsCardSendHovered(false)}
            style={{
              border : '1px solid gray',
              background : isCardSendHovered ? '#f0f0f0' : 'white',
              height: "100%",
              width: "100%",
              borderRadius: "30px",
            }}
          >
            보내기
          </button>
        </div>
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
      <Hr/>
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

const CardContainer = styled.div<{ isHovered: boolean, modalState: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 1000px;
  min-height: 200px;
  margin: 10px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isHovered ? "#f0f0f0" : "white")};
  z-index: ${(props) => (props.modalState ? -10 : 999)}
`;

const ImageContainer = styled.div`
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
  margin-right: 10px; // 이미지와 닉네임 사이의 간격
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
  font-size: 30px;
`;

const TextContainer = styled.div`
  text-align: left;
  white-space: normal;
  word-break: break-word;
  width: 100%;
  font-size: 20px;
`;

const ImagePreview = styled.img`
  max-width: 760px;
  max-height: 500px;
  border-radius: 20px;
  object-fit: contain; 
`;

const MediaContainer = styled.div`
  width: 85%;
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 20px; // 추가된 부분
  overflow: hidden; // 추가된 부분
`;

const ButtonContainer = styled.div<{modalState: boolean}>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
  z-index: ${(props) => (props.modalState ? -10 : 1000)}
`;

const ReactionWrapper = styled.div`
  margin-right: 5px;
  border-radius: 30px;
  width: 150px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LikeButton = styled.button<{isLiked: boolean, isHovered:boolean}>`
  border: ${(props) => (props.isLiked ? '2px solid blue' : '1px solid gray')};
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  width: 100%;
  height: 100%;
  border-radius: 30px;
  cursor: pointer;
`;

const ReactionCount = styled.span`
  margin: 10px;
  width: 10px;
  height: 10px;
`;

const DisLikeButton = styled.button<{isDisliked: boolean, isHovered:boolean}>`
  border: ${(props) => (props.isDisliked ? '1px solid red' : '1px solid gray')};
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  width: 100%;
  height: 100%;
  border-radius: 30px;
  cursor: pointer;
`;

const CommentWrapper = styled.div`
  border-radius: 30px;
  width: 75px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CommentButton = styled.button<{isHovered: boolean}>`
  border: 1px solid gray;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  height: 100%;
  width: 100%;
  border-radius: 30px;
  cursor: pointer;
`;

const ShareWrapper = styled.div`
  border-radius: 30px;
  width: 15%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ShareIcon = styled.img`
  width : 30px !important;
  height : 30px !important;
  object-fit: contain !important;
  border-radius : 45% !important;
  margin-right: 10px;
`

const ShareButton = styled.button<{isHovered: boolean}>`
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
`;

const ShareImage = styled.img`
  height: 35px;
  width: 25px;
`;

const ShareCount = styled.p`
  display: flex;
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 700;
`;

const Hr = styled.hr`
  border: none;
  height: 2px;
  background-color: #f0f0f0;
  margin: 16px 0;
  width: 100%;
  max-width: 900px;
`;

export default Card;