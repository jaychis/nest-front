import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { AwsImageUploadFunctionality } from "../_common/imageUploadFuntionality";
import { useRef, useMemo } from "react";

interface Props {
  readonly setText: (item: string) => any;
  readonly text: string;
  readonly height: string;
  readonly image: File[];
  readonly setImage?: (item: File[]) => any;
}

const SubmitText = ({setText,text,height,image,setImage}:Props) => {

  const quillRef = useRef(null);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', async () => {
    if (input.files && input.files[0]){
      const files = Array.from(input.files)

      try {
        const res = await AwsImageUploadFunctionality({ fileList: files });
        console.log(res?.imageUrls)
      }catch (error) {
        console.log(error);
      }
    } });
  };
  
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', { color: [] }, { background: [] }],
        ['image', 'link'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },}),[]
  )

    return (
      <>
        <ReactQuill
          style={{ height: height }}
          onChange={setText}
          value={text}
          modules={modules}
        />
      </>
    );
  }

  export default SubmitText;