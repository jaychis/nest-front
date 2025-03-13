import styled from "styled-components";
import SubmitQuill from "../../../components/SubmitQuill";
import UploadImageAndVideo from "../BoardSubmit/UploadImageAndVideo";
import { BoardUpdate } from "../../api/boardApi";

interface BoardEditProps {
    readonly editContent: string[];
    readonly editTitle: string;
    readonly editIndex: number;
    readonly setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    readonly myPosts: any[];
    readonly setEditContent: React.Dispatch<React.SetStateAction<string[]>>;  
    readonly setEditTitle: React.Dispatch<React.SetStateAction<string>>;
    readonly setEditIndex: React.Dispatch<React.SetStateAction<number>>;
}

const BoardEdit = ({editContent,editIndex,editTitle,setModalIsOpen,myPosts, setEditContent, setEditTitle, setEditIndex}:BoardEditProps) => {
    
    return(
        <>
            <StyledInput
            value={editTitle}
            onChange={(e) => {setEditTitle(e.target.value);}}
            placeholder="수정을 제목을 입력하세요"
            />
    
            {myPosts[editIndex] && myPosts[editIndex].type === 'TEXT' && (
            <div style= {{width: '90%'}}>
            <SubmitQuill
            setContent={setEditContent}
            content={editContent}
            height={'50vh'}
            />
            </div>
            )}
    
            {myPosts[editIndex] && myPosts[editIndex].type === 'MEDIA' && (
            <UploadImageAndVideo
            setContent={setEditContent}
            content={editContent}
            />
            )}
    
            {myPosts[editIndex] && myPosts[editIndex].type === 'LINK' && (
            <StyledInput
            value={editContent}
            onChange={(e) => {setEditContent([e.target.value]);}}
            placeholder="수정할 링크를 입력하세요"
            />
            )}
    
            <SubmitButtonStyle
            onClick={() => {
            BoardUpdate({
            id: myPosts[editIndex].id,
            title: editTitle,
            content: editContent,
            nickname: myPosts[editIndex].nickname,
            category: myPosts[editIndex].category,
            });
            alert('수정이 완료되었습니다.');
            setModalIsOpen(false);
            }}
            >
                보내기
            </SubmitButtonStyle>
        </>
    )
}

export default BoardEdit

const StyledInput = styled.input`
  flex: 1;
  width: 85%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #f7f7f7;
  margin-top: 3vh;
  margin-bottom: 3vh;
`;

const SubmitButtonStyle = styled.button`
  width: 80px;
  padding: 10px 20px;
  background-color: #84d7fb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 5vh;
  margin-bottom: 5vh;
`;