import { useState, useEffect, useRef, ChangeEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunity } from '../../../contexts/CommunityContext';
import {
  AwsImageUploadFunctionality,
  AwsImageUploadFunctionalityReturnType,
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsReturnType,
} from '../../../_common/ImageUploadFuntionality';
import styled from 'styled-components';
import MultiStepNav from '../../../components/Buttons/MultiStepNav';
import Button from '../../../components/Buttons/Button';
import { CommunitySubmitParams } from '../../api/CommunityApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { community } from '../../../reducers/communitySlice';

const CommunityCreatePage1: FC = () => {
  const navigate = useNavigate();
  const {
    communityName,
    setCommunityName,
    description,
    setDescription,
    profilePicture,
    setProfilePicture,
    backgroundPicture,
    setBackgroundPicture,
  } = useCommunity();
  const [textareaHeight, setTextareaHeight] = useState('120px');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );
  const communityState: CommunitySubmitParams = useSelector(
    (state: RootState) => state.community
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateCommunity = () => {
    dispatch(
      community({ name: 'test', description: 'test', visibility: 'PUBLIC' })
    );
    console.log(communityState.name);
  };

  useEffect(() => {
    if (textareaRef.current) {
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`);
    }
  }, [description]);

  useEffect(() => {
    if (profilePicture && typeof profilePicture !== 'string') {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(profilePicture);
    } else if (typeof profilePicture === 'string') {
      setProfilePreview(profilePicture);
    } else {
      setProfilePreview(null);
    }
  }, [profilePicture]);

  useEffect(() => {
    if (backgroundPicture && typeof backgroundPicture !== 'string') {
      const reader = new FileReader();
      reader.onloadend = () => setBackgroundPreview(reader.result as string);
      reader.readAsDataURL(backgroundPicture);
    } else if (typeof backgroundPicture === 'string') {
      setBackgroundPreview(backgroundPicture);
    } else {
      setBackgroundPreview(null);
    }
  }, [backgroundPicture]);

  const handleNext = async () => {
    if (profilePicture && typeof profilePicture !== 'string') {
      const profileRes: AwsImageUploadFunctionalityReturnType =
        await AwsImageUploadFunctionality({ fileList: [profilePicture] });
      if (!profileRes) return;
      setProfilePicture(profileRes.imageUrls[0]);
    }

    if (backgroundPicture && typeof backgroundPicture !== 'string') {
      const backgroundRes: AwsImageUploadFunctionalityReturnType =
        await AwsImageUploadFunctionality({ fileList: [backgroundPicture] });
      if (!backgroundRes) return;
      setBackgroundPicture(backgroundRes.imageUrls[0]);
    }

    navigate('/community/create3', { state: { communityName, description } });
  };

  const handleCancel = () => navigate('/');

  const handleProfilePictureChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event: e,
    });
    if (!urls) return;
    setProfilePreview(urls.previewUrls[0]);
    setProfilePicture(urls.fileList[0]);
  };

  const handleBackgroundPictureChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event: e,
    });
    if (!urls) return;
    setBackgroundPreview(urls.previewUrls[0]);
    setBackgroundPicture(urls.fileList[0]);
  };

  return (
    <Container textareaHeight={textareaHeight}>
      <button
        onClick={() => {
          handleUpdateCommunity();
        }}
      >
        test
      </button>
      <Heading>커뮤니티 만들기</Heading>
      <Form onSubmit={(e) => e.preventDefault()}>
        <BackgroundUploader>
          <HiddenFileInput
            type='file'
            id='backgroundPicture'
            accept='image/*'
            onChange={handleBackgroundPictureChange}
          />
          <BackgroundImagePreviewWrapper
            onClick={() =>
              document.getElementById('backgroundPicture')?.click()
            }
          >
            {backgroundPreview ? (
              <BackgroundImagePreview
                src={backgroundPreview}
                alt='Background Preview'
              />
            ) : (
              <Placeholder>배경 사진</Placeholder>
            )}
          </BackgroundImagePreviewWrapper>
        </BackgroundUploader>

        <Row>
          <ImageUploadWrapper>
            <HiddenFileInput
              type='file'
              id='profilePicture'
              accept='image/*'
              onChange={handleProfilePictureChange}
            />
            <ImagePreviewWrapper
              onClick={() => document.getElementById('profilePicture')?.click()}
            >
              {profilePreview ? (
                <ImagePreview src={profilePreview} alt='Profile Preview' />
              ) : (
                <Placeholder>프로필</Placeholder>
              )}
            </ImagePreviewWrapper>
          </ImageUploadWrapper>

          <CommunityNameInput
            required
            type='text'
            id='communityName'
            value={communityName}
            placeholder='커뮤니티 이름'
            onChange={(e) => setCommunityName(e.target.value)}
          />
        </Row>

        <DescriptionWrapper>
          <Label htmlFor='description'>설명</Label>
          <DescriptionTextArea
            required
            id='description'
            ref={textareaRef}
            value={description}
            height={textareaHeight}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DescriptionWrapper>

        <MultiStepNav>
          <Button bgColor='cancel' onClick={handleCancel} type='button'>
            취소
          </Button>
          <Button bgColor='next' onClick={handleNext} type='button'>
            다음
          </Button>
        </MultiStepNav>
      </Form>
    </Container>
  );
};

export default CommunityCreatePage1;

// Styled Components
const Container = styled.div<{ textareaHeight: string }>`
  background-color: #ffffff;
  padding: 20px;
  max-width: 800px;
  margin: 50px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border: 1px solid #ededed;
  height: calc(400px + ${(props) => props.textareaHeight} + 40px);
`;

const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const BackgroundUploader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const BackgroundImagePreviewWrapper = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 12px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BackgroundImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  font-size: 14px;
  color: #888;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ImageUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 20px;
`;

const ImagePreviewWrapper = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const CommunityNameInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f7f7f7;
`;

const DescriptionWrapper = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
`;

const Label = styled.label`
  color: #555;
  font-weight: bold;
`;

const DescriptionTextArea = styled.textarea<{ height: string }>`
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  min-height: 120px;
  margin-top: 18px;
  resize: none;
  background-color: #f7f7f7;
  box-sizing: border-box;
  overflow: hidden;
  height: ${(props) => props.height};
`;
