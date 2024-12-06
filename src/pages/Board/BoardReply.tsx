import React, { useEffect, useState } from 'react';
import {
  ReactionStateTypes,
  ReactionType,
} from '../../_common/collectionTypes';
import {
  ReactionApi,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from '../api/reactionApi';
import styled from 'styled-components';
import logo from '../../assets/img/panda_logo.png';

export interface ReplyType {
  readonly id: string;
  readonly comment_id: string;
  readonly user_id: string;
  readonly content: string;
  readonly nickname: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: null;
}

const BoardReply = (re: ReplyType) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCardReplyCount, setIsCardReplyCount] = useState<number>(0);
  const [isCardReplyUpHovered, setIsCardReplyUpHovered] =
    useState<boolean>(false);
  const [isCardReplyDownHovered, setIsCardReplyDownHovered] =
    useState<boolean>(false);
  const [isCardReplyShareHovered, setIsCardReplyShareHovered] =
    useState<boolean>(false);
  const [isCardReplySendHovered, setIsCardReplySendHovered] =
    useState<boolean>(false);
  const [isReplyReaction, setReplyIsReaction] =
    useState<ReactionStateTypes>(null);
  const [isReplyReplyButton, setIsReplyReplyButton] = useState<boolean>(false);

  const ID: string = re.id;
  const USER_ID: string = localStorage.getItem('id') as string;

  const reactionReplyButton = async (type: ReactionStateTypes) => {
    if (type !== null) {
      const param: ReactionParams = {
        boardId: ID,
        userId: USER_ID,
        type,
        reactionTarget: 'REPLY',
      };

      try {
        const res = await ReactionApi(param);
        const resType = res.data.response?.type;
        if (resType === undefined) setReplyIsReaction(null);
        else setReplyIsReaction(resType);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    ReactionListAPI({ boardId: ID })
      .then((res) => {
        res.data.response.forEach((el: ReactionType) => {
          if (USER_ID === el.user_id) {
            setReplyIsReaction(el.type);
          }
        });
      })
      .catch((err) => console.error('BoardReply ReactionListAPI err : ', err));

    ReactionCountAPI({ boardId: ID })
      .then((res) => {
        setIsCardReplyCount(res.data.response.count);
      })
      .catch((err) => console.error('BoardReply ReactionCountAPI err : ', err));
  }, [isReplyReaction]);

  return (
    <ReplyContainer>
      <ReplyHeader>
        <Avatar src={logo} alt={`${re.nickname}'s avatar`} />
        <Nickname>{re.nickname}</Nickname>
      </ReplyHeader>
      <ReplyContent
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        isHovered={isHovered}
      >
        {re.content}
      </ReplyContent>
      <ReactionContainer>
        <ReactionButton
          isCommentReaction={isReplyReaction}
          onMouseEnter={() => setIsCardReplyUpHovered(true)}
          onMouseLeave={() => setIsCardReplyUpHovered(false)}
          onClick={() => reactionReplyButton('LIKE')}
          isHovered={isCardReplyUpHovered}
        >
          좋아요
        </ReactionButton>
        <ReactionCount>{isCardReplyCount}</ReactionCount>
        <ReactionButton
          isCommentReaction={isReplyReaction}
          onMouseEnter={() => setIsCardReplyDownHovered(true)}
          onMouseLeave={() => setIsCardReplyDownHovered(false)}
          onClick={() => reactionReplyButton('DISLIKE')}
          isHovered={isCardReplyDownHovered}
        >
          싫어요
        </ReactionButton>
        <ShareButton
          isHovered={isCardReplyShareHovered}
          onMouseEnter={() => setIsCardReplyShareHovered(true)}
          onMouseLeave={() => setIsCardReplyShareHovered(false)}
        >
          공유
        </ShareButton>
        <SendButton
          isHovered={isCardReplySendHovered}
          onMouseEnter={() => setIsCardReplySendHovered(true)}
          onMouseLeave={() => setIsCardReplySendHovered(false)}
          onClick={() => alert('BoardReply Button Click')}
        >
          보내기
        </SendButton>
      </ReactionContainer>
      {isReplyReplyButton && (
        <ReplyInputContainer>
          <ReplyTextarea />
          <ReplyActions>
            <CancelButton onClick={() => setIsReplyReplyButton(false)}>
              Cancel
            </CancelButton>
            <CommentButton>Comment</CommentButton>
          </ReplyActions>
        </ReplyInputContainer>
      )}
    </ReplyContainer>
  );
};

const ReplyContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  margin-bottom: 10px;
`;

const ReplyHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 30%;
  margin-right: 18px;
`;

const Nickname = styled.div`
  font-weight: bold;
  color: #333;
`;

const ReplyContent = styled.div<{ isHovered: boolean }>`
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  border-radius: 10px;
  padding: 8px;
  width: 100%;
  margin-top: 4px;
`;

const ReactionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
`;

const ReactionButton = styled.button<{
  readonly isHovered: boolean;
  readonly isCommentReaction: ReactionStateTypes;
}>`
  border: ${(props) =>
    props.isCommentReaction === null
      ? '1px solid gray'
      : props.isCommentReaction === 'LIKE'
        ? '2px solid blue'
        : '2px solid red'};
  padding: 10px;
  margin-right: 10px;
  border-radius: 20px;
  width: 65px;
  height: 30px;
  background-color: ${(props) => (props.isHovered ? '#c9c6c5' : '#f5f5f5')};
  border-color: ${(props) => (props.isHovered ? 'red' : '#e0e0e0')};
  cursor: pointer;
`;

const ReactionCount = styled.span`
  margin: 0 10px;
  width: 10px;
  height: 10px;
`;

const ShareButton = styled.button<{ isHovered: boolean }>`
  border: none;
  padding: 10px;
  margin-right: 10px;
  border-radius: 20px;
  width: 65px;
  height: 30px;
  background-color: ${(props) => (props.isHovered ? '#c9c6c5' : '#f5f5f5')};
  cursor: pointer;
`;

const SendButton = styled.button<{ isHovered: boolean }>`
  border: none;
  padding: 10px;
  margin-right: 10px;
  border-radius: 20px;
  width: 65px;
  height: 30px;
  background-color: ${(props) => (props.isHovered ? '#c9c6c5' : '#f5f5f5')};
  cursor: pointer;
`;

const ReplyInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px;
  border: 3px solid #ccc;
  border-radius: 30px;
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

const CommentButton = styled(CancelButton)`
  background-color: #007bff;
  color: white;
`;

export default BoardReply;
