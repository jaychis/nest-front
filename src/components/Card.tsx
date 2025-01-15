import  { useEffect, useState, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactionApi,
  ReactionCountAPI,
  ReactionListAPI,
  ReactionParams,
} from '../pages/api/reactionApi';
import {
  BoardProps,
  ReactionStateTypes,
  ReactionType,
} from '../_common/collectionTypes';
import sanitizeHtml from 'sanitize-html';
import debounce from 'lodash.debounce';
import { UserModalState } from '../reducers/modalStateSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import styled from 'styled-components';
import ShareComponent from './ShareComponent';
import { breakpoints } from '../_common/breakpoint';
import { handleReaction } from '../_common/handleUserReaction';


const Carousel = lazy(() => import('./Carousel'))
const YoutubeCard = lazy(() => import('./YoutubeCard'))

const Card = ({
  id,
  category,
  content,
  createdAt,
  nickname,
  title,
  type,
  shareCount,
  userId,
  profileImage,
}: BoardProps) => {
  const navigate = useNavigate();
  const [isCardCount, setIsCardCount] = useState<number>(0);
  const [localCount, setLocalCount] = useState<number>(0);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);
  const [isCardUpHovered, setIsCardUpHovered] = useState<boolean>(false);
  const [isCardDownHovered, setIsCardDownHovered] = useState<boolean>(false);
  const [isCardCommentHovered, setIsCardCommentHovered] =
    useState<boolean>(false);
  const [isReaction, setIsReaction] = useState<ReactionStateTypes>(null);
  const [shareContent, setShareContent] = useState<string>('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const modalState: UserModalState = useSelector(
    (state: RootState) => state.modalState,
  );
  const mediaExtensions = {
    image: [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'webp',
      'svg',
      'bmp',
      'ico',
      'tiff',
      'tif',
      'heif',
      'heic',
      'avif',
    ],
    video: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'],
  };
  const [color, setColor] = useState<string>('');
  const logo = `https://i.ibb.co/KwD7dLS/panda-logo.png`
  const isMediaType = (url: string, type: 'image' | 'video'): boolean => {
    const ext = url.split('.').pop()?.toLowerCase();
    return ext ? mediaExtensions[type].includes(ext) : false;
  };

  const USER_ID: string = localStorage.getItem('id') as string;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 760);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const safeHtml = (content: string) => {
    return sanitizeHtml(content, {
      allowedTags: [
        'img',
        'a',
        'br',
        'p',
        'div',
        'span',
        'pre',
        'code',
        'bold',
        'em',
        'u',
        's',
        'blockquote',
        'ol',
        'li',
        'ul',
      ],
      allowedAttributes: {
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'style'],
        a: ['href','rel', 'target'],
        span: ['style','contenteditable'],
        p:['style'],
        div: ['class', 'spellcheck'],
        pre: ['class'],
        code: ['class'],
        li: ['data-list', 'style', 'class'],
      },
      allowedClasses: {
        div: ['ql-code-block', 'ql-code-block-container'],
        code: ['language-*'],
        li: ['ql-indent-*'],
      },
      transformTags: {
        img: (tagName, attribs) => {
          return {
            tagName: 'img',
            attribs: {
              ...attribs,
              style:
                'width: 40%; height: auto; display: block; margin: 0 auto;',
            },
          };
        },
      },
    });
  };

  const reactionButton = async (userReaction: ReactionStateTypes) => {
    if (userReaction !== null) {
      const params: ReactionParams = {
        boardId: id,
        userId: USER_ID,
        type: userReaction,
        reactionTarget: 'BOARD',
      };
      try {
        const res = await ReactionApi(params);
        if (!res) return;

        const status: number = res.status;
        if (status === 201) {
          await handleReaction({
            localCount,
            userReaction,
            isReaction,
            setIsReaction,
            isCardCount,
            setIsCardCount,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const goBoardRead = () => {
    navigate(`/boards/read?id=${id}`);
  };

  const fetchReactionList = async (boardId: string) => {
    try {
      const res = await ReactionListAPI({ boardId });
      const response = res.data.response;

      response.forEach((el: ReactionType) => {
        if (USER_ID === el.user_id) {
          setIsReaction(el.type);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReactionCount = async (boardId: string) => {
    try {
      const res = await ReactionCountAPI({ boardId });
      const resCount = res.data.response;
      if (resCount.board_score > 0) {
        setIsCardCount(resCount.board_score);
        setLocalCount(resCount.board_score);
      } else {
        setIsCardCount(0);
        setLocalCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedFetchReactionList = debounce(fetchReactionList, 300);
  const debouncedFetchReactionCount = debounce(fetchReactionCount, 300);

  useEffect(() => {
    const startFunc = async () => {
      await Promise.all([
        debouncedFetchReactionList(id),
        debouncedFetchReactionCount(id),
      ]);
    };
    startFunc();
    extractTextFromHTML(content[0]);
  }, []);

  useEffect(() => {
    if (content.some((item) => item.includes('span'))) {
      const contentString = content.join('');
      const colorMatch = contentString.match(/color:\s*rgb\([^\)]+\)/);

      if (colorMatch) {
        const extractedColor = colorMatch[0].replace('color: ', '').trim();
        setColor(extractedColor);
      }
    }
    if (localCount < 0) {
      setLocalCount(0);
    }
  }, [localCount, content]);

  const extractTextFromHTML = (htmlString: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.innerText || tempDiv.textContent || '';
  };

  return (
    <>
      <CardContainer
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        isHovered={isCardHovered}
        modalState={modalState.modalState}
      >
        <LogoContainer>
          <LogoImg src={logo} alt='프로필 이미지' />
          <NicknameWrapper
            onClick={() => navigate(`/users/inquiry?nickname=${nickname}`)}
          >
            {nickname}
          </NicknameWrapper>
        </LogoContainer>

        {/* Card Content */}
        <ContentContainer>
          <BoardTitle onClick={goBoardRead}>{title}</BoardTitle>

          {type === 'TEXT' ? (
            <TextContainer fontcolor={color}>
              {content?.map((co, index) => {
                return (
                  <ContentWrapper
                    key={`${id}-${index}`}
                    dangerouslySetInnerHTML={{ __html: safeHtml(co) }}
                  />
                );
              })}
            </TextContainer>
          ) : type === 'MEDIA' ? (
            <MediaContainer>
              {isMediaType(content[0], 'image') && content.length === 1 && (
                <Image src={content[0]} />
              )}
              {isMediaType(content[0], 'image') && content.length > 1 && (
                <Carousel imageList={content} />
              )}
              {!isMediaType(content[0], 'image') && (
                <Video controls preload="metadata">
                  {' '}
                  <source src={content[0]} />
                </Video>
              )}
            </MediaContainer>
          ) : (
            <>
              {<YoutubeCard
              content={content}
              />}
            </>
          )}
        </ContentContainer>

        <ButtonContainer modalState={modalState.modalState}>
          <ReactionWrapper>
            <LikeButton
              isLiked={isReaction === 'LIKE'}
              isHovered={isCardUpHovered}
              onMouseEnter={() => setIsCardUpHovered(true)}
              onMouseLeave={() => setIsCardUpHovered(false)}
              onClick={() => reactionButton('LIKE')}
            >
              좋아요
            </LikeButton>
            <ReactionCount>{isCardCount}</ReactionCount>
            <DisLikeButton
              isDisliked={isReaction === 'DISLIKE'}
              isHovered={isCardDownHovered}
              onMouseEnter={() => setIsCardDownHovered(true)}
              onMouseLeave={() => setIsCardDownHovered(false)}
              onClick={() => reactionButton('DISLIKE')}
            >
              싫어요
            </DisLikeButton>
          </ReactionWrapper>
          <CommentWrapper>
            <CommentButton
              isHovered={isCardCommentHovered}
              onMouseEnter={() => setIsCardCommentHovered(true)}
              onMouseLeave={() => setIsCardCommentHovered(false)}
              onClick={goBoardRead}
            >
              댓글
            </CommentButton>
          </CommentWrapper>

          <ShareWrapper>
            <ShareComponent
              shareCount={shareCount}
              title={title}
              content={content}
              id={id}
            />
          </ShareWrapper>
        </ButtonContainer>
      </CardContainer>

      <HrTag />
    </>
  );
};

const CardContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isHovered', 'modalState'].includes(prop),
})<{
  readonly isHovered: boolean;
  readonly modalState: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  max-height: 1000vh;
  cursor: pointer;
  padding: 0 15px;
  background-color: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  position: relative;
  object-fit: contain;
  box-sizing: border-box;
  border-radius: 30px;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 0;
  }
`;

const MediaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #606060;
  text-align: center;
  border: 2px solid darkgray;
  border-radius: 20px;
  margin: 10px auto;
  height: 400px;
`;

const Image = styled.img`
  width: 400px;
  height: 400px;
  border-radius: 20px;
  display: block;
  object-fit: contain;
`;

const Video = styled.video`
  max-width: 700px;
  max-height: 400px;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: block;
  object-fit: contain;
`;

const LogoContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px;
`;

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 30px;
`;

const NicknameWrapper = styled.div`
  font-size: 15px;
`;

const ContentContainer = styled.div`
  width: 100%;
  overflow: visible;
`;

const BoardTitle = styled.h3`
  font-weight: bold;
  text-align: left;
  white-space: normal;
  font-size: 1.5rem;
`;

const TextContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'fontcolor',
})<{ fontcolor: string }>`
  text-align: left;
  white-space: normal;
  word-break: break-word;
  width: 100%;

  span {
    color: ${(props) => props.fontcolor};
  }
`;

const ContentWrapper = styled.div`
  max-width: 100% !important;
  max-height: 100% !important;

  img {
    max-width: 70% !important;
    max-height: 450px !important;
    height: auto !important;
    display: block !important;
  }
`;

const ButtonContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'modalState',
})<{
  readonly modalState: boolean;
}>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
  height: 100%;
  margin-top: 5px;
  max-height: 80px;
`;

const ReactionWrapper = styled.div`
  margin-right: 5px;
  border-radius: 30px;
  width: 150px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}) {
    width: 170px;
  }
`;

const LikeButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isLiked', 'isHovered'].includes(prop),
})<{
  readonly isLiked: boolean;
  readonly isHovered: boolean;
}>`
  border: ${(props) => (props.isLiked ? '2px solid blue' : '1px solid gray')};
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  width: 100%;
  height: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 70px;
    height: 40px;
    font-size: 10px;
  }
`;

const ReactionCount = styled.span`
  margin: 10px;
  width: 10px;
  height: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 3px;
    text-align: center;
  }
`;

const DisLikeButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isDisliked', 'isHovered'].includes(prop),
})<{
  readonly isDisliked: boolean;
  readonly isHovered: boolean;
}>`
  border: ${(props) => (props.isDisliked ? '1px solid red' : '1px solid gray')};
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  width: 100%;
  height: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 70px;
    height: 40px;
    font-size: 10px;
  }
`;

const CommentWrapper = styled.div`
  width: 75px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.mobile}) {
    margin-right: 7px;
  }
`;

const CommentButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isHovered',
})<{
  readonly isHovered: boolean;
}>`
  border: 1px solid gray;
  background: ${(props) => (props.isHovered ? '#f0f0f0' : 'white')};
  height: 100%;
  width: 100%;
  border-radius: 30px;
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    width: 70px;
    height: 40px;
    font-size: 10px;
  }
`;

const ShareWrapper = styled.div`
  width: 45px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;

  @media (max-width: ${breakpoints.mobile}) {
    width: 60px;
  }
`;

const HrTag = styled.hr`
  border: none;
  height: 2px;
  background-color: #f0f0f0;
  margin: 5px 0;
  width: 100%;
`;

export default Card;
