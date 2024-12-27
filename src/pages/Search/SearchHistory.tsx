import { useState,useEffect } from "react";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";

const SearchHistory = () => {

    const [searchHistoryList, setSearchHistoryList] = useState<string[]>([]);
    const navigate = useNavigate();
    const getSearchHistory = () => {
        const history = localStorage.getItem('searchHistory'); 
        if (!history) return;
    
        try {
            const parsedHistory = JSON.parse(history); 
    
            if (Array.isArray(parsedHistory)) {
                setSearchHistoryList(parsedHistory);
            } else {
                console.warn('Parsed history is not an array:', parsedHistory);
                setSearchHistoryList([]);
            }
        } catch (error) {
            console.error('Failed to parse search history from localStorage:', error);
            setSearchHistoryList([]);
        }
    };

    useEffect(() => {
        getSearchHistory()
    },[])

    return(
        <HistoryContainer>
            {searchHistoryList ? 
            searchHistoryList.sort().slice(0,3).map((list, index) => {return(
                <Item key={index} onClick={() => {navigate(`/search/list?query=${list}`)}}>
                    <Text>{list}</Text>
                </Item>)}) :
            null}
        </HistoryContainer>
    )
}


const HistoryContainer = styled.div`
    display: flex;
    width: 90%;
`

const Item = styled.div`
    font-size: 1.2rem;
    display: flex;
    justify-content: center; 
    align-items: center; 
    margin-right: 5vw;
    border: 1px solid #84d7fb;
    border-radius: 25px;
    height: 7vh;
    max-width: 28vw;
    overflow: hidden;
    box-sizing: border-box;
`;

const Text = styled.span`
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis;
    max-width: 100%;
    padding: 10px;
`;

export default SearchHistory