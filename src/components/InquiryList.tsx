import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import React from "react";
import debounce from "lodash.debounce";


interface InquiryProps{
    readonly content: string;
    readonly created_at: Date;
    readonly deleted_at?: Date;
    readonly id: string;
    readonly nickname?: string;
    readonly title: string;
    readonly update_at: Date;
  }

const InquiryList = ({
    content,
    created_at,
    id,
    nickname,
    title,
    update_at
}:InquiryProps) => {

    let navigate = useNavigate()
    const parentRef = React.useRef<HTMLDivElement>(null)
    const childRef = React.useRef<HTMLDivElement>(null)
    const [isCollapse, setIsCollapse] = React.useState(false);
    const [textContent, setTextContent] = useState('');

    useEffect(() => {
        const pTagSlice = () => {
            if (content.startsWith('<p>') && content.endsWith('</p>')) {
                setTextContent(content.slice(3, -4));
            }
    };pTagSlice()
    },[])
    

    const handleButtonClick = React.useCallback((event:any) => {
        event.stopPropagation();
        if (parentRef.current === null || childRef.current === null) {
          return;
        }
        if (parentRef.current.clientHeight > 0) {
          parentRef.current.style.height = "0";
          parentRef.current.style.margin = '0';
        } else {
          parentRef.current.style.height = `${childRef.current.clientHeight}px`;
          parentRef.current.style.margin = '20px';
        }
        setIsCollapse(!isCollapse);
      }, [isCollapse]);

    return(
    <>
        <InquiryListContainer onClick = {handleButtonClick}>
            <TitleButton>
                <TitleWrapper> [Q&A] {title.slice(0,25)} </TitleWrapper>
            </TitleButton>
            <ArrowImage src="https://img.icons8.com/ios/50/expand-arrow--v1.png" />
        </InquiryListContainer>
        <ContetntWrapper ref = {parentRef}>
                <Content ref = {childRef}>{textContent}</Content>
        </ContetntWrapper>
        <hr style = {{border : '1px solid #f0f0f0', width : '100%', marginTop : '16px'}}/>
    </>
    )
}

export default InquiryList;

const InquiryListContainer = styled.div `
    display: flex;
    width: 100%;
    max-width: 1000px;
    min-height: 50px;
    margin-top : 10px;
    margin-bottom : 10px
    border-radius: 10px;
    cursor: pointer;
    background: white;
    justify-content: space-between;
`

const TitleWrapper = styled.div`
    display : flex;
    font-size : 26px;
    font-weight : 500;
    color : rgb(80, 80, 80);
`

const TitleButton = styled.button`
    border : none;
    background : white;
    cursor : pointer;
`

const ArrowImage = styled.img`
    display : flex;
    height : 30px;
    margin-top : auto;
    margin-bottom : auto;
`

const ContetntWrapper = styled.div`
    height : 0;
    width : 100%;
    overflow : hidden;
    transition: height 0.35s ease, margin 0.35s ease;
    margin-top : 0;
    
`

const Content = styled.div`
    margin-left : 15px;
    font-weight : 100;
`
