import { useState,useEffect } from "react"
import styled from "styled-components"
import { xIcon } from "../../../assets/img/ImgUrl";
import {
    ImageLocalPreviewUrls,
    ImageLocalPreviewUrlsReturnType,
    AwsImageUploadFunctionality,
    AwsImageUploadFunctionalityReturnType
  } from '../../../_common/imageUploadFuntionality';

interface UploadImageAndVideoProps {
    readonly content: string[];
    readonly setContent: (item: string[] | ((prev: string[]) => string[])) => void;
}

const UploadImageAndVideo = ({content, setContent}: UploadImageAndVideoProps) => {

    const mediaExtensions = {
        image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif', 'heif', 'heic', 'avif'],
        video: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
      };

    const [fileList, setFileList] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(content)
    const [isImage, setIsImage] = useState<boolean>(false)
    const [isVideo, setIsVideo] =useState<boolean>(false)

    const isMediaType = (url:string[], type: 'image' | 'video') => {
        const temp = url.pop()?.toLowerCase()
        return temp ? mediaExtensions[type].includes(temp) : false
    }
    
    const deleteImagePreview = async (deleteImage: string) => {
        const temp = previewUrls.filter((url) => url !== deleteImage)
        setPreviewUrls(temp);
        setContent(temp)
      };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
      ): Promise<void> => {
        const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
          event,
        });
        if (!urls) return;

        if(!isImage) {
            const img = urls.fileList.some((url) => isMediaType(url.name.split('.'),'image'))
            setIsImage(img)
        }
        if(!isVideo) {
            const video = urls.fileList.some((url) => isMediaType(url.name.split('.'),'video'))
            setIsVideo(video)
        }
        
        setPreviewUrls([...previewUrls, ...urls.previewUrls]);
        setFileList(urls.fileList);
      };

    useEffect(() => {
        if (isVideo && isImage) {
            setPreviewUrls([]);
            setContent([]);
            setFileList([])
            setIsVideo(false);
            setIsImage(false)
            return alert('이미지와 동영상을 동시에 업로드할 수 없습니다.');
        }

        const uploadAws = async () => {
            const res:AwsImageUploadFunctionalityReturnType = await AwsImageUploadFunctionality({fileList})
            if(!res) return
            setContent([...content, ...res.imageUrls])
        }

        uploadAws()
    },[fileList])

    useEffect(() => {
        // 수정하기에서 기존 content에 이미 들어가 있는 내용 체크하기 위함
        const img = content.some((url) => isMediaType(url.split('.'),'image'))
        setIsImage(img)

        const video = content.some((url) => isMediaType(url.split('.'),'video'))
        setIsVideo(video)
    },[])
   
    return(
        <>
        <CustomInput>
            <CustomLabel 
                htmlFor="file"
                style={{borderRadius:'14px'}}  
            >
                이미지 업로드
                <InputStyle
                type="file"
                id="file"
                accept="image/*,video/*"
                style={{display: 'none'}}
                multiple
                onChange={handleFileChange}
                />
            </CustomLabel>
            </CustomInput>
            
                {previewUrls.map((image, index) => (
                <>
                {isImage && (
                <ImagePreviewWrapper key={index}>
                    <DeleteIcon src={xIcon} onClick={() => {deleteImagePreview(image)}}/>
                        <ImagePreview
                        src={image}
                        alt={`Preview image ${index}`}
                        />
                </ImagePreviewWrapper>)}

                {isVideo && (<Video controls preload="metadata"> <source src={image} /></Video>)}  
                </>
                ))}
        </>
    )
}

export default UploadImageAndVideo

const ImagePreviewWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px; 
  height: 300px; 
  border: 1px solid #ddd; 
  border-radius: 8px;
  background-color: #f9f9f9; 
  padding: 10px;
  position: relative;
  z-index: 0;
`;

const ImagePreview = styled.img`
  max-height: 90%;
  max-width: 90%;
  object-fit: cover;
  z-index: 1;
`;

const DeleteIcon = styled.img`
  top: 2%;
  left: 1%;
  position: absolute;
  width: 15px;
  height: 15px;
  border: 1px solid black;
  border-radius: 50%;
  cursor: pointer;
`;

const CustomInput = styled.div`
  display: flex;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 16px;
`

const CustomLabel = styled.label`
  padding: 8px;
  background-color: #84d7fb;
  color: white;
  border: none;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
`

const InputStyle = styled.input`
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Video = styled.video`
  max-width: 700px;
  max-height: 400px;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: block;
  object-fit: contain;
`