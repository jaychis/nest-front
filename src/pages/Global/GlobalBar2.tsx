import React from "react";
import styles from './GlobalBar.module.css'

const GlobalBar2 = () => {

    return <>
        <header className={styles.header}>
            <div className={styles.contents}>
                <div>
                    로고 자리
                </div>

                <nav>
                    <ul>
                        <li>
                            메뉴 1
                        </li>
                        <li>
                            메뉴 2
                        </li>
                    </ul>
                </nav>
            </div>


        </header>
    </>
}

export default GlobalBar2