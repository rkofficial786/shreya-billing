import React, { useState } from 'react';
import { 
  Modal, 
  Button, 
  Form, 
  Space,
  Typography,
  Tabs
} from 'antd';
import { 
  SettingOutlined, 
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { FloatingLabelInput, FloatingLabelSelect, FloatingLabelTextArea } from '../../component/input';


const { Title } = Typography;

const AddPartyModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [enableShipping, setEnableShipping] = useState(false);

  const handleSubmit = async (saveAndNew = false) => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onSubmit(values);
      
      if (!saveAndNew) {
        onClose();
      } else {
        form.resetFields();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const gstTypes = [
    { value: 'unregistered', label: 'Unregistered/Consumer' },
    { value: 'registered', label: 'Registered Business' }
  ];

  const states = [
    { value: 'delhi', label: 'Delhi' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' }
  ];

  const tabItems = [
    {
      key: 'gst',
      label: 'GST & Address',
      children: (
        <div className="space-y-4">
          <Form.Item name="gstType">
            <FloatingLabelSelect
              label="GST Type"
              options={gstTypes}
            />
          </Form.Item>

          <Form.Item name="state">
            <FloatingLabelSelect
              label="State"
              options={states}
            />
          </Form.Item>

          <Form.Item name="emailId">
            <FloatingLabelInput
              label="Email ID"
              type="email"
            />
          </Form.Item>

          <Form.Item name="billingAddress">
            <FloatingLabelTextArea
              label="Billing Address"
              rows={4}
            />
          </Form.Item>

          <Button 
            type="link" 
            icon={<PlusOutlined />}
            onClick={() => setEnableShipping(!enableShipping)}
            className="p-0 text-blue-500 hover:text-blue-600"
          >
            Enable Shipping Address
          </Button>

          {enableShipping && (
            <Form.Item name="shippingAddress">
              <FloatingLabelTextArea
                label="Shipping Address"
                rows={4}
              />
            </Form.Item>
          )}
        </div>
      ),
    },
    {
      key: 'credit',
      label: 'Credit & Balance',
      children: (
        <div className="text-center text-gray-400 py-8">
          Credit & Balance settings will appear here
        </div>
      ),
    },
    {
      key: 'additional',
      label: 'Additional Fields',
      children: (
        <div className="text-center text-gray-400 py-8">
          Additional fields will appear here
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <Title level={5} className="m-0">Add Party</Title>
          <Space>
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              className="flex items-center justify-center mr-6"
            />
           
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button 
          key="save-and-new" 
          onClick={() => handleSubmit(true)}
          loading={loading}
        >
          Save & New
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          onClick={() => handleSubmit(false)}
          loading={loading}
        >
          Save
        </Button>,
      ]}
      width={800}
      className="top-10"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Form.Item 
            name="partyName" 
            rules={[{ required: true, message: 'Party name is required' }]}
          >
            <FloatingLabelInput
              label="Party Name"
              required
            />
          </Form.Item>

          <Form.Item name="gstin">
            <FloatingLabelInput
              label="GSTIN"
            />
          </Form.Item>

          <Form.Item name="phoneNumber">
            <FloatingLabelInput
              label="Phone Number"
              type="tel"
            />
          </Form.Item>
        </div>

        <Tabs 
          items={tabItems}
          className="ant-tabs-custom"
        />
      </Form>
    </Modal>
  );
};

export default AddPartyModal;