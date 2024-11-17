import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { message, Upload } from 'antd';
import { AwsImageUploadFunctionality, AwsImageUploadFunctionalityReturnType } from '../_common/imageUploadFuntionality';

const { Dragger } = Upload;

interface DragAndDropProps {
  onFileChange: (result: AwsImageUploadFunctionalityReturnType | string | null) => void;
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
      setFileList((prevList) => prevList.filter((f) => f.uid !== file.uid)); // fileList에서 파일 제거
      onFileChange(null); // 부모 컴포넌트 상태 업데이트
      console.log('File removed');
      return true;
    },
    onChange: async (e) => {
      const temp: File = e.file.originFileObj as File;
      
      if (e.file.status === 'removed') {
        // 파일이 삭제될 경우, 업로드 함수 실행 방지
        return;
      }

      const res = await AwsImageUploadFunctionality({ fileList: [temp] });
      if (!res?.imageUrls[0]) return;
      onFileChange(res?.imageUrls[0]); // 성공적으로 업로드된 파일 URL 전달

      // fileList 상태 업데이트와 상태 변경
      setFileList(
        e.fileList.map((file) => ({
          ...file,
          status: 'done', // 파일 상태를 'done'으로 설정하여 로딩 아이콘 제거
        }))
      );
    },
    async onDrop(e) {
      const res = await AwsImageUploadFunctionality({ fileList: Array.from(e.dataTransfer.files) });
      if (!res?.imageUrls[0]) return;
      onFileChange(res?.imageUrls[0]);
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