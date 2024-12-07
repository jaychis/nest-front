import styled from "styled-components";
import React, { useEffect, useState, useRef } from 'react';
import { shareCountApi } from "../pages/api/boardApi";
import kakao from '../assets/img/kakao.png'
import instagram from '../assets/img/instagram.png'
import twitter from '../assets/img/twitter.png'
import facebook from '../assets/img/facebook.png'
import copy from '../assets/img/copy.png'

interface ShareProps{
  readonly shareCount: number;
  readonly id: string;
  readonly title: string;
  readonly content: string[];
}

const ShareComponent = ({shareCount,id,title,content}:ShareProps) => {

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCardShareHovered, setIsCardShareHovered] = useState<boolean>(false);
  const [active, setIsActive] = useState<boolean>(false);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsActive(false);
    }
  };

  const handleShare = (platform: string) => {
  let domain = ''

  if(process.env.REACT_APP_NODE_ENV === 'development') domain = 'localhost:3000'
  else if(process.env.REACT_APP_NODE_ENV === 'stage') domain = 'stage.jaychis.com'
  else domain = 'jaychis.com'
  
  domain = domain + `/boards/read?id=${id}&title=${title}&content=${content}`

  switch (platform) {
    case '트위터':
      const twitterShareUrl = `https://twitter.com/intent/tweet?text=${title}%0A${encodeURIComponent(domain)}`;
      shareCountApi(id);
      setIsActive(false);
      window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
      break;

    case '인스타그램':
      navigator.clipboard.writeText(domain);
      shareCountApi(id);
      setIsActive(false);
      window.open(`https://www.instagram.com/direct/`, '_blank', 'noopener,noreferrer');
      break;

    case '페이스북':
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(domain)}`;
      shareCountApi(id);
      setIsActive(false);
      window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
      break;

    case '링크복사':
      navigator.clipboard.writeText(domain);
      shareCountApi(id);
      setIsActive(false);
      alert('링크가 복사되었습니다.');
      break;

    case '카카오톡':
      console.log(domain)
      if (window.Kakao && window.Kakao.isInitialized()) {
        shareCountApi(id);
        setIsActive(false);
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `${title}`,
            description: `${content}`,
            imageUrl: 'https://i.ibb.co/pwfv8nX/panda-logo.png',
            link: {
              mobileWebUrl: domain,
              webUrl: domain,
            },
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: domain,
                webUrl: domain,
              },
            },
          ],
        });
      } else {
        console.error('Kakao SDK가 초기화되지 않았습니다.');
      }
      break;

    default:
      console.error('지원하지 않는 플랫폼입니다.');
  }
};

    return(
        <>
          <ShareWrapper ref={dropdownRef}>
          <DropdownContainer>
            <ShareButton
              isHovered={isCardShareHovered}
              onMouseEnter={() => setIsCardShareHovered(true)}
              onMouseLeave={() => setIsCardShareHovered(false)}
              onClick={() => {
                setIsActive((prev) => !prev);
              }}
            >
              <ShareImageTag
                src="https://img.icons8.com/ios/50/forward-arrow.png"
                alt="Share Icon"
              />
              <ShareCountTag>{shareCount}</ShareCountTag>
            </ShareButton>
            {active && (
              <DropdownMenu>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleShare('카카오톡');
                  }}
                >
                  <ShareIcon src={kakao} />
                  카카오톡
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleShare('인스타그램');
                  }}
                >
                  <ShareIcon src={instagram} />
                  인스타그램
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleShare('페이스북');
                  }}
                >
                  <ShareIcon src={facebook} />
                  페이스북
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleShare('트위터');
                  }}
                >
                  <ShareIcon src={twitter} />
                  트위터
                </DropdownItem>
                <DropdownItem
                  href="#"
                  onClick={() => {
                    handleShare('링크복사');
                  }}
                >
                  <ShareIcon src={copy} />
                  링크 복사
                </DropdownItem>
              </DropdownMenu>
            )}
          </DropdownContainer>
        </ShareWrapper>
        </>
    )
}

export default ShareComponent

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 160px;
`;

const DropdownItem = styled.a`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  color: black;
  text-decoration: none;
  font-size: 14px;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const ShareWrapper = styled.div`
  width: 15%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ShareIcon = styled.img`
  width: 30px !important;
  height: 30px !important;
  object-fit: contain !important;
  border-radius: 45% !important;
  margin-right: 10px;
`;

const ShareButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHovered',
})<{
  isHovered: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  border: 1px solid gray;
  height: 50px;
  width: 80px;
  border-radius: 30px;
  margin-left: -7px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 65px;
    height: 40px;
    font-size: 10px;
    margin-left: 5px;
    margin-right: 7px;
  }
`;

const ShareImageTag = styled.img`
  height: 35px;
  width: 25px;
`;

const ShareCountTag = styled.p`
  display: flex;
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 700;
`;