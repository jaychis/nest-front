

interface DropDownProps {
    readonly menu: string[]
    readonly eventHandler: (item: string) => any;
}

const DropDown = ({ menu,eventHandler }:DropDownProps) => {
    return (
        <div style={{ height: '20vh', overflow: 'hidden', transition: 'height 0.1s ease' }}>
            <ul 
            style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
            backgroundColor: '#fff',
            padding: '5px',
            listStyleType: 'none',
            margin: 0,
            }}
            >
                {menu.map((item, index) => (
                    <li 
                    key={index} 
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '6vw',  
                    height: '40px', 
                    padding: '5px',
                    fontSize: '1rem',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    onClick = {() => {eventHandler(item)}}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DropDown;