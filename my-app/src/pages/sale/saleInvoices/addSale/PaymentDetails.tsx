//@ts-nocheck

import React, { useState } from 'react';
import { Form, Space, Upload, Button, InputNumber, Select, Switch, message } from 'antd';
import { FileImageOutlined, FileTextOutlined } from '@ant-design/icons';
import {
  FloatingLabelSelect,
  FloatingLabelTextArea,
} from '../../../../component/input';

const { Option } = Select;

const PaymentDetails = ({
  isCash,
  receivedAmount,
  setReceivedAmount,
  calculateTotal,
  calculateBalance,
  setImageFileList,
  imageFileList ,
  docFileList ,
  setDocFileList
}) => {


  const handleUpload = ({ file, onSuccess }, type) => {
    setTimeout(() => {
      onSuccess('ok');
      
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: URL.createObjectURL(file),
      };
      
      if (type === 'image') {
        setImageFileList(prev => [...prev, newFile]);
      } else {
        setDocFileList(prev => [...prev, newFile]);
      }
    }, 100);
  };

  const handleRemove = (file, type) => {
    if (type === 'image') {
      setImageFileList(prev => prev.filter(item => item.uid !== file.uid));
    } else {
      setDocFileList(prev => prev.filter(item => item.uid !== file.uid));
    }

    // Clean up the URL to prevent memory leaks
    if (file.url && file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url);
    }
  };

  const uploadProps = (type) => ({
    customRequest: (options) => handleUpload(options, type),
    listType: type === 'image' ? 'picture' : 'text',
    fileList: type === 'image' ? imageFileList : docFileList,
    onRemove: (file) => handleRemove(file, type),
    beforeUpload: (file) => {
      if (type === 'image' && !file.type.startsWith('image/')) {
        message.error('You can only upload image files!');
        return false;
      }
      return true;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="max-w-[300px]">
        <Form.Item label="Payment Type">
          <FloatingLabelSelect value="Cash">
            <Option value="Cash">Cash</Option>
            <Option value="Credit">Cheque</Option>
          </FloatingLabelSelect>
        </Form.Item>

        <Form.Item label="Description">
          <FloatingLabelTextArea rows={4} />
        </Form.Item>

        <Space direction="vertical" className="w-full">
          <Upload {...uploadProps('image')} className="w-full">
            <Button icon={<FileImageOutlined />} className="w-full">
              Add Image
            </Button>
          </Upload>
          
          <Upload {...uploadProps('document')} className="w-full">
            <Button icon={<FileTextOutlined />} className="w-full">
              Add Document
            </Button>
          </Upload>
        </Space>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Round Off</span>
          <Space>
            <Switch defaultChecked />
            <span>-0.3</span>
          </Space>
        </div>

        <div className="flex justify-between items-center">
          <span>Total</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>

        {!isCash && (
          <>
            <div className="flex justify-between items-center">
              <span>Received</span>
              <Space>
                <InputNumber
                  value={receivedAmount}
                  onChange={(value) => setReceivedAmount(value || 0)}
                  prefix="₹"
                  className="w-32"
                />
              </Space>
            </div>

            <div className="flex justify-between items-center font-bold">
              <span>Balance</span>
              <span>₹{calculateBalance().toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;