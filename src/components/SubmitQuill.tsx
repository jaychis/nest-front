import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { AwsImageUploadFunctionality } from "../_common/imageUploadFuntionality";
import { useRef, useMemo } from "react";
import sanitizeHtml from 'sanitize-html';

interface Props {
  readonly setContent: (item: string[] | ((prev: string[]) => string[])) => void;
  readonly content: string[];
  readonly height: string;
}

const SubmitQuill = ({ setContent, content, height }: Props) => {
  const quillRef = useRef<ReactQuill>(null);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', async () => {
      if (input.files && input.files[0]) {
        const files = Array.from(input.files);

        try {
          const res = await AwsImageUploadFunctionality({ fileList: files });
          if (res && res.imageUrls) {
            const imgUrl = res.imageUrls[0];
            const editor = quillRef.current?.getEditor();
            const range = editor?.getSelection();

            if (editor && range) {
              editor.insertText(range.index, '\n');
              editor.insertEmbed(range.index, 'image', imgUrl);
              editor.insertText(range.index, '\n'); 
              editor.setSelection({ index: range.index + 3, length: 0 });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', { color: [] }, { background: [] }],
        ['image', 'link','video'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  }), []);

  const handleChange = (value: string) => {
    // 줄바꿈을 <br>로 변환
    const sanitizedContent = sanitizeHtml(value, {
      allowedTags: ['br', 'img', 'p', 'a', 'b', 'i', 'u', 'strike'],
      allowedAttributes: {
        img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'style'],
        a: ['href']
      }
    });
    setContent(sanitizedContent.split('<br>'));
  };

  return (
    <ReactQuill
      ref={quillRef}
      style={{ height: height }}
      onChange={handleChange}
      value={content.join('<br>')}
      modules={modules}
    />
  );
};

export default SubmitQuill;