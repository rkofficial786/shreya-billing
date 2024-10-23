import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Space,
  Typography,
  Tabs,
  Input,
  Switch,
  InputNumber,
  DatePicker,
} from "antd";
import {
  SettingOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
  FloatingLabelTextArea,
} from "../../component/input";
import dayjs from "dayjs";

const { Title } = Typography;

const AddPartyModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [enableShipping, setEnableShipping] = useState(false);
  const [customLimit, setCustomLimit] = useState(false);
  const [additionalFields, setAdditionalFields] = useState([
    { key: "", value: "" },
  ]);

  const handleSubmit = async (saveAndNew = false) => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Convert additional fields array to object
      const additionalFieldsObject = additionalFields.reduce((acc, field) => {
        if (field.key && field.value) {
          // Only include fields that have both key and value
          acc[field.key] = field.value;
        }
        return acc;
      }, {});

      // Combine form values with additional fields
      const finalValues = {
        ...values,
        ...additionalFieldsObject,
      };

      await onSubmit(finalValues);

      if (!saveAndNew) {
        onClose();
      } else {
        form.resetFields();
        // Reset additional fields
        setAdditionalFields([{ key: "", value: "" }]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { key: "", value: "" }]);
  };

  const handleRemoveField = (index) => {
    const newFields = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(newFields);
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...additionalFields];
    newFields[index][field] = value;
    setAdditionalFields(newFields);
  };

  const gstTypes = [
    { value: "unregistered", label: "Unregistered/Consumer" },
    { value: "registered", label: "Registered Business" },
  ];

  const states = [
    { value: "delhi", label: "Delhi" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "karnataka", label: "Karnataka" },
  ];

  React.useEffect(() => {
    form.setFieldsValue({
      asOfDate: dayjs(), // Set default date to today
    });
  }, [form]);

  const tabItems = [
    {
      key: "gst",
      label: "GST & Address",
      children: (
        <div className="space-y-4">
          <Form.Item name="gstType">
            <FloatingLabelSelect label="GST Type" options={gstTypes} />
          </Form.Item>

          <Form.Item name="state">
            <FloatingLabelSelect label="State" options={states} />
          </Form.Item>

          <Form.Item name="emailId">
            <FloatingLabelInput label="Email ID" type="email" />
          </Form.Item>

          <Form.Item name="billingAddress">
            <FloatingLabelTextArea label="Billing Address" rows={4} />
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
              <FloatingLabelTextArea label="Shipping Address" rows={4} />
            </Form.Item>
          )}
        </div>
      ),
    },
    {
      key: "credit",
      label: (
        <div className="flex items-center gap-2">
          Credit & Balance
          
        </div>
      ),
      children: (
        <div className="space-y-6">
          <Form.Item name="openingBalance">
            <FloatingLabelInput
              label="Opening Balance"
              type="number"
              prefix="₹"
            />
          </Form.Item>

          <Form.Item name="asOfDate">
            <DatePicker
              className="w-full"
              placeholder="As Of Date"
              value={new Date()}
            />
          </Form.Item>

          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Credit Limit</label>
            <div className="flex items-center gap-4">
              <Switch checked={customLimit} onChange={setCustomLimit} />
              <span className="text-sm text-gray-600">
                {customLimit ? "Custom Limit" : "No Limit"}
              </span>
            </div>
            {customLimit && (
              <Form.Item name="creditLimit" className="mt-4">
                <InputNumber
                  className="w-full"
                  placeholder="Enter Credit Limit"
                  min={0}
                  prefix="₹"
                />
              </Form.Item>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "additional",
      label: "Additional Fields",
      children: (
        <div className="space-y-4">
          {additionalFields.map((field, index) => (
            <div key={index} className="flex gap-4">
              <Input
                placeholder="Field Name"
                value={field.key}
                onChange={(e) =>
                  handleFieldChange(index, "key", e.target.value)
                }
                className="w-1/2"
              />
              <Input
                placeholder="Value"
                value={field.value}
                onChange={(e) =>
                  handleFieldChange(index, "value", e.target.value)
                }
                className="w-1/2"
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveField(index)}
                className="text-red-500 hover:text-red-600"
              />
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddField}
            icon={<PlusOutlined />}
            className="w-full"
          >
            Add Field
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex justify-between items-center">
          <Title level={5} className="m-0">
            Add Party
          </Title>
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
      <Form form={form} layout="vertical" className="mt-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Form.Item
            name="partyName"
            rules={[{ required: true, message: "Party name is required" }]}
          >
            <FloatingLabelInput label="Party Name" required />
          </Form.Item>

          <Form.Item name="gstin">
            <FloatingLabelInput label="GSTIN" />
          </Form.Item>

          <Form.Item name="phoneNumber">
            <FloatingLabelInput label="Phone Number" type="tel" />
          </Form.Item>
        </div>

        <Tabs items={tabItems} className="ant-tabs-custom" />
      </Form>
    </Modal>
  );
};

export default AddPartyModal;
