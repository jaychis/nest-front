import { useState,useEffect } from "react"
import styled from "styled-components"
import xIcon from '../../../assets/img/icons8-엑스-30.png';
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

    const [fileList, setFileList] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(content)
    
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
        setPreviewUrls([...previewUrls, ...urls.previewUrls]);
        setFileList(urls.fileList);
      };

    useEffect(() => {
        
        const uploadAws = async () => {
            const res:AwsImageUploadFunctionalityReturnType = await AwsImageUploadFunctionality({fileList})
            if(!res) return
            setContent([...content, ...res.imageUrls])
        }
        uploadAws()
    },[fileList])

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
                <ImagePreviewWrapper key={index}>
                <CloseButton src={xIcon} onClick={() => {deleteImagePreview(image)}}/>
                    <ImagePreview
                    src={image}
                    alt={`Preview image ${index}`}
                    />
                </ImagePreviewWrapper>
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
  max-height: 100%;
  max-width: 100%;
  object-fit: cover;
  z-index: 1;
`;

const CloseButton = styled.img`
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