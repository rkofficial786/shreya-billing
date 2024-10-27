//@ts-nocheck

import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, Empty, Dropdown, Space, Tag } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import TransactionHeader from "../../../component/TransactionHeader";

const SaleOrder = () => {
  const navigate = useNavigate();

  // Sample data - replace with your actual data
  const orders = [
    {
      party: "Rupraj",
      no: "1",
      date: "26/10/2024",
      dueDate: "26/10/2024",
      totalAmount: 100.0,
      balance: 100.0,
      type: "Sale Order",
      status: "Order Overdue",
    },
  ];

  const columns = [
    {
      title: (
        <div className="flex items-center space-x-1">
          <span>PARTY</span>
          <FilterOutlined className="text-gray-400" />
        </div>
      ),
      dataIndex: "party",
      key: "party",
      fixed: "left",
      width: 200,
    },
    {
      title: "NO.",
      dataIndex: "no",
      key: "no",
      width: 100,
    },
    {
      title: (
        <div className="flex items-center space-x-1">
          <span>DATE</span>
          <SortAscendingOutlined className="text-gray-400" />
        </div>
      ),
      dataIndex: "date",
      key: "date",
      width: 150,
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 200,
      render: (text) => (
        <div className="flex items-center space-x-2">
          <CalendarOutlined className="text-gray-400" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-1">
          <span>TOTAL AMOUNT</span>
          <FilterOutlined className="text-gray-400" />
        </div>
      ),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (amount) => <span>₹ {amount.toFixed(2)}</span>,
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "balance",
      width: 150,
      render: (amount) => (
        <span className="font-medium">₹ {amount.toFixed(2)}</span>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type) => (
        <Tag color="blue" className="px-3 py-1">
          {type}
        </Tag>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag
          color={status === "Order Overdue" ? "orange" : "green"}
          className="px-3 py-1"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      fixed: "right",
      width: 200,
      render: () => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            className="border-blue-500 text-blue-500"
          >
            CONVERT TO SALE
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Edit Order" },
                { key: "2", label: "Delete Order" },
                { key: "3", label: "Download PDF" },
                { key: "4", label: "Share Order" },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const EmptyState = () => (
    <div className="text-center py-16">
      <Empty
        description={
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800">
              No Sale Orders Yet
            </h3>
            <p className="text-gray-500">
              Create your first sale order to get started tracking sales
            </p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/sale/order/add")}
              size="large"
              className="mt-4 bg-blue-500 hover:bg-blue-600"
            >
              Create Sale Order
            </Button>
          </div>
        }
      />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
  <TransactionHeader
  title="Sale Orders"
  subtitle="View and Manage Your Sales Orders"
/>


      <div className="bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">TRANSACTIONS</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/sale/order/add")}
            size="large"
           
          >
            Add Sale Order
          </Button>
        </div>

        <div className="mb-6">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search by party name, order number..."
            className="max-w-md"
            size="large"
          />
        </div>
      </div>

      <div className="flex-1 p-6">
        <Table
          columns={columns}
          dataSource={orders}
          locale={{
            emptyText: <EmptyState />,
          }}
          pagination={{
            total: orders.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 1500, y: "calc(100vh - 280px)" }}
          className="bg-white shadow-sm rounded-lg"
          sticky
        />
      </div>
    </div>
  );
};

export default SaleOrder;
