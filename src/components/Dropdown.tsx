import React, { useEffect, useRef, forwardRef } from "react";
import styled from "styled-components";
import { breakpoints } from "../_common/breakpoint";

interface DropDownProps {
  readonly menu: string[];
  readonly eventHandler: (item: string, eventIndex?: number) => any;
  readonly eventIndex?: number;
  readonly onClose: () => void;
}

const DropDown = forwardRef<HTMLDivElement, DropDownProps>(
    ({ menu, eventHandler, eventIndex, onClose }, ref) => {
      const internalRef = useRef<HTMLDivElement>(null);
      const parentRef = ref
  
      useEffect(() => {
        if (!onClose) return;
      
        const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as Node;
      
          if (
            parentRef &&
            'current' in parentRef &&
            parentRef.current &&
            !parentRef.current.contains(target) &&
            internalRef?.current &&
            !internalRef.current.contains(target)
          ) {
            onClose();
          }
        };
      
        document.addEventListener('click', handleClickOutside);
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, [onClose, parentRef, internalRef]);
  
      return (
        <DropDownContainer ref={internalRef as React.RefObject<HTMLDivElement>}>
          <DropDownList>
            {menu.map((item, index) => (
              <DropDownItem
                key={index}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                onClick={() => {
                    eventHandler(item, eventIndex);
                    onClose()
                }}
              >
                {item}
              </DropDownItem>
            ))}
          </DropDownList>
        </DropDownContainer>
      );
    }
  );

const DropDownContainer = styled.div`
  position: absolute;
  height: auto; 
  z-index: 1000;
  top: 4vh;
  right: -50%;
  transform: translateX(-50%);
  width: 100px;

  @media (max-width: 320px) {
    left: -250%;
    transform: translateX(-50%);
  }

  @media (min-width: 321px) and (max-width: ${breakpoints.tablet}) {
    left: -190%;
    transform: translateX(-50%);
  }

  @media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop}) {
    top: 5vh
    left: 59%;
    transform: translateX(-50%);
  }
`;

const DropDownList = styled.ul`
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 5px;
  list-style-type: none;
  margin: 0;
  width: 100%;
`;

const DropDownItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    padding: 5px;
    font-size: 1rem;
    padding: 5px;

`

export default DropDown;