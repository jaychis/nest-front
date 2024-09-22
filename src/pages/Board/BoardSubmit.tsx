import React, { FormEvent, useEffect, useState, useRef } from 'react';
import { SubmitAPI, SubmitParams } from '../api/BoardApi';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css'; // import styles
import ReactQuill from 'react-quill';
import 'react-markdown-editor-lite/lib/index.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BoardType } from '../../_common/CollectionTypes';
import {
  AwsImageUploadFunctionality,
  AwsImageUploadFunctionalityReturnType,
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsDelete,
  ImageLocalPreviewUrlsDeleteType,
  ImageLocalPreviewUrlsReturnType,
} from '../../_common/ImageUploadFuntionality';
import { GetCommunitiesNameAPI } from '../api/CommunityApi';
import ErrorModal from '../../_common/ErrorModal';
import { Button } from '../../components/Button';

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
  const handleTextTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    const { value } = event.target;
    setTextTitle(value);
  };

  const [mediaTitle, setMediaTitle] = useState<string>('');
  const handleMediaTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    const { value } = event.target;
    setMediaTitle(value);
  };

  const [linkTitle, setLinkTitle] = useState<string>('');
  const handleLinkTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    const { value } = event.target;
    setLinkTitle(value);
  };

  const [textContent, setTextContent] = useState<string>('');
  const handleEditorChange = (content: string) => {
    setTextContent(content);
  };

  const handleTextContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.target;
    setTextContent(textarea.value);

    // Adjust textarea height to fit content
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
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
    event: React.ChangeEvent<HTMLInputElement>
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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    const { value } = event.target;
    setLinkContent(value);
  };

  const [selectedCommunity, setSelectedCommunity] = useState<string>('jaychis');
  const [searchTerm, setSearchTerm] = useState<string>('jaychis');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleCommunitySearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value) {
      try {
        const res = await GetCommunitiesNameAPI({ name: value });
        if (res && res.data && res.data.response) {
          console.log('Search results:', res.data.response);
          setSearchResults(
            res.data.response.map((community: any) => community.name)
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
    event: FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    event.preventDefault();

    let content: string[] = [];
    let title = '';

    try {
      if (inputType === 'TEXT') {
        if (!textTitle || !textContent) {
          setErrorMessage(
            '텍스트 게시물의 제목과 내용을 모두 입력해야 합니다.'
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
            '미디어 게시물의 제목과 파일을 모두 제공해야 합니다.'
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
        identifierId: ID,
        content: content,
        title: title,
        category: selectedCommunity,
        nickname: NICKNAME,
        type: inputType,
      };

      SubmitAPI(paramObj)
        .then((res) => {
          const response = res.data.response;
          if (res.status === 201) {
            sessionStorage.setItem('boardId', response.id);
            sessionStorage.setItem('boardTitle', response.title);
            navigate(`/boards/read?id=${response.id}&title=${response.title}`);
          }
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.error('Error : ', error);
    }
  };

  const sliderSetting = {
    dots: true,
    infinite: previewUrls.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  useEffect(() => {
    console.log('inputType : ', inputType);
  }, [inputType]);

  useEffect(() => {
    const fetchDefaultCommunities = async () => {
      if (searchTerm) {
        try {
          const res = await GetCommunitiesNameAPI({ name: searchTerm });
          if (res && res.data && res.data.response) {
            setSearchResults(
              res.data.response.map((community: any) => community.name)
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
      <div className='flex justify-center w-full'>
        <div className='flex-1'>
          <div className='min-h-screen bg-white'>
            <div className='flex justify-center w-full'>
              <div className='flex-1'>
                <div className='w-full h-auto p-2.5 bg-white'>
                  <div className='flex justify-start mb-5'>
                    <button
                      onClick={() => setInputType('TEXT')}
                      className={`px-5 py-2.5 m-0 rounded cursor-pointer font-bold transition-colors duration-300 ${
                        inputType === 'TEXT'
                          ? 'bg-[#84d7fb] text-white border border-[#84d7fb]'
                          : 'bg-blue-500 text-[#0079D3] border border-white'
                      }`}
                    >
                      텍스트
                    </button>
                    <button
                      onClick={() => setInputType('MEDIA')}
                      className={`px-5 py-2.5 m-0 rounded cursor-pointer font-bold transition-colors duration-300 ${
                        inputType === 'MEDIA'
                          ? 'bg-[#84d7fb] text-white border border-[#84d7fb]'
                          : 'bg-white text-[#0079D3] border border-white'
                      }`}
                    >
                      이미지 & 비디오
                    </button>
                    <button
                      onClick={() => setInputType('LINK')}
                      className={`px-5 py-2.5 m-0 rounded cursor-pointer font-bold transition-colors duration-300 ${
                        inputType === 'LINK'
                          ? 'bg-[#84d7fb] text-white border border-[#84d7fb]'
                          : 'bg-white text-[#0079D3] border border-white'
                      }`}
                    >
                      링크
                    </button>
                  </div>

                  <input
                    type='text'
                    value={searchTerm}
                    onChange={handleCommunitySearchChange}
                    placeholder='커뮤니티 검색'
                    className='w-full h-[30px] mb-2.5 mt-2.5 pt-2.5 pb-2.5 border border-gray-300 rounded'
                  />
                  {searchResults.length > 0 && (
                    <ul className='p-0 list-none'>
                      {searchResults.map((result, index) => (
                        <li
                          key={index}
                          onClick={() => handleCommunitySelect(result)}
                          className={`cursor-pointer p-2 ${
                            index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                          }`}
                        >
                          {result}
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedCommunity && (
                    <div>선택된 커뮤니티: {selectedCommunity}</div>
                  )}

                  {inputType === 'TEXT' && (
                    <>
                      <input
                        name='title'
                        type='text'
                        placeholder='제목'
                        onChange={handleTextTitleChange}
                        className='w-full h-[30px] mb-2.5 mt-2.5 pt-2.5 pb-2.5 border border-gray-300 rounded'
                      />
                      <ReactQuill
                        value={textContent}
                        onChange={handleEditorChange}
                        style={{ height: '400px' }}
                      />
                    </>
                  )}
                  {inputType === 'MEDIA' && (
                    <>
                      <input
                        name='title'
                        type='text'
                        placeholder='제목'
                        onChange={handleMediaTitleChange}
                        className='w-full h-[30px] mb-2.5 mt-2.5 pt-2.5 pb-2.5 border border-gray-300 rounded'
                      />
                      {previewUrls.length > 0 ? (
                        <>
                          <button onClick={imageUrlListDelete}>휴지통</button>
                          <Slider {...sliderSetting}>
                            {previewUrls.map((image, index) => (
                              <div key={index}>
                                <img
                                  src={image}
                                  alt={`Preview image ${index}`}
                                  className='h-[400px] w-[400px]'
                                />
                              </div>
                            ))}
                          </Slider>
                        </>
                      ) : (
                        <>
                          <input
                            type='file'
                            multiple
                            onChange={handleFileChange}
                            className='w-full h-[30px] mb-2.5 mt-2.5 pt-2.5 pb-2.5 border border-gray-300 rounded'
                          />
                        </>
                      )}
                    </>
                  )}
                  {inputType === 'LINK' && (
                    <>
                      <input
                        name='title'
                        type='text'
                        placeholder='제목'
                        onChange={handleLinkTitleChange}
                        className='w-full h-[30px] mb-2.5 mt-2.5 pt-2.5 pb-2.5 border border-gray-300 rounded'
                      />
                      <input
                        type='text'
                        placeholder='링크 추가'
                        onChange={(e) => handleLinkContentChange(e)}
                        className='w-full h-[30px] mb-2.5 mt-2.5 pt-2.5 pb-2.5 border border-gray-300 rounded'
                      />
                    </>
                  )}
                  <Button
                    type='submit'
                    onClick={(e) => handleSubmit(e)}
                    className='bg-blue-500'
                  >
                    보내기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorModal
        show={errorModalVisible}
        handleClose={() => setErrorModalVisible(false)}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default BoardSubmit;
