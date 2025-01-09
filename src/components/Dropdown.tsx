import styled from "styled-components";
import { breakpoints } from "../_common/breakpoint";

interface DropDownProps {
    readonly menu: string[]
    readonly eventHandler: (item: string) => any;
}

const DropDown = ({ menu,eventHandler }:DropDownProps) => {
    return (
        <DropDownContainer>
            <DropDownList>
                {menu.map((item, index) => (
                    <DropDownItem
                    key={index} 
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    onClick = {() => {eventHandler(item)}}
                    >
                        {item}
                    </DropDownItem>
                ))}
            </DropDownList>
        </DropDownContainer>
    );
};

const DropDownContainer = styled.div`
  position: absolute;
  height: auto; 
  z-index: 1000;
  top: 35%;
  left: auto;
  right: 35%;
  transform: translateX(-50%);
  width: 100px;

  @media (max-width: 320px) {
    top: 31%;
    left: 73%;
    transform: translateX(-50%);
  }

  @media (min-width: 321px) and (max-width: ${breakpoints.mobile}) {
    top: 29%;
    left: 77%;
  }

  @media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
    top: 29%;
    left: 61%;
    transform: translateX(-50%);
  }

  @media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop}) {
    top: 29%;
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