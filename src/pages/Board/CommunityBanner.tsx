import styled from 'styled-components';
import logo from '../../assets/img/logo.png';
import CommunityProfile from './CommunityProfile';
import { SelectCommunityParams } from '../../reducers/communitySlice';
import { useSelector } from 'react-redux';

const CommunityBanner = () => {
  const selectCommunity: SelectCommunityParams = useSelector(
    (state: any) => state.community,
  );

  return (
    <>
      <BackgroundContainer>
        <BackgroundImage
          src={selectCommunity.banner === null ? logo : selectCommunity.banner}
          alt="Description"
        />
        <CommunityProfile />
      </BackgroundContainer>
    </>
  );
};

const BackgroundContainer = styled.div`
  display: flex;
  width: 100%;
  height: 40vh;
  margin-bottom: 10vh;
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
`;

export default CommunityBanner;
