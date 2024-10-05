import React from "react";
import "tippy.js/dist/tippy.css";
import Tippy from "@tippyjs/react";
import styled from "styled-components";

const Tooltip = ({ content }: ToolTipProps) => {
  return (
    <TooltipContainer>
      <Tippy content={content}>
        <StyledButton>!</StyledButton>
      </Tippy>
    </TooltipContainer>
  );
};
interface ToolTipProps {
  readonly content: string;
}
export default Tooltip;

const TooltipContainer = styled.span`
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
`;

const StyledButton = styled.button`
  background-color: #d6d5d7;
  border: none;
  color: black;
  font-size: 16px;
  cursor: pointer;
  margin: 0;
  outline: none;
  padding: 3px 5px;
  border-radius: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.3;
    background-color: #f0f0f0;
  }
`;
