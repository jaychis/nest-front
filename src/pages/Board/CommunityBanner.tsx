import styled from 'styled-components';
import CommunityProfile from './CommunityProfile';
import { SelectCommunityParams } from '../../reducers/communitySlice';
import { useSelector } from 'react-redux';
import { breakpoints } from '../../_common/breakpoint';

const URL_LOGO: string =
  'https://img.freepik.com/free-photo/gray-wall-textures-background_74190-4389.jpg?t=st=1735131572~exp=1735135172~hmac=ee4001c10e2f66316b1d4e9f74a5c1b36659527d9132abca7d98892b42d85cf0&w=1380';

const CommunityBanner = () => {
  const selectCommunity: SelectCommunityParams = useSelector(
    (state: any) => state.community,
  );

  return (
    <>
      <BackgroundContainer>
        <BackgroundImage
          src={selectCommunity?.banner || URL_LOGO}
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
  height: 15vh;
  margin-bottom: 20vh;

  @media (max-width: ${breakpoints.mobile}) {
    height: 12vh;
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
`;

export default CommunityBanner;
