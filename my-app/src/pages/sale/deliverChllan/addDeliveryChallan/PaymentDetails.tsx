//@ts-nocheck

import React, { useState } from "react";
import {
  Form,
  Space,
  Upload,
  Button,
  InputNumber,
  Select,
  Switch,
  message,
} from "antd";
import {
  FileImageOutlined,
  FileTextOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  FloatingLabelSelect,
  FloatingLabelTextArea,
} from "../../../../component/input";

const { Option } = Select;

const PaymentDetails = ({
  isCash,
  receivedAmount,
  setReceivedAmount,
  calculateTotal,
  calculateBalance,
  setImageFileList,
  imageFileList,
  docFileList,
  setDocFileList,
  setPayments,
  payments,
  totalReceivedAmount,
  form,
}) => {
  const [showDescription, setShowDescription] = useState(false);

  const handleDescriptionChange = (e) => {
    // Get the value from the event target
    const value = e?.target?.value || e;

    // Set the description value in the form
    form.setFieldsValue({
      description: value,
    });
  };

  const handleRemoveDescription = () => {
    // Clear the description field and hide the textarea
    form.setFieldsValue({
      description: '',
    });
    setShowDescription(false);
  };

  // Initialize with a single payment if none exists
  React.useEffect(() => {
    if (payments.length === 0) {
      setPayments([{ id: Date.now(), type: "Cash", amount: 0 }]);
    }
  }, []);

  // Update parent component's receivedAmount whenever payments change
  React.useEffect(() => {
    setReceivedAmount(totalReceivedAmount);
  }, [totalReceivedAmount, setReceivedAmount]);

  const handleAddPayment = () => {
    setPayments([...payments, { id: Date.now(), type: "Cash", amount: 0 }]);
  };

  const handleRemovePayment = (id) => {
    // Only allow removal if there's more than one payment
    if (payments.length > 1) {
      setPayments(payments.filter((payment) => payment.id !== id));
    }
  };

  const handlePaymentChange = (id, field, value) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, [field]: value } : payment
      )
    );
  };

  const handleUpload = ({ file, onSuccess }, type) => {
    setTimeout(() => {
      onSuccess("ok");

      const newFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        url: URL.createObjectURL(file),
      };

      if (type === "image") {
        setImageFileList((prev) => [...prev, newFile]);
      } else {
        setDocFileList((prev) => [...prev, newFile]);
      }
    }, 100);
  };

  const handleRemove = (file, type) => {
    if (type === "image") {
      setImageFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    } else {
      setDocFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    }

    if (file.url && file.url.startsWith("blob:")) {
      URL.revokeObjectURL(file.url);
    }
  };

  const uploadProps = (type) => ({
    customRequest: (options) => handleUpload(options, type),
    listType: type === "image" ? "picture" : "text",
    fileList: type === "image" ? imageFileList : docFileList,
    onRemove: (file) => handleRemove(file, type),
    beforeUpload: (file) => {
      if (type === "image" && !file.type.startsWith("image/")) {
        message.error("You can only upload image files!");
        return false;
      }
      return true;
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        {/* Payment entries */}

        <br />
        {/* Description section */}
        {showDescription ? (
          <Form.Item name="description" label="Description">
            <FloatingLabelTextArea
              onChange={handleDescriptionChange}
              rows={4}
            />
            <Button
              type="text"
              danger
              onClick={handleRemoveDescription}
              icon={<DeleteOutlined />}
              className="mt-2"
            >
              Remove Description
            </Button>
          </Form.Item>
        ) : (
          <Button
            type="dashed"
            onClick={() => setShowDescription(true)}
            className="w-[35%]"
            icon={<PlusOutlined />}
          >
            Add Description
          </Button>
        )}

        <br />
        {/* File upload buttons */}
        <Space direction="vertical" className="w-[35%]">
          <Upload multiple {...uploadProps("image")} className="w-full">
            <Button icon={<FileImageOutlined />} className="w-full">
              Add Image
            </Button>
          </Upload>
        </Space>
      </div>

      <div className="space-y-4">
        {/* <div className="flex justify-between items-center">
          <span>Round Off</span>
          <Space>
            <Switch defaultChecked />
            <span>-0.3</span>
          </Space>
        </div> */}

        <div className="flex justify-end items-center gap-20 text-primary-500">
          <span className="text-xl">Total</span>
          <span>₹{calculateTotal()}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
