import React from 'react';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react';
import styled from 'styled-components';

const Tooltip = ({ image, title, content }: ToolTipProps) => {
  return (
    <TooltipContainer>
      <Tippy content={content}>
        <ContainerWrapper>
          <ImageContainer>{image}</ImageContainer>
          <TitleContainer>{title}</TitleContainer>
        </ContainerWrapper>
      </Tippy>
    </TooltipContainer>
  );
};
interface ToolTipProps {
  readonly content: string;
  readonly image: React.ReactNode;
  readonly title: string;
}
export default Tooltip;

const TooltipContainer = styled.span`
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
`;

const ContainerWrapper = styled.div``;

const ImageContainer = styled.span`
  margin-right: 5px;
  font-size: 20px;
  cursor: pointer;
`;

const TitleContainer = styled.button`
  //background-color: #d6d5d7;
  border: none;
  //color: black;
  font-size: 16px;
  margin-left: 6px;
  cursor: pointer;
  //margin: 0;
  //outline: none;
  padding: 3px 5px;
  border-radius: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;
