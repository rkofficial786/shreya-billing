import React, { useState } from "react";
import { Modal, Button, Radio, Space, Alert, Typography } from "antd";
import {
  FileTextOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  RollbackOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ConversionDialog = ({ visible, onCancel, onConvert, quotationData }) => {
  const [conversionType, setConversionType] = useState(null);
  // ["Quotation", "Sale Order", "Sale Invoice", "Delivery Chalan", "Payment Invoice", "Sale Return"];
  const conversionOptions = [
    {
      value: "Sale Invoice",
      label: "Sale Invoice",
      icon: <FileTextOutlined className="text-primary-600" />,
      description: "Convert to a sales invoice for immediate billing",
    },
    {
      value: "Sale Order",
      label: "Sale Order",
      icon: <ShoppingCartOutlined className="text-secondary-600" />,
      description: "Create a sales order for future processing",
    },
    {
      value: "Delivery Chalan",
      label: "Delivery Challan",
      icon: <CarOutlined className="text-accent-600" />,
      description: "Generate a delivery challan for goods dispatch",
    },
    {
      value: "Sale Return",
      label: "Sale Return",
      icon: <RollbackOutlined className="text-neutral-600" />,
      description: "Process a sales return for the items",
    },
    {
      value: "Payment Invoice",
      label: "Payment Invoice",
      icon: <MoneyCollectOutlined className="text-green-600" />,
      description: "Process a sales return for the items",
    },
  ];

  const handleTypeSelect = (value) => {
    setConversionType(value);
  };

  const handleConvert = () => {
    onConvert(conversionType);
    onCancel();
  };

  return (
    <Modal
      title="Convert Quotation"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="convert"
          type="primary"
          disabled={!conversionType}
          onClick={handleConvert}
        >
          Convert
        </Button>,
      ]}
      width={600}
    >
      <div className="py-4">
        <Alert
          message="Select Conversion Type"
          description="Choose how you want to convert this quotation."
          type="info"
          showIcon
          className="mb-6"
        />

        <Radio.Group
          onChange={(e) => handleTypeSelect(e.target.value)}
          value={conversionType}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            {conversionOptions.map((option) => (
              <Radio.Button
                key={option.value}
                value={option.value}
                className="w-full p-4 flex items-center hover:bg-gray-50 border rounded-lg mb-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{option.icon}</span>
                  <div>
                    <Text strong>{option.label}</Text>
                  </div>
                </div>
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default ConversionDialog;
