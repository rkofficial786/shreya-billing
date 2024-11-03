//@ts-nocheck

import React, { useState, useEffect } from "react";
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
    const value = e?.target?.value || e;
    form.setFieldsValue({
      description: value,
    });
  };

  const handleRemoveDescription = () => {
    form.setFieldsValue({
      description: undefined,
    });
    setShowDescription(false);
  };

  // Initialize with a single payment if none exists
  useEffect(() => {
    if (payments.length === 0) {
      setPayments([{ id: Date.now(), type: "Cash", amount: 0 }]);
    }
  }, []);

  // Handle isCash changes
  useEffect(() => {
    if (isCash) {
      // If isCash is true, set a single payment equal to the total amount
      const totalAmount = calculateTotal();
      setPayments([{ id: Date.now(), type: "Cash", amount: totalAmount }]);
      setReceivedAmount(totalAmount);
    }
  }, [isCash, calculateTotal]);

  // Update parent component's receivedAmount whenever payments change
  useEffect(() => {
    if (!isCash) {
      setReceivedAmount(totalReceivedAmount);
    }
  }, [totalReceivedAmount, setReceivedAmount, isCash]);

  const handleAddPayment = () => {
    if (!isCash) {
      setPayments([...payments, { id: Date.now(), type: "Cash", amount: 0 }]);
    }
  };

  const handleRemovePayment = (id) => {
    if (!isCash && payments.length > 1) {
      setPayments(payments.filter((payment) => payment.id !== id));
    }
  };

  const handlePaymentChange = (id, field, value) => {
    if (!isCash) {
      setPayments(
        payments.map((payment) =>
          payment.id === id ? { ...payment, [field]: value } : payment
        )
      );
    }
  };

  const handleUpload = ({ file, onSuccess }, type) => {
    setTimeout(() => {
      onSuccess("ok");

      const newFile = {
        uid: file.uid,
        name: file.name,
        status: "done",
        originFileObj: file, // Keep the original file object
        url: URL.createObjectURL(file), // For preview only
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
        {payments.map((payment, index) => (
          <div key={payment.id} className="flex items-center w-full gap-2">
            <FloatingLabelSelect
              value={payment.type}
              onChange={(value) =>
                handlePaymentChange(payment.id, "type", value)
              }
              className="w-2/12"
              disabled={isCash}
            >
              <Option value="Cash">Cash</Option>
              <Option value="Cheque">Cheque</Option>
            </FloatingLabelSelect>

            <InputNumber
              value={payment.amount}
              onChange={(value) =>
                handlePaymentChange(payment.id, "amount", value || 0)
              }
              prefix="₹"
              className="w-2/12 py-2"
              min={0}
              disabled={isCash}
            />

            {/* Only show delete button for additional payments when not cash */}
            {index > 0 && !isCash && (
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleRemovePayment(payment.id)}
                danger
              />
            )}
          </div>
        ))}

        {/* Only show Add Payment button when not cash */}
        {!isCash && (
          <Button
            type="dashed"
            onClick={handleAddPayment}
            className="w-[35%]"
            icon={<PlusOutlined />}
          >
            Add Payment
          </Button>
        )}
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
        <hr />

        {/* File upload buttons */}
        <Space direction="vertical" className="w-full">
          <Upload {...uploadProps("image")} className="w-full">
            <Button icon={<FileImageOutlined />} className="w-full">
              Add Image
            </Button>
          </Upload>

          <Upload {...uploadProps("document")} className="w-full">
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
            <Switch defaultChecked disabled={isCash} />
            <span>-0.3</span>
          </Space>
        </div>

        <div className="flex justify-between items-center">
          <span>Total</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Received</span>
          <span>₹{totalReceivedAmount.toFixed(2)}</span>
        </div>

        {!isCash && (
          <div className="flex justify-between items-center font-bold">
            <span>Balance</span>
            <span>₹{(calculateTotal() - totalReceivedAmount).toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
