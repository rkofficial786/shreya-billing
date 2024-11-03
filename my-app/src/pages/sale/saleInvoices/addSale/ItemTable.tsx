import React from "react";
import { Table, Button, InputNumber, Radio, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
} from "../../../../component/input";

const { Option } = Select;

export const ItemsTable = ({
  items,
  handleItemChange,
  handleDeleteRow,
  calculateTaxAmount,
  calculateFinalAmount,
}) => {


  
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "ITEM",
      dataIndex: "item",

      render: (_, record) => (
        <FloatingLabelInput
          label="Enter item name"
          className="min-w-[200px] relative top-2"
          value={record.item}
          onChange={(e) => handleItemChange(record.key, "item", e.target.value)}
        />
      ),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      width: 100,
      render: (_, record) => (
        <InputNumber
          min={1}
          className="py-2"
          value={record.quantity}
          onChange={(value) => handleItemChange(record.key, "quantity", value)}
        />
      ),
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      width: 120,
      render: (_, record) => (
        <FloatingLabelSelect
          value={record.unit}
          onChange={(value) => handleItemChange(record.key, "unit", value)}
        >
          <Option value="Bag">Bag</Option>
          <Option value="Btl">Btl</Option>
          <Option value="NONE">NONE</Option>
        </FloatingLabelSelect>
      ),
    },
    {
      title: "PRICE/UNIT",
      dataIndex: "price",
      width: 200,
      render: (_, record) => (
        <div className="flex items-start gap-2">
          <InputNumber
            className="w-32 py-2"
            value={record.price}
            onChange={(value) => handleItemChange(record.key, "price", value)}
          />
          <Radio.Group
            value={record.priceType}
            onChange={(e) =>
              handleItemChange(record.key, "priceType", e.target.value)
            }
            size="small"
            className="flex flex-col gap-1"
          >
            <Radio value="withTax" className="text-xs">
              With Tax
            </Radio>
            <Radio value="withoutTax" className="text-xs">
              Without Tax
            </Radio>
          </Radio.Group>
        </div>
      ),
    },
    {
      title: "TAX",
      dataIndex: "tax",
      width: 200,
      render: (_, record) => (
        <div className="space-y-2">
          <FloatingLabelSelect
            className="w-full"
            value={record.tax}
            onChange={(value) => handleItemChange(record.key, "tax", value)}
          >
            <Option value="NONE">NONE</Option>
            <Option value="IGST@0.25%">IGST@0.25%</Option>
            <Option value="IGST@5%">IGST@5%</Option>
            <Option value="IGST@12%">IGST@12%</Option>
            <Option value="IGST@18%">IGST@18%</Option>
          </FloatingLabelSelect>
          {record.tax !== "NONE" && (
            <div className="text-xs text-gray-500">
              Tax Amount: ₹{calculateTaxAmount(record).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      width: 120,
      render: (_, record) => (
        <div>
          <div className="font-medium">
            ₹{calculateFinalAmount(record).toFixed(2)}
          </div>
          {record.tax !== "NONE" && record.priceType === "withoutTax" && (
            <div className="text-xs text-gray-500">
              Base: ₹{(record.quantity * record.price).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "",
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(record.key)}
        />
      ),
    },
  ];

  return (
    <div className=" ">
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        className="my-4"
      />
    </div>
  );
};
