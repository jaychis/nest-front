import styled from 'styled-components';
import ReactQuill from 'react-quill';
import { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import { postContactApi, InquiryParam } from '../api/inquiryApi';
import Modal from 'react-modal';
import GlobalBar from '../Global/GlobalBar';
import logo from '../../assets/img/panda_logo.png';

interface SubmitModalProps {
  isopen: boolean;
  setIsopen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubmitInquiry: React.FC<SubmitModalProps> = ({ isopen, setIsopen }) => {
  const form = useRef<HTMLFormElement | null>(null);
  const serviceId: string = process.env.REACT_APP_SERVICE_ID || '';
  const templateId: string = process.env.REACT_APP_TEMPLATE_ID || '';
  const publicKey: string = process.env.REACT_APP_PUBLIC_KEY || '';
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const nickname = localStorage.getItem('nickname') as string;
  const toDay = new Date();

  const sendEmail = () => {
    if (form.current) {
      const templateParams = {
        title: title,
        message: content,
        from_name: nickname,
        date: toDay,
      };
      emailjs.send(serviceId, templateId, templateParams, publicKey).then(
        () => {
          console.log('SUCCESS!');
          setContent('');
          setIsopen(false);
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
    }
  };

  const checkForm = () => {
    if (title.trim() === '' || content.trim() === '')
      alert('제목과 내용은 필수 입력 항목입니다.');
    else {
      postContactApi({ title, nickname, content });
      sendEmail();
      setIsopen((prev) => !prev);
      alert('접수되었습니다.');
    }
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <>
      <GlobalBar />
      <Modal
        isOpen={isopen}
        onRequestClose={() => setIsopen(false)}
        style={{
          content: {
            width: '50%',
            height: '85vh',
            margin: 'auto',
            padding: '20px',
            background: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.30)',
            zIndex: 2002,
          },
        }}
      >
        <form ref={form}>
          <InquiryContainer>
            <LogoTitleWrapper>
              <img
                src={logo}
                style={{
                  height: '50px',
                  width: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  marginRight: '35%',
                }}
              />
              <SectionTitle>1:1 문의</SectionTitle>
              <br />
            </LogoTitleWrapper>

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
                style={{ height: '400px' }}
              />
            </ReactQuillWrapper>
          </InquiryContainer>
          <SumbitWrapper>
            <button
              type="button"
              style={submitButtonStyle}
              onClick={() => {
                checkForm();
              }}
            >
              작성
            </button>
          </SumbitWrapper>
        </form>
      </Modal>
    </>
  );
};

const LogoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  padding-bottom: 5px;
`;

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
  padding: '10px 20px',
  backgroundColor: '#84d7fb',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '45px',
};

export default SubmitInquiry;
