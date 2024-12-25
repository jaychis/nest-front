import { useState, useEffect,useCallback } from "react";
import { GetSearchCommunitiesAPI } from "../api/searchApi";
import styled from "styled-components";
import 돋보기 from '../../assets/img/icons8-돋보기-50.png'
import { sortTypes } from "./SearchList";
import debounce from "lodash.debounce";
import logo from '../../assets/img/panda_logo.png'

interface AutoProps {
    readonly query: string
}

interface Community {
    name: string;
    icon: string;
  }

const AutoComplete = ({query}:AutoProps) => {

    const sortType:sortTypes = 'RECENT'
    const [searchList, setSearchList] = useState<Community[]>([]);

    const searchBoard = useCallback(
        debounce(async (query: string) => {
          const res = await GetSearchCommunitiesAPI({ query });
          if (res?.data?.response) {
            setSearchList(
              res.data.response.map((community: any) => ({
                name: community.name,
                icon: community.icon,
              }))
            );
          }
          console.log(searchList);
          console.log('test')
        }, 300), 
        []
      );
      
      useEffect(() => {
        if (query) {
          searchBoard(query);
        }
        return () => {
          searchBoard.cancel();
        };
      }, [query, searchBoard]);

    return(
        <AutoCompleteContainer>
            <SearchTermWrapper>
                <Icon src = {돋보기}/> 
                <Text>
                    {query}
                </Text>
            </SearchTermWrapper>
            
            {searchList.slice(0,5).map((list, index) => (
            <AutoCompleteList key={index}>
                {!list.icon ? <Icon src = {logo}/> : <Icon src = {list.icon}/>}
                <Text>{list.name}</Text>
                
            </AutoCompleteList>
        ))}
        </AutoCompleteContainer>
    )
}

export default AutoComplete

const AutoCompleteContainer = styled.div`
    display: flex;
    margin: 0 0 0 2vw;
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
    border-radius: 25px;
`

const AutoCompleteList = styled.div`
    display: flex;
    align-items: center;
`;
