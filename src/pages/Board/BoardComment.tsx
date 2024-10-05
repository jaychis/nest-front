import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  CollectionTypes,
  ReactionStateTypes,
  ReactionType,
} from '../../_common/CollectionTypes';
import {
  ReactionAPI,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from '../api/ReactionApi';
import logo from '../../assets/img/panda_logo.png';
import { ReplyType } from './BoardReply';
import { ReplySubmitAPI, ReplySubmitParams } from '../api/ReplyApi';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

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
  onReplySubmit: (reply: ReplyType) => void;
}

const BoardComment = (co: BoardCommentProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCardCommentCount, setIsCardCommentCount] = useState<number>(0);
  const [isCardCommentUpHovered, setIsCardCommentUpHovered] =
    useState<boolean>(false);
  const [isCardCommentDownHovered, setIsCardCommentDownHovered] =
    useState<boolean>(false);
  const [isCardCommentReplyHovered, setIsCardCommentReplyHovered] =
    useState<boolean>(false);
  const [isCardCommentShareHovered, setIsCardCommentShareHovered] =
    useState<boolean>(false);
  const [isCardCommentSendHovered, setIsCardCommentSendHovered] =
    useState<boolean>(false);
  const [isCommentReaction, setCommentIsReaction] =
    useState<ReactionStateTypes>(null);
  const [isCommentReplyButton, setIsCommentReplyButton] =
    useState<boolean>(false);

  const USER_ID: string = localStorage.getItem('id') as string;
  const ID: string = co.id;

  const reactionCommentButton = async (type: ReactionStateTypes) => {
    if (type !== null) {
      const param: ReactionParams = {
        boardId: ID,
        userId: USER_ID,
        type,
        reactionTarget: 'COMMENT',
      };

      console.log('comment reaction param : ', param);
      ReactionAPI(param)
        .then((res) => {
          const status: number = res.status;
          console.log('status : ', status);

          const type = res.data.response?.type;
          console.log('type : ', type);
          if (type === undefined) {
            setCommentIsReaction(null);
          } else if (type === 'LIKE') {
            setCommentIsReaction('LIKE');
          } else if (type === 'DISLIKE') {
            setCommentIsReaction('DISLIKE');
          }
        })
        .catch((err) => {
          console.error('Error in ReactionAPI:', err);
          alert(
            'An error occurred while processing your reaction. Please try again later.'
          );
        });
    }
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
    const param: ReplySubmitParams = {
      commentId: isReplyState.comment_id,
      content: isReplyState.content,
      nickname: isReplyState.nickname,
    };

    ReplySubmitAPI(param)
      .then((res) => {
        const response: ReplyType = res.data.response;
        console.log('ReplySubmitAPI response : ', response);

        co.onReplySubmit(response);
        setIsReplyState({
          ...isReplyState,
          content: '',
        });
      })
      .catch((err) => {
        console.error('Error in ReplySubmitAPI:', err);
        alert(
          'An error occurred while submitting your reply. Please try again later.'
        );
      });
  };

  useEffect(() => {
    ReactionListAPI({ boardId: ID })
      .then((res): void => {
        const response = res.data.response;

        response.forEach((el: ReactionType): void => {
          if (USER_ID === el.user_id) {
            setCommentIsReaction(el.type);
          }
        });
      })
      .catch((err) => {
        console.error('BoardComment ReactionListAPI error:', err);
        alert(
          'An error occurred while fetching reactions. Please try again later.'
        );
      });

    ReactionCountAPI({ boardId: ID })
      .then((res): void => {
        const resCount = res.data.response;
        console.log('resCount : ', resCount);

        setIsCardCommentCount(resCount.count);
      })
      .catch((err) => {
        console.error('BoardComment ReactionCountAPI error:', err);
        alert(
          'An error occurred while fetching the reaction count. Please try again later.'
        );
      });
  }, [isCommentReaction]);

  return (
    <>
      <CommentContainer
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CommentHeader>
          <AvatarWrapper>
            <Avatar src={logo} alt={`${co.nickname}'s avatar`} />
          </AvatarWrapper>
          <Nickname>{co.nickname}</Nickname>
        </CommentHeader>
        <CommentContent isHovered={isHovered}>{co.content}</CommentContent>
      </CommentContainer>
      <ButtonContainer>
        <ReactionWrapper isCommentReaction={isCommentReaction}>
          <ReactionButton
            onMouseEnter={() => setIsCardCommentUpHovered(true)}
            onMouseLeave={() => setIsCardCommentUpHovered(false)}
            hovered={isCardCommentUpHovered}
            onClick={() => reactionCommentButton('LIKE')}
          >
            <ThumbsUp />
          </ReactionButton>
          <ReactionCount>{isCardCommentCount}</ReactionCount>
          <ReactionButton
            onMouseEnter={() => setIsCardCommentDownHovered(true)}
            onMouseLeave={() => setIsCardCommentDownHovered(false)}
            hovered={isCardCommentDownHovered}
            onClick={() => reactionCommentButton('DISLIKE')}
          >
            <ThumbsDown />
          </ReactionButton>
        </ReactionWrapper>
        <ActionButton
          onMouseEnter={() => setIsCardCommentReplyHovered(true)}
          onMouseLeave={() => setIsCardCommentReplyHovered(false)}
          hovered={isCardCommentReplyHovered}
          onClick={() => setIsCommentReplyButton(!isCommentReplyButton)}
        >
          답글
        </ActionButton>
        <ActionButton
          onMouseEnter={() => setIsCardCommentShareHovered(true)}
          onMouseLeave={() => setIsCardCommentShareHovered(false)}
          hovered={isCardCommentShareHovered}
        >
          공유
        </ActionButton>
        <ActionButton
          onMouseEnter={() => setIsCardCommentSendHovered(true)}
          onMouseLeave={() => setIsCardCommentSendHovered(false)}
          hovered={isCardCommentSendHovered}
        >
          보내기
        </ActionButton>
      </ButtonContainer>
      {isCommentReplyButton && (
        <ReplyContainer>
          <ReplyTextarea
            name={'content'}
            value={isReplyState.content}
            onChange={(value) =>
              replyHandleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
          ></ReplyTextarea>
          <ReplyButtonContainer>
            <CancelButton
              onClick={() => {
                setIsCommentReplyButton(false);
                setIsReplyState({ ...isReplyState, content: '' });
              }}
            >
              취소
            </CancelButton>
            <SubmitButton onClick={replyWrite}>답글</SubmitButton>
          </ReplyButtonContainer>
        </ReplyContainer>
      )}
    </>
  );
};

export default BoardComment;

// Styled Components
const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  margin-bottom: 10px;
  margin-right: 5%;
`;

const CommentHeader = styled.div`
  display: flex;
`;

const AvatarWrapper = styled.div`
  margin-right: 18px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 30%;
`;

const Nickname = styled.div`
  font-weight: bold;
  color: #333;
`;

const CommentContent = styled.div<{ isHovered: boolean }>`
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  padding: 8px;
  width: 85%;
  text-align: justify;
  margin-top: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 1100px;
  margin-bottom: 10px;
`;

const ReactionWrapper = styled.div<{ isCommentReaction: ReactionStateTypes }>`
  background-color: ${(props) =>
    props.isCommentReaction === null
      ? 'white'
      : props.isCommentReaction === 'LIKE'
        ? 'red'
        : '#84d7fb'};
  padding: 10px;
  margin-right: 10px;
  margin-left: -10px;
  display: flex;
  align-items: center;
`;

const ReactionButton = styled.button<{ hovered: boolean }>`
  border: none;
  width: 65px;
  height: 30px;
  border-radius: 30px;
  background-color: ${(props) => (props.hovered ? '#c9c6c5' : '#f5f5f5')};
  cursor: pointer;
`;

const ReactionCount = styled.span`
  margin: 0 10px;
  width: 10px;
  height: 10px;
`;

const ActionButton = styled.button<{ hovered: boolean }>`
  background-color: ${(props) => (props.hovered ? '#c9c6c5' : '#f5f5f5')};
  border: none;
  width: 65px;
  height: 30px;
  border-radius: 30px;
  margin-right: 10px;
  cursor: pointer;
`;

const ReplyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 10px;
  border: 1px solid #ccc;
  padding: 10px;
`;

const ReplyTextarea = styled.textarea`
  width: 100%;
  border: none;
  border-radius: 14px;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
`;

const ReplyButtonContainer = styled.div`
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
