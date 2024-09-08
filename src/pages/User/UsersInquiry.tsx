import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card from "../../components/Card";
import { useSearchParams } from "react-router-dom";
import { UsersInquiryAPI } from "../api/UserApi";
import EmptyState from "../../components/EmptyState";
import { getContactAllListAPi } from "../api/InquiryApi";
import { InquiryType } from "../../_common/CollectionTypes";
import InquiryList from "../../components/InquiryList";


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

const UsersInquiry = () => {
  const [params, setParams] = useSearchParams();
  const [list, setList] = useState<InquiryType[]>([]);
  const TAKE: number = 5;
  
  useEffect(() => {
    getContactAllListAPi({take :TAKE, page : 1})
    .then((res) => {
      const status = res?.data.response.current_list
      setList(status)
    })
  },[])

  return (
    <>
        <MainContainer>
          <CardsContainer>
            {list.length > 0 ? (
              list.map((el) => {
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
export default UsersInquiry;
