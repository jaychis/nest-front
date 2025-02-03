import styled from 'styled-components';
import CommunityProfile from './CommunityProfile';
import { SelectCommunityParams } from '../../reducers/communitySlice';
import { useSelector } from 'react-redux';
import { breakpoints } from '../../_common/breakpoint';
import BANNER from '../../assets/img/community_banner.png';

const CommunityBanner = () => {
  const selectCommunity: SelectCommunityParams = useSelector(
    (state: any) => state.community,
  );

  return (
    <>
      <BackgroundContainer>
        <BackgroundImage
          src={selectCommunity?.banner || BANNER}
          alt="Description"
        />
        <CommunityProfile />
      </BackgroundContainer>
    </>
  );
};

const BackgroundContainer = styled.div`
  display: flex;
  width: 102%;
  height: 25vh;
  margin-bottom: 20vh;
  margin-left: -2%;

  @media (max-width: ${breakpoints.mobile}) {
    height: 25vh;
    
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
`;

export default CommunityBanner;
