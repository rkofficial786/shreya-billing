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
  existingImage,
  setExistingImage,
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
      description: undefined,
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
        originFileObj: file,
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
    const matchingFile = existingImage.filter((item) => item != file.url);
    setExistingImage(matchingFile);

    // const matchingDocs = existingDocs.filter((item) => item != file.url);
    // setExistingDocs(matchingDocs);

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
            {/* Only show payment type selector for the first payment */}

            <FloatingLabelSelect
              value={payment.type}
              onChange={(value) =>
                handlePaymentChange(payment.id, "type", value)
              }
              className="w-2/12"
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
            />

            {/* Only show delete button for additional payments */}
            {index > 0 && (
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleRemovePayment(payment.id)}
                danger
              />
            )}
          </div>
        ))}

        <Button
          type="dashed"
          onClick={handleAddPayment}
          className="w-[35%]"
          icon={<PlusOutlined />}
        >
          Add Payment
        </Button>
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
          {/* @ts-ignore */}
          <Upload {...uploadProps("image")} className="w-full">
            <Button icon={<FileImageOutlined />} className="w-full">
              Add Image
            </Button>
          </Upload>
          {/* @ts-ignore */}
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
            <Switch defaultChecked />
            <span>-0.3</span>
          </Space>
        </div>

        <div className="flex justify-between items-center">
          <span>Total</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Received</span>
          <span>₹{totalReceivedAmount}</span>
        </div>

        <div className="flex justify-between items-center font-bold">
          <span>Balance</span>
          <span>₹{(calculateTotal() - totalReceivedAmount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
