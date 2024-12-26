import React, { FormEvent, useEffect, useState, useRef } from 'react';
import { BoardSubmitAPI, SubmitParams } from '../api/boardApi';
import { useNavigate } from 'react-router-dom';
import SubmitText from '../../components/SubmitText';
import 'react-markdown-editor-lite/lib/index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BoardType } from '../../_common/collectionTypes';
import {
  AwsImageUploadFunctionality,
  AwsImageUploadFunctionalityReturnType,
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsDelete,
  ImageLocalPreviewUrlsDeleteType,
  ImageLocalPreviewUrlsReturnType,
} from '../../_common/imageUploadFuntionality';
import { GetCommunitiesNameAPI } from '../api/communityApi';
import ErrorModal from '../../_common/ErrorModal';
import DeleteButton from '../../components/Buttons/DeleteButton';
import styled from 'styled-components';
import { TagListAPI } from '../api/tagApi';
import { breakpoints } from '../../_common/breakpoint';

const BoardSubmit = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState<BoardType>('TEXT');
  const editorRef = useRef<any>(null);
  const [editorHeight, setEditorHeight] = useState(200);
  const [errorModalVisible, setErrorModalVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const ID: string = localStorage.getItem('id') as string;
  const NICKNAME: string = localStorage.getItem('nickname') as string;
  const [textTitle, setTextTitle] = useState<string>('');  
  const [topics, setTopics] = useState<string[]>([]);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [image, setImage] = useState<File[]>([]);

  const handleRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  useEffect(() => {
    if (tagSearchTerm) {
      const boardTagsResponse = async () => {
        const res = await TagListAPI();
        if (!res) {
          alert('게시판 태그 리스트 조회를 실패하였습니다.');
          return;
        }

        interface TagListReturnType {
          readonly id: string;
          readonly name: string;
        }
        const response: TagListReturnType[] = res.data.response;

        const tagNameList: string[] = response.map(
          (el: TagListReturnType) => el.name,
        );

        const filteredTopics = tagNameList.filter((topic: string) => {
          const res = topic.toLowerCase().includes(tagSearchTerm.toLowerCase());

          return res;
        });
        setSuggestions(filteredTopics);
      };

      boardTagsResponse();
    } else {
      setSuggestions([]);
    }
  }, [tagSearchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearchTerm(e.target.value);
  };

  const handleAddTopic = (topic: string) => {
    const formattedTopic = topic.startsWith('#') ? topic : `#${topic}`;
    if (topics.length < 3 && !topics.includes(formattedTopic)) {
      setTopics([...topics, formattedTopic]);
      setTagSearchTerm('');
    }
  };

  const handleTextTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setTextTitle(value);
  };

  const [mediaTitle, setMediaTitle] = useState<string>('');
  const handleMediaTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setMediaTitle(value);
  };

  const [linkTitle, setLinkTitle] = useState<string>('');
  const handleLinkTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setLinkTitle(value);
  };

  const [textContent, setTextContent] = useState<string>('');
  const handleEditorChange = (content: string) => {
    setTextContent(content);
  };

  useEffect(() => console.log('textContent : ', textContent), [textContent]);

  const adjustEditorHeight = () => {
    if (editorRef.current) {
      const editorElement = editorRef.current.editor;
      if (editorElement) {
        const scrollHeight = editorElement.scrollHeight;
        const newHeight = Math.min(scrollHeight, 700);
        setEditorHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    adjustEditorHeight();
  }, [textContent]);

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event,
    });
    if (!urls) return;
    setPreviewUrls(urls.previewUrls);
    setFileList(urls.fileList);
  };

  const imageUrlListDelete = async () => {
    const res: ImageLocalPreviewUrlsDeleteType =
      await ImageLocalPreviewUrlsDelete({ urls: previewUrls });
    if (!res) return;
    setPreviewUrls(res);
  };

  const [linkContent, setLinkContent] = useState<string>('');
  const handleLinkContentChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): Promise<void> => {
    const { value } = event.target;
    setLinkContent(value);
  };

  const [selectedCommunity, setSelectedCommunity] = useState<string>('jaychis');
  const [searchTerm, setSearchTerm] = useState<string>('jaychis');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleCommunitySearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value) {
      try {
        const res = await GetCommunitiesNameAPI({ name: value });
        if (res && res.data && res.data.response) {
          console.log('Search results:', res.data.response);
          setSearchResults(
            res.data.response.map((community: any) => community.name),
          );
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleCommunitySelect = (community: string) => {
    setSelectedCommunity(community);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();

    let content: string[] = [];
    let title = '';

    try {
      if (inputType === 'TEXT') {
        if (!textTitle || !textContent) {
          setErrorMessage(
            '텍스트 게시물의 제목과 내용을 모두 입력해야 합니다.',
          );
          setErrorModalVisible(true);
          return;
        }
        title = textTitle;
        content = [textContent];
      }

      if (inputType === 'MEDIA') {
        if (!mediaTitle || fileList.length === 0) {
          setErrorMessage(
            '미디어 게시물의 제목과 파일을 모두 제공해야 합니다.',
          );
          setErrorModalVisible(true);
          return;
        }
        const res: AwsImageUploadFunctionalityReturnType =
          await AwsImageUploadFunctionality({ fileList });
        if (!res) return;

        content = res.imageUrls;
        title = mediaTitle;
      }

      if (inputType === 'LINK') {
        if (!linkTitle || !linkContent) {
          setErrorMessage('링크 게시물의 제목과 링크를 모두 입력해야 합니다.');
          setErrorModalVisible(true);
          return;
        }
        title = linkTitle;
        content = [linkContent];
      }

      const paramObj: SubmitParams = {
        userId: ID,
        content: content,
        title: title,
        category: selectedCommunity,
        nickname: NICKNAME,
        type: inputType,
        tags: topics,
      };

      if (topics.length > 0) {
        const submitRes = await BoardSubmitAPI(paramObj);
        if (!submitRes) return;

        const response = submitRes.data.response;
        if (response) {
          navigate(`/boards/read?id=${response.id}`);
        }
      } else {
        alert('태그가 1개이상 필요합니다.');
      }
    } catch (error) {
      console.error('Error : ', error);
    }
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 0',
    border: '1px solid #fff',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#0079D3',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, color 0.3s',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#84d7fb',
    color: 'white',
    border: '#84d7fb',
  };

  useEffect(() => {
    const fetchDefaultCommunities = async () => {
      if (searchTerm) {
        try {
          const res = await GetCommunitiesNameAPI({ name: searchTerm });
          if (res && res.data && res.data.response) {
            setSearchResults(
              res.data.response.map((community: any) => community.name),
            );
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error fetching communities:', error);
          setSearchResults([]);
        }
      }
    };

    fetchDefaultCommunities();
  }, []);

  return (
    <>
      <BoardSubmitContainer>
        <ContentWrapper>
          <HeaderWrapper>
            <button
              onClick={() => setInputType('TEXT')}
              style={inputType === 'TEXT' ? activeButtonStyle : buttonStyle}
            >
              텍스트
            </button>
            <button
              onClick={() => setInputType('MEDIA')}
              style={inputType === 'MEDIA' ? activeButtonStyle : buttonStyle}
            >
              이미지 & 비디오
            </button>
            <button
              onClick={() => setInputType('LINK')}
              style={inputType === 'LINK' ? activeButtonStyle : buttonStyle}
            >
              링크
            </button>
          </HeaderWrapper>

          <InputStyle
            type="text"
            value={searchTerm}
            onChange={handleCommunitySearchChange}
            placeholder="커뮤니티 검색"
          />
          {searchResults.length > 0 && (
            <SearchCommunityList>
              {searchResults.map((result, index) => (
                <Item
                  key={index}
                  isEven={index % 2 === 0}
                  onClick={() => handleCommunitySelect(result)}
                >
                  {result}
                </Item>
              ))}
            </SearchCommunityList>
          )}
          {selectedCommunity && (
            <div style={{ marginTop: '5px' }}>
              선택된 커뮤니티: {selectedCommunity}
            </div>
          )}

          {inputType === 'TEXT' && (
            <>
              <InputStyle
                name="title"
                type="text"
                placeholder="제목"
                onChange={handleTextTitleChange}
              />
              <SubmitText
                text={textContent}
                setText={handleEditorChange}
                height={'400px'}
                image={image}
                setImage={setImage}
              />
            </>
          )}
          {inputType === 'MEDIA' && (
            <>
              <InputStyle
                name="title"
                type="text"
                placeholder="제목"
                onChange={handleMediaTitleChange}
              />

              {previewUrls.length > 0 ? (
                <>
                  <button onClick={imageUrlListDelete}>휴지통</button>
                  {previewUrls.map((image, index) => (
                    <ImagePreviewWrapper key={index}>
                      <ImagePreview
                        src={image}
                        alt={`Preview image ${index}`}
                      />
                    </ImagePreviewWrapper>
                  ))}
                </>
              ) : (
                <>
                  <InputStyle
                    type={'file'}
                    multiple
                    onChange={handleFileChange}
                  />
                </>
              )}
            </>
          )}
          {inputType === 'LINK' && (
            <>
              <InputStyle
                name="title"
                type="text"
                placeholder="제목"
                onChange={handleLinkTitleChange}
              />
              <InputStyle
                type="text"
                placeholder="링크 추가"
                onChange={(e) => handleLinkContentChange(e)}
              />
            </>
          )}
          <Container>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Label htmlFor="topicSearch">태그 검색</Label>
              <TopicSearchInput
                type="text"
                id="topicSearch"
                value={tagSearchTerm}
                onChange={handleSearchChange}
              />
              {suggestions.length > 0 && (
                <Suggestions>
                  {suggestions.map((suggestion, index) => (
                    <Suggestion
                      key={index}
                      onClick={() => handleAddTopic(suggestion)}
                    >
                      {suggestion}
                    </Suggestion>
                  ))}
                </Suggestions>
              )}
              {tagSearchTerm &&
                !suggestions.includes(`#${tagSearchTerm}`) &&
                !topics.includes(`#${tagSearchTerm}`) && (
                  <NoSuggestionWrapper>
                    <TagInfoMessage>
                      등록된 태그가 없습니다. "{tagSearchTerm}"로 새 태그를
                      추가할 수 있습니다.
                    </TagInfoMessage>
                    <AddButton onClick={() => handleAddTopic(tagSearchTerm)}>
                      "{tagSearchTerm}" 추가
                    </AddButton>
                  </NoSuggestionWrapper>
                )}

              <SelectedTopicWrapper>
                {topics.map((topic, index) => {
                  return (
                    <TopicItem key={index}>
                      <TopicText>{topic}</TopicText>
                      <DeleteButton onClick={() => handleRemoveTopic(index)} />
                    </TopicItem>
                  );
                })}
              </SelectedTopicWrapper>
            </Form>
          </Container>
          <SubmitButtonStyle type="submit" onClick={(e) => handleSubmit(e)}>
            보내기
          </SubmitButtonStyle>
        </ContentWrapper>
      </BoardSubmitContainer>
      <ErrorModal
        show={errorModalVisible}
        handleClose={() => setErrorModalVisible(false)}
        errorMessage={errorMessage}
      />
    </>
  );
};

const BoardSubmitContainer = styled.div`
  width: 80%;
  height: 100%;
  overflow: visible;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    margin: 0;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.desktop}) {
    width: 80%;
    margin-left: 15vw;
  }
`;

const ContentWrapper = styled.div`
  transform: translate(12%);
  width: 100%;
  height: auto;
  padding: 10px;
  background-color: #fff;
  box-sizing: border-box;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    margin: 0;
    transform: translate(0);
  }
`;

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
`;

const Container = styled.div`
  background-color: #ffffff;
  padding: 20px;
  height: auto;
  margin: 45px auto 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border: 1px solid #ededed;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const SelectedTopicWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const TopicItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 8px 12px;
`;
const TopicText = styled.span`
  font-size: 14px;
  margin-right: 10px;
`;
const Label = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: bold;
`;
const TopicSearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f7f7f7;
  box-sizing: border-box;
`;
const Suggestions = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
`;
const Suggestion = styled.li`
  padding: 10px;
  cursor: pointer;
`;
const NoSuggestionWrapper = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
`;
const AddButton = styled.button`
  margin-top: 10px;
  padding: 10px 10px;
  border: none;
  border-radius: 8px;
  background-color: #0079d3;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
`;

const InputStyle = styled.input`
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const SubmitButtonStyle = styled.button`
  padding: 10px 20px;
  background-color: #84d7fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const SearchCommunityList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
`;

const Item = styled.li<{ readonly isEven: boolean }>`
  cursor: pointer;
  padding: 8px;
  background-color: ${({ isEven }) => (isEven ? '#f9f9f9' : '#fff')};
  box-sizing: border-box;

  &:hover {
    background-color: #e0e0e0; /* 선택사항: 호버 효과 추가 */
  }
`;

const ImagePreviewWrapper = styled.div``;

const ImagePreview = styled.img`
  height: 400px;
  width: 400px;
  object-fit: cover; /* 선택사항: 이미지를 잘라내거나 비율 유지 */
`;

const TagInfoMessage = styled.p`
  font-size: 16px;
  color: #555;
  margin: 10px 0;
  line-height: 1.5;
`;

export default BoardSubmit;
