import React from "react";
import { Table, Button, InputNumber, Space } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const SelectedProducts = ({
  selectedProducts,
  updateQuantity,
  updateDiscount,
}) => {
  const selectedProductColumns = [
    { title: "#", dataIndex: "key", key: "key", width: 50 },
    { title: "Item Code", dataIndex: "code", key: "code" },
    { title: "Item Name", dataIndex: "name", key: "name" },
    {
      title: "QTY",
      key: "quantity",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<MinusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity - 1)}
            disabled={record.quantity <= 1}
          />
          <InputNumber
            min={1}
            value={record.quantity}
            onChange={(value) => updateQuantity(record.id, value)}
            className="w-10"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity + 1)}
          />
        </Space>
      ),
    },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    {
      title: "Price/Unit (₹)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toFixed(2),
    },
    {
      title: "Discount (₹)",
      key: "discount",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={record.price * record.quantity}
          defaultValue={0}
          onChange={(value) => updateDiscount(record.id, value)}
          className="w-20"
        />
      ),
    },
    {
      title: "Tax Applied (₹)",
      dataIndex: "tax",
      key: "tax",
      render: (_, record) =>
        (record.price * record.quantity * (record.tax / 100)).toFixed(2),
    },
    {
      title: "Total (₹)",
      key: "total",
      render: (_, record) =>
        (
          record.price * record.quantity +
          record.price * record.quantity * 0.18 -
          (record.discount || 0)
        ).toFixed(2),
    },
  ];

  return (
    <Table
      className="min-h-[90vh] bg-white"
      columns={selectedProductColumns}
      dataSource={selectedProducts}
      pagination={false}
      scroll={{ y: "calc(100vh - 400px)" }}
      size="middle"
    />
  );
};

export default SelectedProducts;