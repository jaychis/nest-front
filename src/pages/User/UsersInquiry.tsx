import React, { useEffect, useState } from "react";
import GlobalBar from "../Global/GlobalBar";
import GlobalSideBar from "../Global/GlobalSideBar";
import Card from "../../components/Card";
import { useSearchParams } from "react-router-dom";
import { UsersInquiryAPI } from "../api/UserApi";
import { CardType, ReactionStateTypes } from "../../_common/CollectionTypes";

interface ContainerProps {
  children?: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // This centers the cards horizontally
        justifyContent: "flex-start", // This aligns the cards to the top
        paddingTop: "20px", // Add space at the top
        height: "100vh", // Use the full height of the viewport
        width: "100vw", // Use the full width of the viewport
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
        alignItems: "center", // This centers the cards horizontally
        width: "100%", // Full width of its parent
        maxWidth: "600px", // Maximum width of the cards container
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
        const status = res.data.status;

        if (status === 200) {
          const response = res.data.response?.current_list;

          setList(response);
        }
      })
      .catch((err) => console.error(err));
  }, [params]);

  return (
    <>
      <GlobalBar />
      <div style={{ display: "flex" }}>
        <GlobalSideBar />
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
              <div>'텅'</div>
            )}
          </CardsContainer>
        </MainContainer>
      </div>
    </>
  );
};
export default UsersInquiry;
