import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import React from "react";
import { CommentListAPI, CommentSubmitAPI, CommentInquiryAPI} from "../pages/api/CommentApi";
import { submitCommentContactApi,CommentSubmitParams,commentContactListApi } from "../pages/api/InquiryApi";

interface InquiryProps{
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
    active
}:InquiryProps) => {

    const contentWrapperRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const CommentWrapperRef = React.useRef<HTMLDivElement>(null);
    const CommentRef = React.useRef<HTMLDivElement>(null);
    const [isCollapse, setIsCollapse] = React.useState(false);
    const [textContent, setTextContent] = useState('');
    const [comment, setComment] = useState<string>();
    const [commentContent, setCommentContent] = useState<string>('');
    const nickname = localStorage.getItem('nickname') as string;
    {/* comment는 CommentInquiryAPI를 통해 받아온 데이터를 저장 
        이후 comment값 존재 여부에 따라 댓글입력창이 보일지 댓글 내용이 보일지 여부가 결정되는데
        textarea에서 onChange와 setComment로 comment의 값을 넣어주는 순간 
        comment != null 로 판단돼 댓글입력창이 사라져버려서 comment와 commentContent로 구분
        textarea에서 입력하는 값을 감지하여 최종 제출하기 위한 변수가 commentContent 
        문의내역에 답변이 달렸는지 판단해 주기 위한 변수가 comment */}
    
    const submitComment = async () => {
        if(commentContent.trim() === '' || commentContent.length === 0){
            return alert('내용을 작성해주세요')
        }
            const contactUsId = id 
            const userId= localStorage.getItem('id') as string
            const content= commentContent

        const res = await submitCommentContactApi({contactUsId, userId, content, nickname });
        if(!res) return;
        alert('답변이 등록되었습니다.');
        window.location.reload();
    }

    const getComment = async ():Promise<void> => {
        try{
            const res = await commentContactListApi(id)
            if(res?.data.response[0]){
            setComment(res?.data.response[0].content)
        }}
        catch(error){
            console.error(error)
        }
    }

    const handleCommentChange = async (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):Promise<void> => {
        const {value} = event.target;
        setCommentContent(value)
    }
    
    useEffect(() => {
        getComment()
        const pTagSlice = () => {
            if (content.startsWith('<p>') && content.endsWith('</p>')) {
                setTextContent(content.slice(3, -4));
            }
            else(setTextContent(content))
    };
    pTagSlice();
    },[content])

    const handleButtonClick = React.useCallback((event:any) => {
        event.stopPropagation();
        if (contentWrapperRef.current === null || contentRef.current === null || CommentWrapperRef.current === null || CommentRef.current === null) {
          return;
        }
        if (contentWrapperRef.current.clientHeight > 0) {
          contentWrapperRef.current.style.height = "0";
          contentWrapperRef.current.style.margin = '0';
          CommentWrapperRef.current.style.height = "0";
          CommentWrapperRef.current.style.margin = "0";
        } else {
          contentWrapperRef.current.style.height = `${contentRef.current.clientHeight}px`;
          contentWrapperRef.current.style.margin = '20px';
          CommentWrapperRef.current.style.height = `${CommentRef.current.clientHeight + 30}px`;
          CommentWrapperRef.current.style.margin = `20px`;
        }
        setIsCollapse((prev) => !prev);
      }, []);
      
    return(
    <>
        <InquiryListContainer onClick = {(event) => {handleButtonClick(event)}}>
            <TitleButton>
                <TitleWrapper> [{active}] {title.slice(0,25)} </TitleWrapper>
            </TitleButton>
            <ArrowImage src="https://img.icons8.com/ios/50/expand-arrow--v1.png" />
        </InquiryListContainer>
        <ContentWrapper ref = {contentWrapperRef}>
            <Content ref={contentRef}>{textContent}</Content>
        </ContentWrapper>
        <hr style = {{border : '1px solid #f0f0f0', width : '95%',}}/>
        <CommentWrapper ref = {CommentWrapperRef}>
            {comment === undefined && localStorage.getItem('nickname') === 'admin' ? <Comment ref={CommentRef}><div style={{
            display: "flex",
            flexDirection: "column",
            width: "95%",
            margin: "10px",
            border: "3px solid #ccc",
            borderRadius: "30px",
            padding: "10px",
            marginLeft : '-0.5%',
            
        }}>
            <textarea 
            style={{
            width: "100%",
            border: "none",
            borderRadius: "14px",
            resize: "vertical",
            boxSizing: "border-box",
            outline: "none",
            }} 
            value = {commentContent}
            onChange={handleCommentChange}
            name={"content"} ></textarea>
            <div style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
            }}>
            <button style={{
                padding: "6px 12px",
                marginLeft: "5px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                backgroundColor: "#f5f5f5",
                color: "#333",
            }}>
                Cancel
            </button>
            <button
            onClick = {() => {submitComment()}}
            style={{
            padding: "6px 12px",
            marginLeft: "5px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            backgroundColor: "#84d7fb",
            color: "white",
            }} >
                Comment
            </button>
            </div>
        </div></Comment>  : 
            <Comment ref={CommentRef}>
                {comment}
            </Comment>}
        </CommentWrapper>
    </>
    )
}

export default InquiryList;

const InquiryListContainer = styled.div `
    display: flex;
    width: 100%;
    max-width: 1000px;
    min-height: 50px;
    margin-top : 10px;
    
    border-radius: 10px;
    cursor: pointer;
    background: white;
    justify-content: space-between;
`

const TitleWrapper = styled.div`
    display : flex;
    font-size : 26px;
    font-weight : 500;
    color : rgb(80, 80, 80);
`

const TitleButton = styled.button`
    border : none;
    background : white;
    cursor : pointer;
`

const ArrowImage = styled.img`
    display : flex;
    height : 30px;
    margin-top : auto;
    margin-bottom : auto;
`

const ContentWrapper = styled.div`
    height : 0;
    width : 100%;
    overflow : hidden;
    transition: height 0.35s ease, margin 0.35s ease;
    margin-top : 0;
`

const Content = styled.div`
    margin-left : 35px;
    font-weight : 100;
`

const CommentWrapper = styled.div`
    height : 0;
    width : 100%;
    overflow : hidden;
    transition: height 0.35s ease, margin 0.35s ease;
    margin-top : 0;
`

const Comment = styled.div`
    margin-left : 35px;
    font-weight : 100;
`