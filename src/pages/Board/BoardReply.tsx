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
import { breakpoints } from '../../_common/breakpoint';
import { handleReaction } from '../../_common/handleUserReaction';

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
  const [isCardReplyUpHovered, setIsCardReplyUpHovered] =
    useState<boolean>(false);
  const [isCardReplyDownHovered, setIsCardReplyDownHovered] =
    useState<boolean>(false);
  const [isCardReplyShareHovered, setIsCardReplyShareHovered] =
    useState<boolean>(false);
  const [isCardReplySendHovered, setIsCardReplySendHovered] =
    useState<boolean>(false);

  const [isReplyReplyButton, setIsReplyReplyButton] = useState<boolean>(false);

  const ID: string = re.id;
  const USER_ID: string = localStorage.getItem('id') as string;

  const [localCount, setLocalCount] = useState<number>(0);
  const [isReplyReaction, setReplyIsReaction] =
    useState<ReactionStateTypes>(null);
  const [isCardReplyCount, setIsCardReplyCount] = useState<number>(0);

  const reactionReplyButton = async (userReaction: ReactionStateTypes) => {
    console.log('userReaction : ', userReaction);
    console.log('isReplyReaction : ', isReplyReaction);
    console.log('localCount : ', localCount);
    if (userReaction !== null) {
      const param: ReactionParams = {
        boardId: ID,
        userId: USER_ID,
        type: userReaction,
        reactionTarget: 'REPLY',
      };

      try {
        const res = await ReactionApi(param);
        if (!res) return;

        const status: number = res.status;
        if (status === 201) {
          await handleReaction({
            localCount,
            userReaction,
            isReaction: isReplyReaction,
            setIsReaction: setReplyIsReaction,
            isCardCount: isCardReplyCount,
            setIsCardCount: setIsCardReplyCount,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  useEffect(() => {
    if (localCount < 0) {
      setLocalCount(0);
    }
  }, [localCount]);

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
        const resCount = res.data.response;

        const count: number =
          resCount.board_score < 0 ? 0 : resCount.board_score;
        setIsCardReplyCount(count);
        setIsCardReplyCount(count);
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
        <ReactionWrapper>
          <LikeReactionButton
            isCommentReaction={isReplyReaction}
            onMouseEnter={() => setIsCardReplyUpHovered(true)}
            onMouseLeave={() => setIsCardReplyUpHovered(false)}
            onClick={() => reactionReplyButton('LIKE')}
            isHovered={isCardReplyUpHovered}
          >
            좋아요
          </LikeReactionButton>
          <ReactionCount>{isCardReplyCount}</ReactionCount>
          <DisLikeReactionButton
            isCommentReaction={isReplyReaction}
            onMouseEnter={() => setIsCardReplyDownHovered(true)}
            onMouseLeave={() => setIsCardReplyDownHovered(false)}
            onClick={() => reactionReplyButton('DISLIKE')}
            isHovered={isCardReplyDownHovered}
          >
            싫어요
          </DisLikeReactionButton>
        </ReactionWrapper>
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

  position: relative;
  overflow: hidden;
  box-sizing: border-box;
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

  object-fit: contain;
  box-sizing: border-box;
`;

const ReactionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
  height: 100%;
  margin-top: 5px;
  max-height: 80px;
`;

const ReactionWrapper = styled.div`
  margin-right: 5px;
  border-radius: 30px;
  width: 160px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}) {
    width: 140px;
  }
`;

const LikeReactionButton = styled.button<{
  readonly isHovered: boolean;
  readonly isCommentReaction: ReactionStateTypes;
}>`
  border: ${(props) =>
    props.isCommentReaction === 'LIKE' ? '2px solid blue' : '1px solid gray'};

  margin-right: 10px;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 50px;
    height: 40px;
    font-size: 10px;
  }
`;

const DisLikeReactionButton = styled.button<{
  readonly isHovered: boolean;
  readonly isCommentReaction: ReactionStateTypes;
}>`
  border: ${(props) =>
    props.isCommentReaction === 'DISLIKE' ? '2px solid red' : '1px solid gray'};

  margin-right: 10px;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 50px;
    height: 40px;
    font-size: 10px;
  }
`;

const ReactionCount = styled.span`
  margin: 0 10px;
  width: 10px;
  height: 10px;
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
