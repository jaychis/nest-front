import styled from "styled-components";
import logo from '../../assets/img/panda_logo.png'
import DropDown from "../../components/Dropdown";
import { useState,useRef,useEffect } from "react";
import React from "react";
import { CommunityUpdateAPI,CommunityUpdateParams } from "../api/communityApi";
import Modal from "../../components/Modal";
import { useDispatch } from "react-redux";
import { setCommunity } from "../../reducers/communitySlice"
import { useSelector } from "react-redux"
import { setModalState, UserModalState } from "../../reducers/modalStateSlice";
import { RootState } from "../../store/store";
import DragAndDrop from "../../components/DragAndDrop";
import { AwsImageUploadFunctionalityReturnType } from "../../_common/imageUploadFuntionality";

const CommunityProfile = () => {
    const dropDownRef = React.useRef<HTMLDivElement>(null)
    const editButtonRef = React.useRef<HTMLDivElement>(null)
    const [body, setBody] = useState<React.ReactNode>(null);

    const selectCommunity: CommunityUpdateParams = useSelector((state:any) => state.community)
    const modalState: UserModalState = useSelector((state: RootState) => state.modalState,);
    const dispatch = useDispatch();

    const editList = ['이름 변경', '배경 변경', '프로필 변경']
    const [editCommunityName, setEditCommunityName] = useState<string>('');
    const [editBackground, setEditBackground] = useState<AwsImageUploadFunctionalityReturnType | string>();
    const [editProfile, setEditProfile] = useState<AwsImageUploadFunctionalityReturnType | string>();
    const [editType, setEditType] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [view, setView] = useState<boolean>(false)
    
    const communityEditHandler = (item: string) => {
        setEditType(item) 
        dispatch(setModalState(!modalState.modalState))
        handleModal()
        setView(false);
    };

    const handleModal = () => {
        setIsOpen(!isOpen)
        dispatch(setModalState(!modalState.modalState))
    }

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (editButtonRef.current &&
                dropDownRef.current &&
                !editButtonRef.current.contains(event.target) &&
                !dropDownRef.current.contains(event.target)) {
                setView(false)
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return(
        <>
            <CommunityInfoContainer>
            <Modal
            isOpen = {isOpen}
            onClose={handleModal}
            >

            {/* onChange에서 dispatch를 이용해 selectCommunity의 값을 변경하지 않고  
            edit관련 변수들을 거쳐서 변경한 이유는 이름이나 배경사진을 변경하려다가
            취소하고 나오게 되면 onChange와 dispatch를 통해 변경된 상태가 화면에 적용돼
            새로고침을 하기 전까지 유저에게 보여지는 화면에는 커뮤니티의 이름이나 사진들이 변경된 것으로 보이게 되기 떄문에
            다른 변수를 통해 한번 거쳐감  */}

                {editType === '이름 변경' && (
                    <>
                    <CommunityNameInput
                    required
                    type="text"
                    id="communityName"
                    placeholder="변경할 이름을 입력해주세요"
                    onChange={(e) => 
                    setEditCommunityName(e.target.value)}
                    />
                    <SubmitButton 
                    onClick = {() => {
                    CommunityUpdateAPI({...selectCommunity,name:editCommunityName})
                    dispatch(setModalState(!modalState.modalState))
                    handleModal()
                    alert('커뮤니티 이름이 변경되었습니다.')
                    }}>
                        변경
                    </SubmitButton>
                    </>
                )}

                {editType === '배경 변경' && (
                    <>
                    <DragAndDrop
                    onFileChange={setEditBackground}
                    />
                    
                    <SubmitButton 
                    onClick = {() => {
                    CommunityUpdateAPI({...selectCommunity, banner:editBackground as string})
                    dispatch(setModalState(!modalState.modalState))
                    handleModal()
                    alert('배경화면이 변경 되었습니다.')
                    }}>
                        변경
                    </SubmitButton>
                    </>
                )}

                {editType === '프로필 변경' && (
                    <>
                    <DragAndDrop
                    onFileChange={setEditProfile}
                    />
                    
                    <SubmitButton 
                    onClick = {() => {
                    CommunityUpdateAPI({...selectCommunity, icon: editProfile as string})
                    dispatch(setModalState(!modalState.modalState))
                    handleModal()
                    alert('프로필 사진이 변경 되었습니다.')
                    window.location.reload();
                    }}>
                        변경
                    </SubmitButton>
                    </>
                )}
                
            </Modal>

                <ProfileCircle>
                    <ProfileImage src = {selectCommunity.icon === null ? logo : `${selectCommunity.icon}`} alt ='Description'/>
                </ProfileCircle>

                <CommunityNameWrapper>
                    <CommunityName>
                        {selectCommunity.name}
                    </CommunityName>
                </CommunityNameWrapper>

                <EditButton ref = {editButtonRef} onClick = {() => {setView(!view)}}>
                    <EditIcon src="https://img.icons8.com/material-outlined/24/menu-2.png" alt="menu-2"/>
                </EditButton>

                {view && (
                <DropDownElement ref = {dropDownRef}>
                    <DropDown 
                    menu = {editList}
                    eventHandler = {communityEditHandler}
                    />
                </DropDownElement>)}
                
            </CommunityInfoContainer>
        </>
    )
}

const CommunityInfoContainer = styled.div`
    display: flex;
    top: 35vh;
    left: 25%;
    position: absolute;
`

const ProfileCircle = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 75px;
    display: flex;
    border: 2px solid black;
`

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 75px;
`

const CommunityNameWrapper = styled.div`
    top: 40vh;
    display: flex;
    margin-top: 14vh;
`

const CommunityName = styled.h1`
    font-size: 2em;
    color: #333;
`

const EditButton = styled.div`
    position: absolute;
    top: 18vh;
    left: 55vw
`

const EditIcon = styled.img`
    cursor: pointer;
    width: 24px;
    height: 24px;
`

const DropDownElement = styled.div`
    position: absolute;
    top: 20vh;
    left: 47.5vw
`

const CommunityNameInput = styled.input`
  flex: 1;
  width: 90%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f7f7f7;
  margin-top: 3vh;
`;

const SubmitButton = styled.button`
  width: 100px;
  padding: 10px 20px;
  background-color: #84d7fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 5vh;
  margin-left: 38%;
`;

export default CommunityProfile;