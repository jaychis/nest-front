import { useState, useEffect } from "react";
import { GetSearchBoardsAPI } from "../api/searchApi";
import styled from "styled-components";
import 돋보기 from '../../assets/img/icons8-돋보기-50.png'
import { sortTypes } from "./SearchList";

interface AutoProps {
    readonly query: string
}

const AutoComplete = ({query}:AutoProps) => {

    const sortType:sortTypes = 'RECENT'
    const [searchList, setSearchList] = useState<string[]>([]);

    useEffect(() => {
        const searchBoard = async () => {
            const res = await GetSearchBoardsAPI({query, sortType})
            if(res && res.data && res.data.response){
                setSearchList(res.data.response.map((board: any) => board.title))
            }
            console.log(searchList)
        }
        searchBoard()
    },[query])


    return(
        <AutoCompleteContainer>
            <SearchTermWrapper>
                <Icon src = {돋보기}/> 
                <Text>
                    {query}
                </Text>
            </SearchTermWrapper>
            
            {searchList.map((list, index) => (
            <AutoCompleteList key={index}>
                <Text>{list}</Text>
                <Hr/>
            </AutoCompleteList>
        ))}
        </AutoCompleteContainer>
    )
}

export default AutoComplete

const AutoCompleteContainer = styled.div`
    display: flex;
    margin: 2vh 0 0 2vw;
    flex-direction: column;
`

const Text = styled.p`
    font-size: 1.1rem;
`

const SearchTermWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: -2vh;
`

const Icon = styled.img`
    display: flex;
    width: 30px;
    height: 30px;
    margin-right: 2vw;
`

const AutoCompleteList = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 11vw;
`;

const Hr = styled.hr`
    width: 80%; 
    border: none; 
    border-top: 1px solid #ccc; 
    margin: -1vh 0 0 0; 
`;