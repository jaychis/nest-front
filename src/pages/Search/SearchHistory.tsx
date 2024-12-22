import { useState,useEffect } from "react";
import styled from "styled-components";

const SearchHistory = () => {

    const [searchHistoryList, setSearchHistoryList] = useState<string[]>(['']);

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
            {searchHistoryList.sort().slice(0,4).map((list, index) => {return(
                <Item key={index}>
                    <Text>{list}</Text>
                </Item>
            )})}
        </HistoryContainer>
    )
}


const HistoryContainer = styled.div`
    display: flex;
    width: 90%;
    margin-top: 3vh;
    margin-left: 5vw;
`

const Item = styled.div`
    font-size: 1.2rem;
    display: flex; /* Flex 사용 */
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    margin-right: 5vw;
    border: 1px solid #84d7fb;
    border-radius: 25px;
    height: 7vh;
    max-width: 25vw;
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