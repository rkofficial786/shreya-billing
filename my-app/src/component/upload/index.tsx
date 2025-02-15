import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

interface FileUploadProps {
  onFileChange: (file: any) => void;
  attachment?: any;
  name: string;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  attachment,
  name,
  accept
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(
    attachment ? [attachment] : []
  );

  const handleUpload = async (file: RcFile) => {
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result;
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          base64: base64Data,
          lastModified: file.lastModified,
        };

        console.log(fileData,"file data");
        
        onFileChange(fileData);
      };
      reader.readAsDataURL(file);
      return false; // Prevent default upload
    } catch (error) {
      message.error('File processing failed');
      return false;
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Update the file list for UI
    setFileList(newFileList);
    
    // If file is removed
    if (newFileList.length === 0) {
      onFileChange(null);
    }
  };

  const uploadProps: UploadProps = {
    name,
    fileList,
    beforeUpload: handleUpload,
    onChange: handleChange,
    maxCount: 1,
    accept,
    onRemove: () => {
      setFileList([]);
      onFileChange(null);
    },
    customRequest: ({ onSuccess }) => {
      // Mock successful upload
      setTimeout(() => {
        onSuccess?.("ok");
      }, 0);
    }
  };

  return (
    <Upload {...uploadProps} className="w-full">
      <Button icon={<UploadOutlined />} className="w-full">
        Upload File
      </Button>
    </Upload>
  );
};

export default FileUpload;