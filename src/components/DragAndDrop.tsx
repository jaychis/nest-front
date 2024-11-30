import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { Upload } from 'antd';
import {
  AwsImageUploadFunctionality,
  AwsImageUploadFunctionalityReturnType,
} from '../_common/imageUploadFuntionality';

const { Dragger } = Upload;

interface DragAndDropProps {
  onFileChange: (
    result: AwsImageUploadFunctionalityReturnType | string | null,
  ) => void;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onFileChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    multiple: false,
    fileList: fileList,
    showUploadList: {
      showRemoveIcon: true,
    },
    onRemove: (file) => {
      setFileList((prevList) => prevList.filter((f) => f.uid !== file.uid));
      onFileChange(null);
      return true;
    },
    onChange: async (e) => {
      const temp: File = e.file.originFileObj as File;

      if (e.file.status === 'removed') {
        return;
      }

      const res = await AwsImageUploadFunctionality({ fileList: [temp] });
      if (!res?.imageUrls[0]) return;
      onFileChange(res?.imageUrls[0]);

      setFileList(
        e.fileList.map((file) => ({
          ...file,
          status: 'done',
        })),
      );
    },
    async onDrop(e) {
      const res = await AwsImageUploadFunctionality({
        fileList: Array.from(e.dataTransfer.files),
      });
      if (!res?.imageUrls[0]) return;
      onFileChange(res?.imageUrls[0]);
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon" style={{ marginTop: '12vh' }}>
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        사진을 선택하거나 화면에 드래그 해주세요
      </p>
    </Dragger>
  );
};

export default DragAndDrop;
