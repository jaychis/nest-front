import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AddSearchAPI, GetTopTenSearchesAPI } from '../api/searchApi';
import { useNavigate } from 'react-router-dom';

const SearchMobile = () => {
  const [isTopTenList, setIsTopTenList] = useState([]);
  const [error, setError] = useState<string | null>(null);
  let navigate = useNavigate();

  const debouncedFetchTopTenList = async () => {
    try {
      const res = await GetTopTenSearchesAPI();
      if (!res) return;
      const response = res.data.response;
      setIsTopTenList(response);
      console.log(response);
    } catch (e: any) {
      if (e.response && e.response.status === 429) {
        setError('Too many requests. Please try again later.');
      } else if (e.response && e.response.status === 404) {
        setError('Endpoint not found. Please check the URL.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error(e);
    }
  };

  const handleSearchClick = async (query: string) => {
    await AddSearchAPI({ query });
    navigate(`/search/list?query=${query}`);
  };

  useEffect(() => {
    debouncedFetchTopTenList();
  }, []);

  return (
    <MobileSearchContainer>
      <SearchHeader>
        <HeaderTitle>실시간 검색어 TOP 10</HeaderTitle>
        <hr />
      </SearchHeader>

      <SearchBody>
        {isTopTenList.map((list: { readonly query: string }, index) => {
          return (
            <>
              <BodyItem>
                <span onClick={() => handleSearchClick(list.query)}>
                  {`${index + 1}.`} {list.query}
                </span>
              </BodyItem>
            </>
          );
        })}
      </SearchBody>
    </MobileSearchContainer>
  );
};

const MobileSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchHeader = styled.div`
  margin: 5vh 0 0 5vw;
  width: 95%;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
`;

const SearchBody = styled.div`
  display: flex;
  margin: 5vh 0 0 5vw;
  font-size: 1.5rem;
  flex-direction: column;
`;

const BodyItem = styled.div`
  display: flex;
  margin-top: 3vh;
`;

export default SearchMobile;
