import React from 'react';
import logo from '../assets/img/panda_logo.png';
import styled from 'styled-components';
const EmptyState = () => {
  return (
    <Container>
      <Image src={logo} alt="Empty State" />
      <Text>아직 아무것도 없어요!</Text>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  border-radius: 50%;
  border: 2px solid #ddd;
`;

const Text = styled.p`
  font-size: 18px;
  color: #888;
  font-weight: bold;
`;

export default EmptyState;
