import { useState } from "react"
import styled from "styled-components"
import xIcon from '../../../assets/img/icons8-엑스-30.png';
import {
    ImageLocalPreviewUrls,
    ImageLocalPreviewUrlsReturnType,
  } from '../../../_common/imageUploadFuntionality';

interface UploadImageAndVideoProps {
    readonly previewUrls: string[];
    readonly setPreviewUrls: (item:any) => void;
    readonly fileList: File[];
    readonly setFileList: (item:any) => void;
}

const UploadImageAndVideo = ({previewUrls,setPreviewUrls,fileList, setFileList}: UploadImageAndVideoProps) => {
    
    const deleteImagePreview = async (deleteImage: string) => {
        const temp = previewUrls.filter((url) => url !== deleteImage)
        setPreviewUrls(temp);
      };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
      ): Promise<void> => {
        const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
          event,
        });
        if (!urls) return;
        setPreviewUrls(urls.previewUrls);
        setFileList(urls.fileList);
      };

    return(
        <>
              {previewUrls.length > 0 ? (
                <>
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
              ) : (
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
                  style={{display: 'none'}}
                  multiple
                  onChange={handleFileChange}
                  />
                </CustomLabel>
                </CustomInput>
                </>
              )}
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