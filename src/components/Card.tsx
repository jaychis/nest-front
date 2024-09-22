import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/panda_logo.png";
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
import Slider from "react-slick";
import YouTube from "react-youtube";
import sanitizeHtml from "sanitize-html";
import { LogViewedBoardAPI } from "../pages/api/ViewedBoardsApi";
import debounce from "lodash.debounce";
import { ShareModal } from "./ShareModal";
import {  UserModalState, setModalState } from "../reducers/modalStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import styled from "styled-components";

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
}: BoardProps) => {
  useEffect(() => {
    console.log("card component");
    console.log("id : ", id);
    console.log("content : ", content);
    console.log("nickname : ", nickname);
  }, []);
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
  
  const USER_ID: string = localStorage.getItem("id") as string;

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

  return (
    <>
      <CardContainer
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        onClick={boardClickTracking}
        isHovered = {isCardHovered}
      >
        {/* Card Image */}
        <ImageWrapper>
          <LogoImg src = {logo}/>
          <NicknameWrapper onClick={() => navigate(`/users/inquiry?nickname=${nickname}`)}>
            {nickname}
          </NicknameWrapper>
        </ImageWrapper>
        
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
      <ButtonContainer>
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
        <ShareWrapper>
          <ShareButton
          isHovered={isCardShareHovered}
          onMouseEnter={() => setIsCardShareHovered(true)}
          onMouseLeave={() => setIsCardShareHovered(false)}
          onClick={() => {setIsModal(true);openModal();}}
          >
          <ShareImage src="https://img.icons8.com/ios/50/forward-arrow.png" alt="Share Icon" />
          <ShareCount>0</ShareCount>
          </ShareButton>
          <ShareModal 
          isModal = {isModal}
          setIsModal = {setIsModal}
          content = {shareContent}
          title = {title}
          />
        </ShareWrapper>
        {/* 추후 삭제될 수 있는 기능이라 변환 x*/}
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

const CardContainer = styled.div<{ isHovered: boolean }>`
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
`;

const ImageWrapper = styled.div`
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
  height: 400px;
  width: 100%;
  border-radius: 20px;
`;

const MediaContainer = styled.div`
  z-index: 1001;
  width: 85%;
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 20px; // 추가된 부분
  overflow: hidden; // 추가된 부분
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
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

const ShareButton = styled.button<{isHovered: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  border: 1px solid gray;
  height: 100%;
  width: 80%;
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
