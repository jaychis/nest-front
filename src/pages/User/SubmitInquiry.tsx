import styled from "styled-components";
import ReactQuill from "react-quill";
import { useState,useRef } from "react";
import emailjs from 'emailjs-com';
import { postContactApi, InquiryParam } from "../api/InquiryApi";

const SubmitInquiry = () => {

    const form = useRef<HTMLFormElement | null>(null);
    const serviceId: string = 'service_y1seuv8';
    const templateId: string = 'template_ws10r99';
    const publicKey: string = 'vIug5xjBisxtUBSFM';
    const [content, setContent] = useState<string>('');  
    const [title, setTitle] = useState<string>('');
    const nickName = localStorage.getItem("nickname") as string;
    const toDay = new Date();

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.current) {
            const templateParams = {
                title : title,
                message: content,
                from_name : nickName,
                date : toDay
            };

        emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then(
            () => {
                console.log('SUCCESS!');
                setContent('');
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
        <form  ref={form} onSubmit={sendEmail}>
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
            <button type="submit" style={submitButtonStyle} onClick={() => {postContactApi({title, nickName, content})}}>
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