import ErrorModal from "./ErrorModal"
import { useState } from "react"
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface GuardProps {
    readonly children: ReactNode
}

const Guard = ({children}:GuardProps) => {
    const navigate = useNavigate();
    const [show, setShow] = useState<boolean>(true)

    const handleClose = () => {
        setShow(false)
        navigate('/')
    }

    if(!localStorage.getItem('access_token')){
        return(
            <ErrorModal
            errorMessage="로그인 후 이용해주세요"
            show={show}
            handleClose={handleClose}
            />
        )
    }

    return(
        <>
            {children}
        </>
    )
}

export default Guard;