import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  CollectionTypes,
  ReactionStateTypes,
  ReactionType,
} from '../../_common/collectionTypes';
import {
  ReactionApi,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from '../api/reactionApi';
import logo from '../../assets/img/panda_logo.png';
import { ReplyType } from './BoardReply';
import { ReplySubmitAPI, ReplySubmitParams } from '../api/replyApi';
import { breakpoints } from '../../_common/breakpoint';

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

      ReactionApi(param)
        .then((res) => {
          const type = res.data.response?.type;
          if (type === undefined) setCommentIsReaction(null);
          else setCommentIsReaction(type);
        })
        .catch((err) => console.error(err));
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
        setIsCardCommentCount(resCount.count);
      })
      .catch((err) => console.error(err));
  }, [isCommentReaction]);

  return (
    <CommentContainer>
      <CommentHeader>
        <Avatar src={logo} alt={`${co.nickname}'s avatar`} />
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
        <ReactionWrapper>
          <ActionButton
            isActive={isCommentReaction === 'LIKE'}
            onMouseEnter={() => setIsCardCommentUpHovered(true)}
            onMouseLeave={() => setIsCardCommentUpHovered(false)}
            onClick={() => reactionCommentButton('LIKE')}
          >
            좋아요
          </ActionButton>

          <ReactionCount>{isCardCommentCount}</ReactionCount>

          <ActionButton
            isActive={isCommentReaction === 'DISLIKE'}
            onMouseEnter={() => setIsCardCommentDownHovered(true)}
            onMouseLeave={() => setIsCardCommentDownHovered(false)}
            onClick={() => reactionCommentButton('DISLIKE')}
          >
            싫어요
          </ActionButton>
        </ReactionWrapper>

        <CommentWrapper>
          {/*<ActionButton*/}
          {/*  onMouseEnter={() => setIsCardCommentReplyHovered(true)}*/}
          {/*  onMouseLeave={() => setIsCardCommentReplyHovered(false)}*/}
          {/*  onClick={() => setIsCommentReplyButton(!isCommentReplyButton)}*/}
          {/*>*/}
          {/*  답글*/}
          {/*</ActionButton>*/}
          <CommentButton
            isHovered={isCardCommentReplyHovered}
            onMouseEnter={() => setIsCardCommentReplyHovered(true)}
            onMouseLeave={() => setIsCardCommentReplyHovered(false)}
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
              Cancel
            </CancelButton>
            <SubmitButton onClick={replyWrite}>Comment</SubmitButton>
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
`;

const CommentHeader = styled.div`
  display: flex;
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

const ReactionWrapper = styled.div`
  margin-right: 5px;
  border-radius: 30px;
  width: 160px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}) {
    width: 120px;
  }
`;

const ActionButton = styled.button<{ readonly isActive?: boolean }>`
  border: ${(props) => (props.isActive ? '2px solid blue' : '1px solid gray')};
  background-color: ${(props) => (props.isActive ? '#c9c6c5' : '#f5f5f5')};
  width: 100%;
  height: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 50px;
    height: 40px;
    font-size: 10px;
  }
`;

const ReactionCount = styled.span`
  margin: 10px;
  width: 10px;
  height: 10px;
`;

const ReplyBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
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
  justify-content: center;
  align-items: center;

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
