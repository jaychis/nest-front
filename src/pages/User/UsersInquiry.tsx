import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card from "../../components/Card";
import { useSearchParams } from "react-router-dom";
import { UsersInquiryAPI } from "../api/UserApi";
import { CardType } from "../../_common/CollectionTypes";
import EmptyState from "../../components/EmptyState";
import { getContactAllListAPi } from "../api/InquiryApi";


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

  const TAKE: number = 5;

  useEffect(() => {
    
    getContactAllListAPi({take :TAKE})
  },[])

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
  const [list, setList] = useState<CardType[]>([]);

  useEffect(() => {
    UsersInquiryAPI({
      nickname: params.get("nickname") as string,
      take: 10,
    })
      .then((res) => {
        const status = res.status;

        if (status === 200) {
          const response = res.data.response?.current_list;

          setList(response);
        }
      })
      .catch((err) => console.error("UsersInquiryAPI err : ", err));
  }, [params]);

  return (
    <>
        <MainContainer>
          <CardsContainer>
            {list.length > 0 ? (
              list.map((el) => {
                return (
                  <>
                    <Card
                      id={el.id}
                      category={el.category}
                      title={el.title}
                      nickname={el.nickname}
                      createdAt={el.created_at}
                      content={el.content}
                      type={el.type}
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
