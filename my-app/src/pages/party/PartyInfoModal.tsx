import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
  FloatingLabelTextArea,
} from "../../component/input";

const PartyInfoModal = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  title,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const getFormFields = () => {
    switch (type) {
      case "phone":
        return (
          <>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter phone number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter valid 10-digit phone number",
                },
              ]}
            >
              <FloatingLabelInput label="Enter 10-digit phone number" />
            </Form.Item>
            <Form.Item name="phoneType" label="Type" initialValue="primary">
              <FloatingLabelSelect>
                <Select.Option value="primary">Primary</Select.Option>
                <Select.Option value="secondary">Secondary</Select.Option>
                <Select.Option value="work">Work</Select.Option>
              </FloatingLabelSelect>
            </Form.Item>
          </>
        );

      case "email":
        return (
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter email address" },
              { type: "email", message: "Please enter valid email address" },
            ]}
          >
            <FloatingLabelInput label="Enter email address" />
          </Form.Item>
        );

      case "credit":
        return (
          <>
            <Form.Item
              name="creditLimit"
              label="Credit Limit"
              rules={[{ required: true, message: "Please enter credit limit" }]}
            >
              <InputNumber
                className="w-full"
                formatter={(value) =>
                  `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                placeholder="Enter credit limit"
              />
            </Form.Item>
            <Form.Item name="creditTerms" label="Credit Terms">
              <FloatingLabelTextArea
                placeholder="Enter credit terms and conditions"
                rows={4}
              />
            </Form.Item>
          </>
        );

      case "gstin":
        return (
          <Form.Item
            name="gstin"
            label="GSTIN"
            rules={[
              { required: true, message: "Please enter GSTIN" },
              {
                pattern:
                  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                message: "Please enter valid GSTIN",
              },
            ]}
          >
            <Input placeholder="Enter GSTIN number" />
          </Form.Item>
        );

      case "address":
        return (
          <>
            <Form.Item
              name="addressLine1"
              label="Address Line 1"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input placeholder="Enter street address" />
            </Form.Item>
            <Form.Item name="addressLine2" label="Address Line 2">
              <Input placeholder="Enter apartment, suite, etc." />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please enter state" }]}
            >
              <Input placeholder="Enter state" />
            </Form.Item>
            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[
                { required: true, message: "Please enter pincode" },
                {
                  pattern: /^[1-9][0-9]{5}$/,
                  message: "Please enter valid 6-digit pincode",
                },
              ]}
            >
              <Input placeholder="Enter pincode" />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={title || `Add ${type?.charAt(0)?.toUpperCase() + type?.slice(1)}`}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="mt-4">
        {getFormFields()}
      </Form>
    </Modal>
  );
};

export default PartyInfoModal;
