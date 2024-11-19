import styled from "styled-components";

interface DropDownProps {
    readonly menu: string[]
    readonly eventHandler: (item: string) => any;
}

const DropDown = ({ menu,eventHandler }:DropDownProps) => {
    return (
        <DropDownContainer>
            <DropDownList
            >
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
    height: 100%;
    overflow: hidden;
`

const DropDownList = styled.ul`
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 5px;
  list-style-type: none;
  margin: 0;
`;

const DropDownItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 6vw;
    height: 40px;
    padding: 5px;
    font-size: 1rem;
`

export default DropDown;