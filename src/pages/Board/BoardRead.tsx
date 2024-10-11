import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card';
import { ReadAPI } from '../api/BoardApi';
import { CardType, CollectionTypes } from '../../_common/CollectionTypes';
import {
  CommentListAPI,
  CommentSubmitAPI,
  CommentSubmitParams,
} from '../api/CommentApi';
import BoardComment, { CommentType } from './BoardComment';
import BoardReply, { ReplyType } from './BoardReply';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BoardRead = () => {
  const BOARD_ID: string = sessionStorage.getItem('boardId') as string;
  const BOARD_TITLE: string = sessionStorage.getItem('boardTitle') as string;
  useEffect(() => {
    console.log('BOARD_ID : ', BOARD_ID);
  }, [BOARD_ID]);
  const [isBoardState, setIsBoardStateBoard] = useState<CardType>({
    id: BOARD_ID,
    identifier_id: '',
    category: '',
    content: [],
    title: BOARD_TITLE,
    nickname: '',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    type: 'TEXT',
    share_count: 0,
  });
  const [isCommentState, setIsCommentState] = useState<CommentType[]>([]);

  const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  };

  const query = useQuery();
  const id = query.get('id') as string;
  const title = query.get('title');

  useEffect(() => {
    const readBoard = async (): Promise<void> => {
      const commentRes = await CommentListAPI({ boardId: id });

      if (!commentRes) return;
      const commentResponse = commentRes.data.response;
      console.log('commentResponse : ', commentResponse);
      setIsCommentState([...commentResponse]);

      const res = await ReadAPI({
        id: id,
        title: title,
      });

      if (!res) return;
      const response = res.data.response;
      console.log('response : ', response);

      setIsBoardStateBoard(response);
    };
    readBoard();
  }, []);

  const [writeComment, setWriteComment] = useState<CommentSubmitParams>({
    boardId: BOARD_ID,
    content: '',
    nickname: (localStorage.getItem('nickname') as string) || '',
    userId: (localStorage.getItem('id') as string) || '',
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
      <div>
        {replies.map((re: ReplyType) => (
          <div key={re.id}>
            <BoardReply
              id={re.id}
              comment_id={re.comment_id}
              user_id={re.user_id}
              content={re.content}
              nickname={re.nickname}
              created_at={re.created_at}
              updated_at={re.updated_at}
              deleted_at={re.deleted_at}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderComments = (comments: CommentType[]) => {
    return (
      <div>
        {comments.map((co) => (
          <div key={co.id}>
            <BoardComment
              id={co.id}
              board_id={co.board_id}
              user_id={co.user_id}
              content={co.content}
              nickname={co.nickname}
              replies={co.replies}
              created_at={co.created_at}
              updated_at={co.updated_at}
              deleted_at={co.deleted_at}
              onReplySubmit={handleReplySubmit}
            />
            <RepliesContainer>
              {co.replies?.length > 0 ? renderReplies(co.replies) : null}
            </RepliesContainer>
          </div>
        ))}
      </div>
    );
  };

  const handleReplySubmit = (reply: ReplyType) => {
    setIsCommentState((prevState: CommentType[]) => {
      const updatedComments = prevState.map((comment: CommentType) => {
        if (comment.id === reply.comment_id) {
          return { ...comment, replies: [...comment.replies, reply] };
        } else {
          return comment;
        }
      });

      return updatedComments;
    });
  };

  useEffect(() => {
    console.log('isBoardState : ', isBoardState);
  }, [isBoardState]);
  return (
    <>
      {/*<GlobalBar />*/}
      <OuterContainer>
        <InnerContainer>
          <ContentContainer>
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
              />
            )}
            <CommentContainer>
              <StyledTextarea
                name="content"
                value={writeComment.content}
                onChange={(value) =>
                  commentHandleChange({
                    name: value.target.name,
                    value: value.target.value,
                  })
                }
              />
              <ButtonContainer>
                <CancelButton>Cancel</CancelButton>
                <CommentButton
                  onClick={() => {
                    commentWrite();
                  }}
                >
                  Comment
                </CommentButton>
              </ButtonContainer>
            </CommentContainer>
            {isCommentState?.length > 0 ? renderComments(isCommentState) : null}
          </ContentContainer>
        </InnerContainer>
      </OuterContainer>
    </>
  );
};

export default BoardRead;

/* 스타일드 컴포넌트 */
const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

const InnerContainer = styled.div`
  display: flex;
  width: 90%;
`;

const ContentContainer = styled.div`
  flex: 2;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 10px;
  border: 3px solid #ccc;
  border-radius: 30px;
  padding: 10px;
  margin-left: -0.5%;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: none;
  border-radius: 14px;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
`;

const ButtonContainer = styled.div`
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

const RepliesContainer = styled.div`
  margin-left: 40px;
`;
