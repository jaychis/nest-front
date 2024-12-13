import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';
import { getContactAllListAPi } from '../api/inquiryApi';
import { InquiryType } from '../../_common/collectionTypes';
import InquiryList from '../../components/InquiryList';
import SubmitInquiry from './SubmitInquiry';
import styled from 'styled-components';

interface ContainerProps {
  children?: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '20px',
        width: '100%',
        boxSizing: 'border-box',
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px', // 적절한 최대 너비 설정
        boxSizing: 'border-box',
        padding: '0 20px', // 좌우 패딩 추가
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
  const nickname: string = localStorage.getItem('nickname') as string;
  const [isopen, setIsopen] = useState<boolean>(false);
  const userId: string = localStorage.getItem('id') as string;
  const [retry, setRetry] = useState<number>(0);
  const [active, setActive] = useState<string>('FAQ');

  const getAllList = () => {
    getContactAllListAPi({ take: TAKE, page: 1, nickname: nickname })
      .then((res) => {
        const status = res?.data.response.current_list;
        setList(status);
        console.log(status);
      })
      .catch((error) => {
        console.error(error);
        setRetry((prev) => prev + 1);
        console.log(`재시도 ${retry}`);
      });
  };

  const handleChangeQuestion = () => {
    setActive('Q&A');
  };

  const handleChangeFAQ = () => {
    setActive('FAQ');
  };

  useEffect(() => {
    if (retry < 10) {
      getAllList();
    }
  }, [retry]);

  if (!list) {
    return (
      <>
        <EmptyState />
      </>
    );
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
          {active === 'FAQ' ? (
            <ButtonContainer>
              <ActiveButton>FAQ</ActiveButton>
              <Button
                onClick={() => {
                  handleChangeQuestion();
                }}
              >
                Q&A
              </Button>
            </ButtonContainer>
          ) : (
            <ButtonContainer>
              <Button
                onClick={() => {
                  handleChangeFAQ();
                }}
              >
                FAQ
              </Button>
              <ActiveButton>Q&A</ActiveButton>
            </ButtonContainer>
          )}

          {active === 'Q&A' && (
            <SubmitButton
            onClick={() => {
            setIsopen(true);
            }}>
              1:1 문의하기
            </SubmitButton>
          )}

          {list.length > 0 ? (
            list.map((el) => {
              return (
                <>
                  {active === 'Q&A' ? (
                    <InquiryList
                      content={el.content}
                      created_at={el.created_at}
                      id={el.id}
                      nickname={el.nickname}
                      title={el.title}
                      update_at={el.update_at}
                      active={'Q&A'}
                    />
                  ) : (
                    <InquiryList
                      content={'FAQ 답변입니다.'}
                      created_at={el.created_at}
                      id={el.id}
                      title={'FAQ 문의 내용'}
                      update_at={el.update_at}
                      active={'FAQ'}
                    />
                  )}
                  {/* FAQ컴포넌트 추후 대체 예정 */}
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  color: #333;
  font-weight: bold;
  transition:
    background-color 0.3s,
    color 0.3s;

  &:hover {
    background-color: #f8f9fa; // 예시: 호버 효과 추가
  }
`;

const ActiveButton = styled(Button)`
  border-bottom: 2px solid #333;
  border-top: none;
  border-right: none;
  border-left: none;
  color: #007bff;
`;

const SubmitButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: auto;
  margin-bottom: 15px;
`;