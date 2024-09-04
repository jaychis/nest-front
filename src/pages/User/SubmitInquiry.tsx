import styled from "styled-components";
import ReactQuill from "react-quill";
import { useState,useRef } from "react";
import emailjs from 'emailjs-com';


const SubmitInquiry = () => {

    const form = useRef<HTMLFormElement | null>(null);
    const serviceId: string = 'service_o561r9h';
    const templateId: string = 'template_s34vz8h';
    const publicKey: string = 'CPrb0IYDm3bwVoLXi';
    const [content, setContent] = useState<string>('');  
    const [title, setTitle] = useState<string>('');

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (form.current) {
            // 사용할 데이터 객체 생성
            const templateParams = {
                message: content  // message 변수에 ReactQuill에서 입력된 내용을 전달
            };

            emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then(
                () => {
                    console.log('SUCCESS!');
                    setContent(''); // 전송 후 입력 필드 초기화
                },
                (error) => {
                    console.log('FAILED...', error.text);
                }
            );
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ]
    };


  return(
      <>   
        <form ref={form} onSubmit={sendEmail}>
            <InquiryContainer>
                <TitleWrapper>
                    <InputTitle
                        name="title"
                        type="text"
                        placeholder="문의사항"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </TitleWrapper>
                <ReactQuillWrapper>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        theme="snow"
                        style={{ height: '400px'}}
                    />
                </ReactQuillWrapper>
            </InquiryContainer>
            <SumbitWrapper>
            <button type="submit" style={submitButtonStyle}>
              Send Message
            </button>
            </SumbitWrapper>
        </form>
        </>
  );
};


const InquiryContainer = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
`;

const TitleWrapper = styled.div`
    width: 100%;
    display: flex;
`;

const InputTitle = styled.input`
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const ReactQuillWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

const SumbitWrapper = styled.div`
    width: 100%;
    display: flex;
`;

const submitButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#84d7fb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop : '45px'
  };

export default SubmitInquiry;