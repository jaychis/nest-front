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
import RightSideBar from '../Global/RightSideBar';
import { useLocation } from 'react-router-dom';

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
  const id = query.get('id');
  const title = query.get('title');
  const content = query.get('content');

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
            <div style={{ marginLeft: '40px' }}>
              {co.replies?.length > 0 ? renderReplies(co.replies) : []}
            </div>
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', width: '90%' }}>
          <div style={{ flex: 2 }}>
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '80%',
                margin: '10px',
                border: '3px solid #ccc',
                borderRadius: '30px',
                padding: '10px',
                marginLeft: '-0.5%',
              }}
            >
              <textarea
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                name={'content'}
                value={writeComment.content}
                onChange={(value) =>
                  commentHandleChange({
                    name: value.target.name,
                    value: value.target.value,
                  })
                }
              ></textarea>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '10px',
                }}
              >
                <button
                  style={{
                    padding: '6px 12px',
                    marginLeft: '5px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    commentWrite();
                  }}
                  style={{
                    padding: '6px 12px',
                    marginLeft: '5px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    backgroundColor: '#84d7fb',
                    color: 'white',
                  }}
                >
                  Comment
                </button>
              </div>
            </div>
            {isCommentState?.length > 0 ? renderComments(isCommentState) : []}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardRead;
