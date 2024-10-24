//@ts-nocheck
import React, { useState } from 'react';
import { Upload, Image, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface ImageUploadSectionProps {
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const ImageUploadSection = ({ fileList, setFileList }: ImageUploadSectionProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Validate file type and size
    const validFileList = newFileList.map(file => {
      if (file.originFileObj) {
        const isImage = file.type?.startsWith('image/');
        const isLt2M = file.size ? file.size / 1024 / 1024 < 2 : true;

        if (!isImage) {
          message.error('You can only upload image files!');
          return null;
        }
        if (!isLt2M) {
          message.error('Image must be smaller than 2MB!');
          return null;
        }
      }
      return file;
    }).filter(Boolean);

    setFileList(validFileList);
  };

  const uploadButton = (
    <div className="text-center">
      <CameraOutlined className="text-2xl mb-2" />
      <div>Upload Images</div>
    </div>
  );

  const uploadProps: UploadProps = {
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188', // Replace with your upload endpoint
    listType: "picture-card",
    fileList: fileList,
    onPreview: handlePreview,
    onChange: handleChange,
    beforeUpload: (file) => {
      const isImage = file.type?.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }

      return false; // Return false to prevent auto upload
    },
    maxCount: 5,
  };

  return (
    <>
      <Upload multiple  maxCount={5} {...uploadProps}>
        {fileList.length >= 5 ? null : uploadButton}
      </Upload>
      
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};