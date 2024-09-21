import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UsersInquiryAPI } from "../api/UserApi";
import EmptyState from "../../components/EmptyState";
import { getContactAllListAPi } from "../api/InquiryApi";
import { InquiryType } from "../../_common/CollectionTypes";
import InquiryList from "../../components/InquiryList";
import SubmitInquiry from "./SubmitInquiry";
import styled from "styled-components";
import { CommentInquiryAPI,CommentSubmitAPI } from "../api/CommentApi";
import debounce from "lodash.debounce";

interface ContainerProps {
  children?: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

// const CardsContainer: React.FC<ContainerProps> = ({ children }) => {
const CardsContainer = ({ children }: ContainerProps) => {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "1100px", // 적절한 최대 너비 설정
        boxSizing: "border-box",
        padding: "0 20px", // 좌우 패딩 추가
      }}
    >
      {children}
    </div>
  );
};

const UsersInquiry = () => {
  const [params, setParams] = useSearchParams();
  const [list, setList] = useState<InquiryType[]>([]);
  const TAKE: number = 10;
  const nickname:string = localStorage.getItem('nickname') as string;
  const [isopen, setIsopen] = useState<boolean>(false);
  const userId:string = localStorage.getItem('id') as string;
  const [comment, setComment] = useState<string | null>();
  const [count, setCount] = useState<number>(0);

  const checkComment = (number:number):number => {
    setComment('Hello World');
    return 0;
  }

  /*
  댓글조회 
  CommentInquiryAPI({userId}).then((res) => {
    const status = res?.data.response
    setData(status);
    console.log(status)
  })*/

  const getAllList = () => {
    return getContactAllListAPi({take :TAKE, page : 1, nickname : nickname})
    .then((res) => {
      const status = res?.data.response.current_list
      setList(status)
      console.log(status)
    })
    .catch((error) => {
      console.error(error)
      setCount((prev) => prev + 1)
    })
  }

  useEffect(() => {
    if(count < 10) getAllList()
  },[count])

  if(!list){
    return(
    <div>로딩중..</div>)
  }

  return (
    <>
    <SubmitInquiry
    isopen = {isopen}
    setIsopen={setIsopen}
    />
        <MainContainer>
          <CardsContainer>
            <br/><br/><br/><br/><br/><br/>
            <SubmitButton onClick = {() => {setIsopen(true)}}>글 작성</SubmitButton>
            {list.length > 0 ? (
              list.map((el, index) => {
                return (
                  <>
                    <InquiryList 
                      content = {el.content}
                      created_at={el.created_at}
                      id = {el.id}
                      nickname={el.nickname}
                      title = {el.title}
                      update_at={el.update_at}
                    />
                  </>
                );
              })
            ) : (
              <EmptyState /> // Use the EmptyState component
            )}
          </CardsContainer>
        </MainContainer>
    </>
  );
};

const SubmitButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 88%;
  margin-bottom: 15px;

  &:hover {
    background-color: #333; /* 호버 효과 추가 */
  }
`;

export default UsersInquiry;
