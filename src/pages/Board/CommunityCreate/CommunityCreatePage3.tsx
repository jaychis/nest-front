import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunity } from '../../../contexts/CommunityContext';
import {
  CommunitySubmitAPI,
  CommunitySubmitParams,
} from '../../api/communityApi';
import { CommunityVisibilityType } from '../../../_common/collectionTypes';
import { CommunityTagsSubmitAPI } from '../../api/communityTagsAPI';
import { FaLock} from '@react-icons/all-files/fa/FaLock'; 
import { FaGlobe } from '@react-icons/all-files/fa/FaGlobe'; 
import { FaUsers } from '@react-icons/all-files/fa/FaUsers'; 
import styled from 'styled-components';
import MultiStepNav from '../../../components/Buttons/MultiStepNav';
import Button from '../../../components/Buttons/Button';
import { GetSearchPeopleAPI } from '../../api/searchApi';
import vCheck from '../../../assets/img/v-check.png';

const CommunityCreatePage3: FC = () => {
  interface User {
    readonly nickname: string;
    readonly id: string[];
  }

  const navigate = useNavigate();
  const { communityName, description, banner, icon, topics } = useCommunity();
  const [visibility, setVisibility] =
    useState<CommunityVisibilityType>('PUBLIC');
  const [searchResultList, setSearchResultList] = useState<User[]>([]);
  const communityCreator: string = localStorage.getItem('id') as string;

  useEffect(() => {
    if (visibility === 'PRIVATE' || visibility === 'RESTRICTED') {
      setIsCommunity((prevState) => ({
        ...prevState,
        id: [communityCreator],
        visibility: visibility,
      }));
    } else {
      setIsCommunity((prevState) => ({
        ...prevState,
        id: [],
        visibility: visibility,
      }));
    }
  }, [visibility]);

  const handleUserSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    try {
      if (value) {
        const res = await GetSearchPeopleAPI({ query: value });
        if (res && res.data && res.data.response) {
          setSearchResultList(
            res.data.response.map((user: any) => ({
              nickname: user.nickname,
              id: user.id,
            })),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserSelect = (userId: string) => {
    if (isCommunity.id?.includes(userId)) {
      const deleteId = isCommunity.id.filter(
        (prevState) => prevState !== userId,
      );
      setIsCommunity((prevState) => ({ ...prevState, id: deleteId }));
    } else {
      setIsCommunity((prevState) => ({
        ...prevState,
        id: [...(prevState.id || []), userId], // undefined 상태를 빈 배열로 처리
      }));
    }
  };

  const [isCommunity, setIsCommunity] = useState<{
    readonly name: string;
    readonly description: string;
    readonly banner?: string | null;
    readonly icon?: string | null;
    readonly visibility: CommunityVisibilityType;
    readonly topics: string[];
    readonly id?: string[];
  }>({
    name: communityName,
    description: description,
    banner: banner,
    icon: icon,
    visibility: visibility,
    topics: [],
    id: [],
  });

  const handleSubmit = async (): Promise<void> => {
    if (!isCommunity.name || !isCommunity.description)
      return alert('커뮤니티 이름과 설명은 필수 입력 사항입니다');

    const params: CommunitySubmitParams = {
      name: isCommunity.name,
      description: isCommunity.description,
      banner: isCommunity.banner,
      icon: isCommunity.icon,
      visibility: isCommunity.visibility,
    };

    const coRes = await CommunitySubmitAPI(params);

    if (!coRes) return;
    const coResponse = await coRes.data.response;

    const tagResponse = [];
    if (topics.length > 0) {
      const tagRes = await CommunityTagsSubmitAPI({
        tags: topics,
        communityId: coResponse.id,
      });
      if (!tagRes) return;

      tagResponse.push(tagRes.data.response);
    }

    setIsCommunity({
      ...coResponse,
      topic: tagResponse,
    });

    navigate('/');
  };

  const handleBack = () => {
    navigate('/community/create2');
  };

  return (
    <Container>
      <Heading>커뮤니티 공개 설정</Heading>
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <Label>
            <Radio
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === 'PUBLIC'}
              onChange={() => setVisibility('PUBLIC')}
            />
            <OptionContent>
              <FaGlobe />
              <div>
                <OptionTitle>공개</OptionTitle>
                <OptionDescription>
                  모든 사용자가 이 커뮤니티를 볼 수 있습니다.
                </OptionDescription>
              </div>
            </OptionContent>
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>
            <Radio
              type="radio"
              name="visibility"
              value="restricted"
              checked={visibility === 'RESTRICTED'}
              onChange={() => setVisibility('RESTRICTED')}
            />
            <OptionContent>
              <FaUsers />
              <div>
                <OptionTitle>제한</OptionTitle>
                <OptionDescription>
                  모든 사용자가 이 커뮤니티를 볼 수 있지만, 참여하려면 승인이
                  필요합니다.
                </OptionDescription>
              </div>
            </OptionContent>
          </Label>
          {visibility === 'RESTRICTED' && (
            <UserSearchInput
              placeholder="초대할 유저의 닉네임을 입력해주세요"
              onChange={handleUserSearchChange}
            />
          )}
          {searchResultList.length > 0 && (
            <SearchResultList>
              {searchResultList.map((result, index) => (
                <>
                  {visibility === 'RESTRICTED' &&
                    searchResultList.length > 0 && (
                      <SearchResultItem
                        key={index}
                        index={index}
                        onClick={() =>
                          handleUserSelect(result.id.toLocaleString())
                        }
                      >
                        {result.nickname}
                        {isCommunity.id?.includes(
                          result.id.toLocaleString(),
                        ) ? (
                          <VCheckImg src={vCheck} />
                        ) : null}
                      </SearchResultItem>
                    )}
                </>
              ))}
            </SearchResultList>
          )}
        </FormGroup>

        <FormGroup onClick={() => {}}>
          <Label>
            <Radio
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === 'PRIVATE'}
              onChange={() => setVisibility('PRIVATE')}
            />
            <OptionContent>
              <FaLock />
              <div>
                <OptionTitle>비공개</OptionTitle>
                <OptionDescription>
                  초대된 사용자만 이 커뮤니티를 볼 수 있습니다.
                </OptionDescription>
              </div>
            </OptionContent>
          </Label>
          {visibility === 'PRIVATE' && (
            <UserSearchInput
              placeholder="초대할 유저의 닉네임을 입력해주세요"
              onChange={handleUserSearchChange}
            />
          )}
          {searchResultList.length > 0 && (
            <SearchResultList>
              {searchResultList.map((result, index) => (
                <>
                  {visibility === 'PRIVATE' && searchResultList.length > 0 && (
                    <SearchResultItem
                      key={index}
                      index={index}
                      onClick={() =>
                        handleUserSelect(result.id.toLocaleString())
                      }
                    >
                      {result.nickname}
                      {isCommunity.id?.includes(result.id.toLocaleString()) ? (
                        <VCheckImg src={vCheck} />
                      ) : null}
                    </SearchResultItem>
                  )}
                </>
              ))}
            </SearchResultList>
          )}
        </FormGroup>

        <MultiStepNav>
          <Button type="button" onClick={handleBack} bgColor="cancel">
            이전
          </Button>
          <Button type="button" onClick={handleSubmit} bgColor="next">
            완료
          </Button>
        </MultiStepNav>
      </Form>
    </Container>
  );
};

export default CommunityCreatePage3;

const Container = styled.div`
  background-color: #ffffff;
  padding: 20px;
  max-width: 600px;
  height: auto;
  margin: 50px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border: 1px solid #ededed;
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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  font-weight: bold;
  cursor: pointer;
`;

const Radio = styled.input`
  margin-right: 10px;
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
`;

const OptionTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const OptionDescription = styled.div`
  font-size: 12px;
  color: #888;
`;

const UserSearchInput = styled.input`
  border-radius: 25px;
  height: 25px;
  width: 90%;
  margin: 10px 0 0 4%;
`;

const SearchResultList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SearchResultItem = styled.li<{ index: number }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  background-color: ${(props) => (props.index % 2 === 0 ? '#f9f9f9' : '#fff')};
  width: 90%;
`;

const VCheckImg = styled.img`
  height: 20px;
  width: 20px;
  margin-left: auto;
`;
