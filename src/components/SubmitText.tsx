import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

interface Props {
  readonly eventHandler: (item: string) => any;
  readonly text: string;
  readonly height: string;
}

function SubmitText({eventHandler,text,height}:Props) {

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike','blockquote', 'code-block',{ 'color': [] },{ 'background': [] }],
        ["image",'link'],
      ],
    }}

    return (
      <>
        <ReactQuill
        style={{ height: height }}
        placeholder="내용을 입력해 주세요"
        onChange={eventHandler}
        value={text}
        modules={modules}
        />
      </>
    );
  }
  export default SubmitText;