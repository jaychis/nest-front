import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import { getContactAllListAPi } from "../api/InquiryApi";
import { InquiryType } from "../../_common/CollectionTypes";
import InquiryList from "../../components/InquiryList";
import SubmitInquiry from "./SubmitInquiry";

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
        maxWidth: "800px", // 적절한 최대 너비 설정
        boxSizing: "border-box",
        padding: "0 20px", // 좌우 패딩 추가
      }}
    >
      {children}
    </div>
  );
};

const submitButtonStyle = {
  backgroundColor: "black",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  marginLeft: "auto",
  marginBottom: "15px",
};

const UsersInquiry = () => {
  const [params, setParams] = useSearchParams();
  const [list, setList] = useState<InquiryType[]>([]);
  const TAKE: number = 10;
  const nickname: string = localStorage.getItem("nickname") as string;
  const [isopen, setIsopen] = useState<boolean>(false);
  const userId:string = localStorage.getItem('id') as string;
  const [retry, setRetry] = useState<number>(0);

  const getAllList = () => {
    getContactAllListAPi({take :TAKE, page : 1, nickname : nickname})
    .then((res) => {
      const status = res?.data.response.current_list
      setList(status)
    })
    .catch((error) => {
      console.error(error)
      setRetry((prev) => prev + 1)
      console.log(`재시도 ${retry}`)
    })
  }

  useEffect(() => {
    if(retry < 10){
      getAllList();
    }
  },[retry])

  if(!list){
    return(
      <><EmptyState/></>
    )
  }

  return (
    <>
      <SubmitInquiry isopen={isopen} setIsopen={setIsopen} />
      <MainContainer>
        <CardsContainer>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <button
            style={submitButtonStyle}
            onClick={() => {
              setIsopen(true);
            }}
          >
            글 작성
          </button>
          {list.length > 0 ? (
            list.map((el) => {
              return (
                <>
                  <InquiryList
                    content={el.content}
                    created_at={el.created_at}
                    id={el.id}
                    nickname={el.nickname}
                    title={el.title}
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
export default UsersInquiry;
