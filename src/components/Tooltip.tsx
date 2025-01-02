import React from 'react';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react';
import styled from 'styled-components';

const Tooltip = ({ image, title, content }: ToolTipProps) => {
  return (
    <TooltipContainer>
      <Tippy
        content={content}
        placement="right"
        offset={[10, 0]}
        interactive={true}
      >
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

const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 25px;
`;

const ImageContainer = styled.span`
  margin-right: 5px;
  font-size: 20px;
  cursor: pointer;
`;

const TitleContainer = styled.button`
  border: none;
  font-size: 16px;
  margin-left: 3px;
  cursor: pointer;
  padding: 3px 5px;
  border-radius: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;
