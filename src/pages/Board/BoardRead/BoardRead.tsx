import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from '../../../components/Card';
import { BoardReadAPI } from '../../api/boardApi';
import { CardType, CollectionTypes } from '../../../_common/collectionTypes';
import {
  CommentListAPI,
  CommentSubmitAPI,
  CommentSubmitParams,
} from '../../api/commentApi';
import BoardComment, { CommentType } from './BoardComment';
import BoardReply, {ReplyType} from './BoardReply';
import { useLocation } from 'react-router-dom';
import { LogViewedBoardAPI } from '../../api/viewedBoardsApi';
import { breakpoints } from '../../../_common/breakpoint';

const BoardRead = () => {
  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };

  const query = useQuery();
  const ID: string = query.get('id') as string;
  const USER_Id: string = localStorage.getItem('id') as string;

  const [isBoardState, setIsBoardStateBoard] = useState<CardType>({
    id: ID,
    user_id: '',
    category: '',
    content: [],
    title: '',
    nickname: '',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    type: 'TEXT',
    share_count: 0,
  });
  const [isCommentState, setIsCommentState] = useState<CommentType[]>([]);

  useEffect(() => {
    if (!ID) return;
    const readBoard = async (): Promise<void> => {
      const commentRes = await CommentListAPI({ boardId: ID });
      if (!commentRes) return;
      const commentResponse = commentRes.data.response;

      setIsCommentState([...commentResponse]);
      const res = await BoardReadAPI({
        id: ID,
      });

      if (!res) return;
      const response = res.data.response;

      setIsBoardStateBoard(response);

      if(!localStorage.getItem('accessToken')) return
      const logViewBoard = await LogViewedBoardAPI({
        userId: USER_Id,
        boardId: response.id,
      })
      if (!logViewBoard) return;
    };

    readBoard();
  }, [ID]);

  const [writeComment, setWriteComment] = useState<CommentSubmitParams>({
    boardId: ID,
    content: '',
    nickname: (localStorage.getItem('nickname') as string) || '',
    userId: USER_Id || '',
  });

  const commentHandleChange = (event: CollectionTypes) => {
    const { name, value } = event;
    setWriteComment({
      ...writeComment,
      [name]: value,
    });
  };

  const commentWrite = () => {
    if (!writeComment.content) {
      alert('댓글을 내용을 입력해주세요');
      return;
    } else {
      const param: CommentSubmitParams = {
        boardId: writeComment.boardId,
        userId: writeComment.userId,
        content: writeComment.content,
        nickname: writeComment.nickname,
      };

      const commentSubmit = async (): Promise<void> => {
        const res = await CommentSubmitAPI(param);
        if (!res) return;

        const response = res.data.response;
        setIsCommentState([response, ...isCommentState]);
        setWriteComment((prev) => ({
          ...prev,
          content: '',
        }));
      };
      commentSubmit();
    }
  };

  const renderReplies = (replies: ReplyType[]) => {
    return (
      <RepliesContainer>
        {replies.map((re: ReplyType) => (
          <BoardReply
            key={re.id}
            id={re.id}
            comment_id={re.comment_id}
            user_id={re.user_id}
            content={re.content}
            nickname={re.nickname}
            created_at={re.created_at}
            updated_at={re.updated_at}
            deleted_at={re.deleted_at}
          />
        ))}
      </RepliesContainer>
    );
  };

  const renderComments = (comments: CommentType[]) => {
    return (
      <CommentsContainer>
        {comments.map((co) => (
          <CommentContainer key={co.id}>
            <BoardComment {...co} onReplySubmit={handleReplySubmit} />
            <RepliesWrapper>
              {co.replies?.length > 0 ? renderReplies(co.replies) : null}
            </RepliesWrapper>
          </CommentContainer>
        ))}
      </CommentsContainer>
    );
  };

  const handleReplySubmit = (reply: ReplyType) => {
    setIsCommentState((prevState: CommentType[]) => {
      const updatedComments = prevState.map((comment: CommentType) => {
        if (comment.id === reply.comment_id) {
          const replyList = comment?.replies
            ? [...comment.replies, reply]
            : [reply];
          return { ...comment, replies: replyList };
        } else {
          return comment;
        }
      });
      return updatedComments;
    });
  };

  return (
    <BoardReadContainer>
      <CardContainer>
        {!isBoardState?.id ? null : (
          <Card
            id={isBoardState.id}
            category={isBoardState.category}
            title={isBoardState.title}
            nickname={isBoardState.nickname}
            createdAt={isBoardState.created_at}
            content={isBoardState.content}
            type={isBoardState.type}
            shareCount={isBoardState.share_count}
            userId={isBoardState.user_id}
          />
        )}
        <CommentSection>
          <CommentTextArea
            wrap="hard"
            name={'content'}
            value={writeComment.content}
            onChange={(value) =>
              commentHandleChange({
                name: value.target.name,
                value: value.target.value,
              })
            }
          />
          <ButtonGroup>
            <CancelButton>취소</CancelButton>
            <CommentButton onClick={commentWrite}>댓글</CommentButton>
          </ButtonGroup>
        </CommentSection>
        {isCommentState?.length > 0 ? renderComments(isCommentState) : null}
      </CardContainer>
    </BoardReadContainer>
  );
};

export default BoardRead;

const BoardReadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  width: 100%;
  height: auto;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 100%;
  }
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  border: 3px solid #ccc;
  border-radius: 30px;
  padding: 5px 15px;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}) {
    max-width: 95%;
  }
`;

const CommentTextArea = styled.textarea`
  width: 100%;
  height: 90px;
  border: none;
  border-radius: 14px;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
`;

const ButtonGroup = styled.div`
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

const CommentButton = styled.button`
  padding: 6px 12px;
  margin-left: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #84d7fb;
  color: white;
`;

const CommentsContainer = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const CommentContainer = styled.div``;

const RepliesWrapper = styled.div`
  margin-left: 40px;
`;

const RepliesContainer = styled.div`
  margin-top: 10px;
  padding: 0 15px;
`;
