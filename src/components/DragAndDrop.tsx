import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { AwsImageUploadFunctionality, AwsImageUploadFunctionalityReturnType } from '../_common/imageUploadFuntionality';

const { Dragger } = Upload;

interface DragAndDropProps {
    onFileChange: (result: AwsImageUploadFunctionalityReturnType | string) => void;
  }

const DragAndDrop: React.FC<DragAndDropProps> = ({ onFileChange }) => {
    const props: UploadProps = {
      name: 'file',
      multiple: false,
      onChange: async (e) => {
        const temp: File = e.file.originFileObj as File
        const res = await AwsImageUploadFunctionality({ fileList: [temp] });
        if(!res?.imageUrls[0]) return 
        onFileChange(res?.imageUrls[0])
      },
      async onDrop(e) {
        const res = await AwsImageUploadFunctionality({fileList: Array.from(e.dataTransfer.files)})
        if(!res?.imageUrls[0]) return 
        onFileChange(res?.imageUrls[0])
      },
    };
  
    return (
      <Dragger {...props}>
        <p className="ant-upload-drag-icon" style={{ marginTop: '12vh' }}>
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">사진을 선택하거나 화면에 드래그 해주세요</p>
      </Dragger>
    );
  };
  
  export default DragAndDrop;