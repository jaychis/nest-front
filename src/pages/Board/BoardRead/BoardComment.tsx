import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  CollectionTypes,
  ReactionStateTypes,
  ReactionType,
} from '../../../_common/collectionTypes';
import {
  ReactionApi,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from '../../api/reactionApi';
import logo from '../../../assets/img/panda_logo.webp';
import { ReplyType } from './BoardReply';
import { ReplySubmitAPI, ReplySubmitParams } from '../../api/replyApi';
import { breakpoints } from '../../../_common/breakpoint';
import { handleReaction } from '../../../_common/handleUserReaction';
import {
  fetchProfileImage,
  FetchProfileImageType,
} from '../../../_common/fetchCardProfile';
import { useNavigate } from 'react-router-dom';
import Reaction from './Reaction';

export interface CommentType {
  readonly id: string;
  readonly board_id: string;
  readonly user_id: string;
  readonly content: string;
  readonly nickname: string;
  readonly replies: ReplyType[];
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null | Date;
}

interface BoardCommentProps extends CommentType {
  readonly onReplySubmit: (reply: ReplyType) => void;
}

const BoardComment = (co: BoardCommentProps) => {

  const [isCardCommentReplyHovered, setIsCardCommentReplyHovered] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCommentReplyButton, setIsCommentReplyButton] = useState<boolean>(false);
  const USER_ID: string = localStorage.getItem('id') as string;
  const ID: string = co.id;
  const navigate = useNavigate()
  const [localCount, setLocalCount] = useState<number>(0);
  const [isCommentReaction, setCommentIsReaction] =useState<ReactionStateTypes>(null);
  const [isCardCommentCount, setIsCardCommentCount] = useState<number>(0);

  const reactionCommentButton = async (userReaction: ReactionStateTypes) => {
    if (userReaction !== null) {
      const params: ReactionParams = {
        boardId: ID,
        userId: USER_ID,
        type: userReaction,
        reactionTarget: 'COMMENT',
      };

      try {
        const res = await ReactionApi(params);
        if (!res) return;

        const status: number = res.status;
        if (status === 201) {
          await handleReaction({
            localCount,
            userReaction,
            isReaction: isCommentReaction,
            setIsReaction: setCommentIsReaction,
            isCardCount: isCardCommentCount,
            setIsCardCount: setIsCardCommentCount,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [isProfile, setIsProfile] = useState<string | null>(null);

  const fetchCommentProfile = async ({
    userId,
  }: {
    readonly userId: string;
  }) => {
    const profileImage: FetchProfileImageType = await fetchProfileImage({
      userId,
    });
    !profileImage ? setIsProfile(null) : setIsProfile(profileImage);
  };

  const startFunc = async () => {
    await fetchCommentProfile({ userId: co.user_id });
  };

  const [isReplyState, setIsReplyState] = useState<ReplyType>({
    id: '',
    comment_id: co.id,
    user_id: co.user_id,
    content: '',
    nickname: localStorage.getItem('nickname') as string,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  });

  const replyHandleChange = (event: CollectionTypes) => {
    const { name, value } = event;
    setIsReplyState({
      ...isReplyState,
      [name]: value,
    });
  };

  const replyWrite = () => {
    const params: ReplySubmitParams = {
      commentId: isReplyState.comment_id,
      content: isReplyState.content,
      nickname: isReplyState.nickname,
    };

    ReplySubmitAPI(params)
      .then((res) => {
        const response: ReplyType = res.data.response;
        co.onReplySubmit(response);
        setIsReplyState({
          ...isReplyState,
          content: '',
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (localCount < 0) {
      setLocalCount(0);
    }

    ReactionListAPI({ boardId: ID })
      .then((res) => {
        const response = res.data.response;
        response.forEach((el: ReactionType) => {
          if (USER_ID === el.user_id) {
            setCommentIsReaction(el.type);
          }
        });
      })
      .catch((err) => console.error(err));

    ReactionCountAPI({ boardId: ID })
      .then((res) => {
        const resCount = res.data.response;

        const count: number =
          resCount.board_score < 0 ? 0 : resCount.board_score;
        setIsCardCommentCount(count);
      })
      .catch((err) => console.error(err));

    if(!isProfile){
      startFunc()
    }
  }, [isCommentReaction]);

  return (
    <CommentContainer>
      <CommentHeader onClick = {() => navigate(`/users/profile/${USER_ID}`)}>
        <Avatar
          src={isProfile ? isProfile : logo}
          alt={`${co.nickname}'s avatar`}
        />
        <Nickname>{co.nickname}</Nickname>
      </CommentHeader>

      <CommentContent
        isHovered={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {co.content}
      </CommentContent>
            
      <CommentActions>
        <Reaction
        reactionCount={isCardCommentCount}
        clickEvent={reactionCommentButton}
        reactionState={isCommentReaction}
        />

        <CommentWrapper>
        <CommentButton
            isHovered={isCardCommentReplyHovered}
            onMouseEnter={() => setIsCardCommentReplyHovered(true)}
            onMouseLeave={() => setIsCardCommentReplyHovered(false)}
            onClick={() => setIsCommentReplyButton(!isCommentReplyButton)}
          >
            답글
          </CommentButton>
        </CommentWrapper>
      </CommentActions>

      {isCommentReplyButton && (
        <ReplyBox>
          <ReplyTextarea
            name="content"
            value={isReplyState.content}
            onChange={(value) =>
              replyHandleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
          />
          <ReplyActions>
            <CancelButton onClick={() => setIsCommentReplyButton(false)}>
              취소
            </CancelButton>
            <SubmitButton onClick={replyWrite}>답글</SubmitButton>
          </ReplyActions>
        </ReplyBox>
      )}
    </CommentContainer>
  );
};

export default BoardComment;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  padding: 0 15px;
  width: 100%;
  white-space: pre-wrap;
`;

const CommentHeader = styled.div`
  display: flex;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 18px;
`;

const Nickname = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #333;
`;

const CommentContent = styled.div<{ isHovered: boolean }>`
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  border-radius: 10px;
  padding: 8px;
  width: 100%;
  text-align: justify;
  object-fit: contain;
  box-sizing: border-box;
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 5px 0;
`;

const ReplyBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 3px solid #ccc;
  border-radius: 30px;
  padding: 10px;
  box-sizing: border-box;
`;

const ReplyTextarea = styled.textarea`
  width: 100%;
  height: 80px;
  border: none;
  border-radius: 14px;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
`;

const ReplyActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const CancelButton = styled.button`
  padding: 6px 12px;
  margin-left: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #f5f5f5;
  color: #333;
`;

const SubmitButton = styled.button`
  padding: 6px 12px;
  margin-left: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #007bff;
  color: white;
`;

const CommentWrapper = styled.div`
  width: 75px;
  height: 40px;
  display: flex;

  @media (max-width: ${breakpoints.mobile}) {
    width: 45px;
    margin-right: 7px;
  }
`;

const CommentButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHovered',
})<{
  readonly isHovered: boolean;
}>`
  border: 1px solid gray;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  height: 100%;
  width: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 45px;
    height: 40px;
    font-size: 10px;
  }
`;
