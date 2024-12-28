import React from 'react';
import styled from 'styled-components';

const MobilePrivacyPolicyPage = () => {
  return (
    <IframeWrapper>
      <iframe
        src="https://sites.google.com/view/jaychis/home"
        title="Jaychis mobile privacy poliy"
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </IframeWrapper>
  );
};

const IframeWrapper = styled.div`
  width: 100%;
  height: 100vh; /* Full viewport height */
  overflow: hidden;
`;

export default MobilePrivacyPolicyPage;
