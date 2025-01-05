import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css'; 
import { AwsImageUploadFunctionality } from "../_common/imageUploadFuntionality";
import { useRef, useMemo } from "react";
interface Props {
  readonly setContent: (item: string[] | ((prev: string[]) => string[])) => void;
  readonly content: string[];
  readonly height: string;
}
const SubmitQuill = ({setContent, content, height}: Props) => {
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
        [ 'italic', 'underline', 'strike', 'blockquote', 'code-block', { color: [] }, { background: [] }],
        ['image', 'link'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  }), []);
  return (
    <ReactQuill
      ref={quillRef}
      style={{ height: height }}
      onChange={(content) => setContent(content.split('<br />'))}
      value={content.join('<br />')}
      modules={modules}
    />
  );
};
export default SubmitQuill;