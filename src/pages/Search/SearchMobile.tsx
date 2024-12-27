import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AddSearchAPI, GetTopTenSearchesAPI } from '../api/searchApi';
import { useNavigate } from 'react-router-dom';
import SearchHistory from './SearchHistory';
import AutoComplete from './AutoComplete';
import arrow from '../../assets/img/icons8-뒤로-32.png'

const SearchMobile = () => {
  const [isTopTenList, setIsTopTenList] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
    };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        clickSearch();
      }
  };

  const clickSearch = async () => {
      const searchHistory = localStorage.getItem('searchHistory',)

      if (!searchTerm) {
        // 나중에는 alert 제거하기
        alert('내용을 입력해주세요');
        return;
      }
      
      if(!searchHistory){
        return
      } 
      const parsedHistory = JSON.parse(searchHistory);
      parsedHistory.push(searchTerm)
      localStorage.setItem('searchHistory',JSON.stringify(parsedHistory));
      await AddSearchAPI({ query: searchTerm });
      navigate(`/search/list?query=${searchTerm}`);
  };

  const debouncedFetchTopTenList = async () => {
    try {
      const res = await GetTopTenSearchesAPI();
      if (!res) return;
      const response = res.data.response;
      setIsTopTenList(response);
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
        <Icon src = {arrow} onClick={() => {navigate(-1)}}/>
        <SearchInput
          type="search"
          placeholder="Search"
          value={searchTerm}
          name={'search'}
          onChange={(e) => handleSearchChange(e)}
          onKeyDown={handleKeyDown}
        />
      </SearchHeader>

      <SearchBody>
      {searchTerm ? <AutoComplete query = {searchTerm}/> : <SearchHistory/>}
        <Title>실시간 검색어 TOP 10</Title>
        {isTopTenList.map((list: { readonly query: string }, index) => {
          return (
            <>
              <Item>
                <span onClick={() => handleSearchClick(list.query)}>
                  <Number>{`${index + 1}. `}</Number>
                  {list.query}
                </span>
              </Item>
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
  display: flex;
  flex-direction: row;
  margin: 5vh 0 0 5vw;
  width: 95%;
  align-items:center;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const SearchBody = styled.div`
  display: flex;
  margin: 5vh 0 0 5vw;
  font-size: 1.5rem;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  margin-top: 3vh;
`;

const Number = styled.span`
  display: inline-block;
  width: 30px;
`

const SearchInput = styled.input`
  display: flex;
  width: 90%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
`;

const Icon = styled.img`
  display: flex;
  width: 30px;
  height: 30px;
  margin-right: 2vw;
`

export default SearchMobile;
