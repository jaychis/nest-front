import React from "react";
import styles from './GlobalBar.module.css'
import { FaSistrix, FaUserAlt, FaPlus } from 'react-icons/fa';

const GlobalBar = () => {

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: '10px'
        }}>
            {/* Logo */}
            <img src="logo.png" alt="Logo" style={{width: '50px'}}/>

            {/* Search Bar */}
            <div style={{flexGrow: 1, marginLeft: '20px', marginRight: '20px'}}>
                <input type="search" placeholder="Search Reddit" style={{width: '100%', padding: '10px'}}/>
            </div>

            {/* Navigation Icons */}
            <div style={{display: 'flex', alignItems: 'center'}}>
                <FaSistrix style={{marginRight: '20px'}}/> {/* Search Icon */}
                <FaUserAlt style={{marginRight: '20px'}}/> {/* User Icon */}
                <button style={{background: 'none', border: 'none'}}>
                    <FaPlus/> {/* Plus/Create Icon */}
                </button>
            </div>
        </nav>
    );
}
export default GlobalBar