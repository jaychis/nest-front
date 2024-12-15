import { useEffect, useState } from 'react';
import styled from 'styled-components';
import React from 'react';
import {
  submitCommentContactApi,
  commentContactListApi,
} from '../pages/api/inquiryApi';

interface InquiryProps {
  readonly content: string;
  readonly created_at: Date;
  readonly deleted_at?: Date;
  readonly id: string;
  readonly nickname?: string;
  readonly title: string;
  readonly update_at: Date;
  readonly active?: string;
}

const InquiryList = ({
  content,
  created_at,
  id,
  title,
  update_at,
  active,
}: InquiryProps) => {
  const contentWrapperRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const CommentContainerRef = React.useRef<HTMLDivElement>(null);
  const CommentRef = React.useRef<HTMLDivElement>(null);
  const [isCollapse, setIsCollapse] = React.useState(false);
  const [textContent, setTextContent] = useState('');
  const [comment, setComment] = useState<string>();
  const [commentContent, setCommentContent] = useState<string>('');
  const nickname = localStorage.getItem('nickname') as string;
  {
    /* comment는 CommentInquiryAPI를 통해 받아온 데이터를 저장 
        이후 comment값 존재 여부에 따라 댓글입력창이 보일지 댓글 내용이 보일지 여부가 결정되는데
        textarea에서 onChange와 setComment로 comment의 값을 넣어주는 순간 
        comment != null 로 판단돼 댓글입력창이 사라져버려서 comment와 commentContent로 구분
        textarea에서 입력하는 값을 감지하여 최종 제출하기 위한 변수가 commentContent 
        문의내역에 답변이 달렸는지 판단해 주기 위한 변수가 comment */
  }

  const submitComment = async () => {
    if (commentContent.trim() === '' || commentContent.length === 0) {
      return alert('내용을 작성해주세요');
    }
    const contactUsId = id;
    const userId = localStorage.getItem('id') as string;
    const content = commentContent;

    const res = await submitCommentContactApi({
      contactUsId,
      userId,
      content,
      nickname,
    });
    if (!res) return;
    alert('답변이 등록되었습니다.');
    window.location.reload();
  };

  const getComment = async (): Promise<void> => {
    try {
      const res = await commentContactListApi(id);
      if (res?.data.response[0]) {
        setComment(res?.data.response[0].content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setCommentContent(value);
  };

  useEffect(() => {
    getComment();
    const pTagSlice = () => {
      if (content.startsWith('<p>') && content.endsWith('</p>')) {
        setTextContent(content.slice(3, -4));
      } else setTextContent(content);
    };
    pTagSlice();
  }, [content]);

  const handleButtonClick = React.useCallback((event: any) => {
    event.stopPropagation();
    if (
      contentWrapperRef.current === null ||
      contentRef.current === null ||
      CommentContainerRef.current === null ||
      CommentRef.current === null
    ) {
      return;
    }
    if (contentWrapperRef.current.clientHeight > 0) {
      contentWrapperRef.current.style.height = '0';
      contentWrapperRef.current.style.margin = '0';
      CommentContainerRef.current.style.height = '0';
      CommentContainerRef.current.style.margin = '0';
    } else {
      contentWrapperRef.current.style.height = `${contentRef.current.clientHeight}px`;
      contentWrapperRef.current.style.margin = '20px';
      CommentContainerRef.current.style.height = `${CommentRef.current.clientHeight + 30}px`;
      CommentContainerRef.current.style.margin = `20px`;
    }
    setIsCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <InquiryListContainer
        onClick={(event) => {
          handleButtonClick(event);
        }}
      >
        <TitleButton>
          <TitleWrapper>
            {' '}
            [{active}] {title.slice(0, 25)}{' '}
          </TitleWrapper>
        </TitleButton>
        <ArrowImage src="https://img.icons8.com/ios/50/expand-arrow--v1.png" />
      </InquiryListContainer>
      <ContentWrapper ref={contentWrapperRef}>
        <Content ref={contentRef}>{textContent}</Content>
      </ContentWrapper>
      <hr style={{ border: '1px solid #f0f0f0', width: '95%' }} />
      <CommentContainer ref={CommentContainerRef}>
        {comment === undefined &&
        localStorage.getItem('nickname') === 'admin' ? (
          <Comment ref={CommentRef}>
            <HiddenAdminInputContainer>
              <InputAdmin
                value={commentContent}
                onChange={handleCommentChange}
                name={'content'}
              ></InputAdmin>
              <HiddenButtonContainer>
                <StyledButton
                color={'#333'}
                backgroundColor={'#f5f5f5'}
                >
                  Cancel
                </StyledButton>
                <StyledButton
                onClick={() => {submitComment();}}
                backgroundColor= {'#84d7fb'}
                color= {'white'}
                >
                  Comment
                </StyledButton>
              </HiddenButtonContainer>
            </HiddenAdminInputContainer>
          </Comment>
        ) : (
          <Comment ref={CommentRef}>{comment}</Comment>
        )}
      </CommentContainer>
    </>
  );
};

export default InquiryList;

const InquiryListContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-height: 50px;
  margin-top: 10px;

  border-radius: 10px;
  cursor: pointer;
  background: white;
  justify-content: space-between;
`;

const TitleWrapper = styled.div`
  display: flex;
  font-size: 26px;
  font-weight: 500;
  color: rgb(80, 80, 80);
`;

const TitleButton = styled.button`
  border: none;
  background: white;
  cursor: pointer;
`;

const ArrowImage = styled.img`
  display: flex;
  height: 30px;
  margin-top: auto;
  margin-bottom: auto;
`;

const ContentWrapper = styled.div`
  height: 0;
  width: 100%;
  overflow: hidden;
  transition:
    height 0.35s ease,
    margin 0.35s ease;
  margin-top: 0;
`;

const Content = styled.div`
  margin-left: 35px;
  font-weight: 100;
`;

const CommentContainer = styled.div`
  height: 0;
  width: 100%;
  overflow: hidden;
  transition:
    height 0.35s ease,
    margin 0.35s ease;
  margin-top: 0;
`;

const Comment = styled.div`
  margin-left: 35px;
  font-weight: 100;
`;

const HiddenAdminInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 10px;
  border: 3px solid #ccc;
  border-radius: 30px;
  padding: 10px;
  margin-left: -0.5%;
`;

const InputAdmin = styled.textarea`
  width: 100%;
  border: none;
  border-radius: 14px;
  resize: vertical;
  box-sizing: border-box;
  outline: none;
`;

const HiddenButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const StyledButton = styled.button<{color:string, backgroundColor: string}>`
  padding: 6px 12px;
  margin-left: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: ${(props) => props.backgroundColor || 'inherit'};
  color: ${(props) => props.color || 'inherit'};
`;