import styled from 'styled-components';
import React, { useState, useRef } from 'react';
import { shareCountApi } from '../pages/api/boardApi';
import KakaoIcon from '../assets/img/kakao.webp';
import FaceBookIcon from '../assets/img/facebook.webp';
import TwitterIcon from '../assets/img/twitter.webp';
import CopyIcon from '../assets/img/copy.webp'
import InstagramIcon from '../assets/img/Instagram.webp'
import { breakpoints } from '../_common/breakpoint';

interface ShareProps {
  readonly shareCount: number;
  readonly id: string;
  readonly title: string;
  readonly content: string[];
}

const ShareComponent = ({ shareCount, id, title, content }: ShareProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCardShareHovered, setIsCardShareHovered] = useState<boolean>(false);
  const [active, setIsActive] = useState<boolean>(false);
  const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;

  const ShareList = [
    {platform: '카카오톡', icon: KakaoIcon},
    {platform: '인스타그램', icon: InstagramIcon},
    {platform: '페이스븍', icon: FaceBookIcon},
    {platform: '트위터', icon: TwitterIcon},
    {platform: '링크복사', icon: CopyIcon},]

  React.useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoApiKey);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [kakaoApiKey]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsActive(false);
    }
  };

  const handleShare = (platform: string) => {
    let domain = '';

    if (process.env.REACT_APP_NODE_ENV === 'development')
      domain = 'localhost:3000';
    else if (process.env.REACT_APP_NODE_ENV === 'stage')
      domain = 'stage.jaychis.com';
    else domain = 'jaychis.com';

    domain = domain + `/boards/read?id=${id}&title=${title}&content=${content}`;
    shareCountApi(id);
    setIsActive(false);
    switch (platform) {
      case '트위터':
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${title}%0A${domain}`;
        window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
        break;

      case '인스타그램':
        navigator.clipboard.writeText(domain);
        window.open(
          `https://www.instagram.com/direct/`,
          '_blank',
          'noopener,noreferrer',
        );
        break;

      case '페이스북':
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(domain)}`;
        window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
        break;

      case '링크복사':
        navigator.clipboard.writeText(domain);
        alert('링크가 복사되었습니다.');
        break;

      case '카카오톡':
        if (window.Kakao && window.Kakao.isInitialized()) {
          shareCountApi(id);
          setIsActive(false);
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: `${title}`,
              imageUrl: 'https://i.ibb.co/pwfv8nX/panda-logo.png',
              link: {
                mobileWebUrl: `https://${domain}`,
                webUrl: `https://${domain}`,
              },
            },
            buttons: [
              {
                title: '웹으로 보기',
                link: {
                  mobileWebUrl: `https://${domain}`,
                  webUrl: `https://${domain}`,
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

  return (
    <>
      <ShareWrapper ref={dropdownRef}>
        <DropdownContainer>
          <ShareButton
            isHovered={isCardShareHovered}
            onMouseEnter={() => setIsCardShareHovered(true)}
            onMouseLeave={() => setIsCardShareHovered(false)}
            onClick={() => {setIsActive((prev) => !prev);}}
          >
            <ShareImageTag
              src="https://img.icons8.com/ios/50/forward-arrow.png"
              alt="Share Icon"
            />
          </ShareButton>
          {active && (
            <DropdownMenu>
              {ShareList.map((item, index) => {
                return(
                  <DropdownItem onClick={() => { handleShare(item.platform);}}>
                    <ShareIcon src={item.icon} />
                    {item.platform}
                  </DropdownItem>
                )
              })}
            </DropdownMenu>
          )}
        </DropdownContainer>
      </ShareWrapper>
    </>
  );
};

export default ShareComponent;

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
  z-index: 1001;
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
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ShareIcon = styled.img`
  width: 40px !important;
  height: 30px !important;
  object-fit: contain !important;
  border-radius: 45% !important;

  @media (max-width: ${breakpoints.mobile}) {
    width: 30px !important;
    height: 18px !important;
    object-fit: contain !important;
    border-radius: 45% !important;
  }
`;

const ShareButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHovered',
})<{
  readonly isHovered: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  border: 1px solid gray;
  height: 40px;
  width: 100%;
  border-radius: 30px;
  cursor: pointer;
  margin-left: 1vw;
  
  object-fit: cover;
  @media (max-width: ${breakpoints.mobile}) {
    font-size: 10px;
    height: 40px;
  }
`;

const ShareImageTag = styled.img`
  height: 40px;
  width: 40px;
`;