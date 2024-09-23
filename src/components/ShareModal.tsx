import { useState, useEffect } from "react";
import Modal from 'react-modal';
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { shareCountApi } from "../pages/api/BoardApi";

//navigate(`/boards/read?id=${id}&title=${title}&content=${content}`);
export interface ShaerModalProps{
    isModal: boolean;
    setIsModal: (prev: boolean) => void;
    content: string;
    title: string;
    id: string;
}

Modal.setAppElement('#root');

export const ShareModal : React.FC<ShaerModalProps> = ({isModal, setIsModal,content,title,id, ...props}) => {

    const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;
    const baseUrl = process.env.REACT_APP_API_BASE_URL
    const [domain, setDomain] = useState<string>('');
    const location = useLocation();
    const url : string = './'
    const shareText : string = 'naver.com'
    const dispatch = useDispatch<AppDispatch>();
   
    useEffect(() => {
        if(baseUrl === 'http://127.0.0.1:9898'){
          setDomain('http://localhost:3000/')
        }
        else{
          setDomain('jaychis.com')
        }

        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(kakaoApiKey);
          }
        }, [kakaoApiKey]);
        
    const handleShaerTwitter = () => {
      const twitterShareUrl: string = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent('https://naver.com')}`;
      shareCountApi(id)
      window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
    };

    const handleShareInstagram = () => {
      const instagramShareUrl : string = `https://www.instagram.com/direct/inbox/?url=${encodeURIComponent(domain)}&text=${encodeURIComponent(content)}`;
      navigator.clipboard.writeText(url);
      shareCountApi(id)
      window.open(instagramShareUrl, '_blank', 'noopener,noreferrer');
    }

    const handelShareFaceBook = () => {
      const facebookShareUrl : string = `https:///www.facebook.com/sharer/sharer.php?u=naver.com`
      shareCountApi(id)
      window.open(facebookShareUrl, '_blank', 'noopener,noreferrer')
    }

    const handleCopyClipBoard = (url : any) => {
      navigator.clipboard.writeText(url);
      shareCountApi(id)
      alert("링크가 복사되었습니다.");
    }

    const handleShareKakao = () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `${title}`,
            description: `${content}`,
            imageUrl: 'https://i.postimg.cc/jd4cY735/3.png',
            link: {
              mobileWebUrl: 'https://naver.com',
              webUrl: 'https://naver.com',
            },
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: 'https://naver.com',
                webUrl: 'https://naver.com',
              },
            },
          ],
        });
        shareCountApi(id)
      } else {
        console.error('Kakao SDK가 초기화되지 않았습니다.');
      }
  }

    return(
        <>
              <Modal
              isOpen={isModal}
              onRequestClose={() => setIsModal(false)}
              overlayClassName="_"
              contentElement={(props, children) => <ModalContent {...props}>{children}</ModalContent>}
              overlayElement={(props, contentElement) => <ModalOverlay {...props}>{contentElement}</ModalOverlay>}
              >
                <ModalStyle>
                    <ShareIcon onClick = {() => {handleCopyClipBoard(domain)}} src="https://img.icons8.com/glyph-neue/64/link.png"/>
                    <ShareIcon onClick = {() => {handleShareKakao()}} src = 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png'/>
                    <ShareIcon onClick = {() => {handleShaerTwitter()}} src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" />
                    <ShareIcon onClick = {() => {handleShareInstagram()}} src = "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" />
                    <ShareIcon onClick = {() => {handelShareFaceBook()}} src="https://img.icons8.com/fluency/48/facebook-new.png" style = {{borderRadius : '0'}}/>
                </ModalStyle>
            </Modal>
        </>
    )
}

const ModalStyle =  styled.div`
    width : 100%;
    height : 100%;
    display : flex;
    align-items : center;
`

const ShareIcon = styled.img`
  width : 65px !important;
  height : 65px !important;
  object-fit: contain !important;
  margin-left : 9% !important;
  border-radius : 45% !important;
`

const ModalContent = styled.div`
  width: 40%;
  height: 35%;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.30);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;