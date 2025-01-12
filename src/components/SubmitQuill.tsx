import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; 
import { AwsImageUploadFunctionality } from "../_common/imageUploadFuntionality";
import { useRef, useMemo, useEffect } from "react";
import Quill from 'quill';

interface Props {
  readonly setContent: (item: string[] | ((prev: string[]) => string[])) => void;
  readonly content: string[];
  readonly height: string;
  readonly width?: string;
}

const SubmitQuill = ({ setContent, content, height, width }: Props) => {

  
  const Link = Quill.import('formats/link');

  class CustomLink extends Link {
    static create(value: string) {
      if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        value = `https://${value}`;  
      }
      return super.create(value);
    }
  }

  Quill.register(CustomLink, true);

  useEffect(() => {
    if (content[0].length > 65535) {
      alert('내용은 65535자 이하여야 합니다.\n 이미지는 사진모양 아이콘을 클릭하여 업로드 해주세요');
    }
  }, [content]);

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
        [ 'italic', 'underline', 'strike', { color: [] }, 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  }), []);

  const formats = [
    'italic',
    'underline',
    'strike',
    'blockquote',
    'color',
    'image',
    'list',
    'link',
  ];

  return (
    <ReactQuill
      ref={quillRef}
      style={{ height: height, width: width }}
      onChange={(content) => setContent(content.split('<br />'))}
      value={content.join('<br />')}
      modules={modules}
      formats={formats}
    />
  );
};

export default SubmitQuill;