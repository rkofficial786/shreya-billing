//@ts-nocheck
import React, { useState, useEffect } from "react";
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
import FileUpload from "../../component/upload";

const { Title } = Typography;

const AddPartyModal = ({ visible, onClose, onSubmit, initialValues, form }) => {
  const [loading, setLoading] = useState(false);
  const [enableShipping, setEnableShipping] = useState(false);
  const [customLimit, setCustomLimit] = useState(false);
  const [additionalFields, setAdditionalFields] = useState([
    { key: "", value: "" },
  ]);
  const [attachmentFields, setAttachmentFields] = useState([
    { key: "", file: null },
  ]);

  useEffect(() => {
    if (initialValues) {
      const formValues = {
        partyName: initialValues.name,
        gstin: initialValues.gstin,
        phoneNumber: initialValues.phone,
        gstType: initialValues.gstAndAddress.gstType,
        state: initialValues.gstAndAddress.state,
        emailId: initialValues.gstAndAddress.email,
        billingAddress: initialValues.gstAndAddress.billingAddress,
        openingBalance: initialValues.creditAndBlance.openingBalance,
        asOfDate: dayjs(initialValues.creditAndBlance.date),
        creditLimit: initialValues.creditAndBlance.limit,
      };

      if (initialValues.gstAndAddress.shipping?.length > 0) {
        setEnableShipping(true);
        formValues.shippingAddress = initialValues.gstAndAddress.shipping[0];
      }

      if (initialValues.creditAndBlance.limit !== null) {
        setCustomLimit(true);
      }

      // Handle additional fields
      if (initialValues.additionalFields?.length > 0) {
        const transformedFields = initialValues.additionalFields
          .filter((field) => field.key && field.value)
          .map((field) => ({
            key: field.key,
            value: field.value,
          }));
        setAdditionalFields(
          transformedFields.length > 0 ? transformedFields : [{ key: "", value: "" }]
        );
      }

      // Handle attachment fields
      if (initialValues.attachments?.length > 0) {
        const transformedAttachments = initialValues.attachments
          .filter((attachment) => attachment.key)
          .map((attachment) => ({
            key: attachment.key,
            file: attachment.file,
          }));
        setAttachmentFields(
          transformedAttachments.length > 0 ? transformedAttachments : [{ key: "", file: null }]
        );
      }

      form.setFieldsValue(formValues);
    } else {
      form.setFieldsValue({
        asOfDate: dayjs(),
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (saveAndNew = false) => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Process additional fields
      const additionalFieldsData = {};
      additionalFields.forEach((field) => {
        if (field.key && field.value) {
          additionalFieldsData[field.key] = field.value;
        }
      });

      console.log(attachmentFields);
      
      // Process attachments
      const attachmentsData = attachmentFields
        .filter((field) => field.key && field.file)
        .map((field) => ({
          key: field.key,
          file: field.file,
        }));

      const finalValues = {
        name: values.partyName,
        gstin: values.gstin,
        phone: values.phoneNumber,
        gstAndAddress: {
          gstType: values.gstType,
          state: values.state,
          email: values.emailId,
          billingAddress: values.billingAddress,
          shipping: enableShipping ? [values.shippingAddress] : [],
        },
        creditAndBlance: {
          openingBalance: values.openingBalance,
          date: values?.asOfDate?.toISOString() || null,
          limit: customLimit ? values.creditLimit : undefined,
        },
        additionalFields: additionalFieldsData,
        attachments: attachmentsData,
        ...(initialValues?._id ? { _id: initialValues._id } : {}),
      };

      await onSubmit(finalValues);

      if (!saveAndNew) {
        onClose();
      } else {
        form.resetFields();
        setAdditionalFields([{ key: "", value: "" }]);
        setAttachmentFields([{ key: "", file: null }]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  // Additional fields handlers
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

  // Attachment fields handlers
  const handleAddAttachment = () => {
    setAttachmentFields([...attachmentFields, { key: "", file: null }]);
  };

  const handleRemoveAttachment = (index) => {
    const newFields = attachmentFields.filter((_, i) => i !== index);
    setAttachmentFields(newFields);
  };

  const handleAttachmentChange = (index, field, value) => {
    const newFields = [...attachmentFields];
    newFields[index][field] = value;
    setAttachmentFields(newFields);
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
            className="p-0 text-neutral-500 hover:text-neutral-600"
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
      label: "Credit & Balance",
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
            <DatePicker className="w-full" placeholder="As Of Date" />
          </Form.Item>

          <div className="space-y-2">
            <label className="block text-sm text-neutral-600">Credit Limit</label>
            <div className="flex items-center gap-4">
              <Switch checked={customLimit} onChange={setCustomLimit} />
              <span className="text-sm text-neutral-600">
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
                onChange={(e) => handleFieldChange(index, "key", e.target.value)}
                className="w-1/2"
              />
              <Input
                placeholder="Value"
                value={field.value}
                onChange={(e) => handleFieldChange(index, "value", e.target.value)}
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
    {
      key: "attachment",
      label: "Attachment Fields",
      children: (
        <div className="space-y-4">
          {attachmentFields.map((field, index) => (
            <div key={index} className="flex gap-4">
              <Input
                placeholder="Attachment Name"
                value={field.key}
                onChange={(e) => handleAttachmentChange(index, "key", e.target.value)}
                className="w-1/2"
              />
              <div className="w-1/2">
                <FileUpload
                  onFileChange={(file) => handleAttachmentChange(index, "file", file)}
                  attachment={field.file}
                  name={`attachment-${index}`}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              </div>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveAttachment(index)}
                className="text-red-500 hover:text-red-600"
              />
            </div>
          ))}
          <Button
            type="dashed"
            onClick={handleAddAttachment}
            icon={<PlusOutlined />}
            className="w-full"
          >
            Add Attachment
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
            {initialValues ? "Edit Party" : "Add Party"}
          </Title>
          <Space />
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
          className="bg-primary-500 hover:bg-primary-600"
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