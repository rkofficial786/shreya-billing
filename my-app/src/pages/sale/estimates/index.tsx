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
  FileTextOutlined,
} from "@ant-design/icons";
import TransactionHeader from "../../../component/TransactionHeader";

const Estimates = () => {
  const navigate = useNavigate();

  // Sample data - replace with your actual data
  const quotations = [
    {
      date: "26/10/2024",
      referenceNo: "1",
      name: "Rupraj",
      totalAmount: 100.0,
      balance: 100.0,
      status: "Quotation Open",
    },
  ];

  const columns = [
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
          <span>REFERENCE NO</span>
          <FilterOutlined className="text-gray-400" />
        </div>
      ),
      dataIndex: "referenceNo",
      key: "referenceNo",
      width: 150,
      render: (text) => (
        <div className="flex items-center space-x-2">
          <FileTextOutlined className="text-gray-400" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-1">
          <span>NAME</span>
          <FilterOutlined className="text-gray-400" />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 200,
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
      width: 200,
      render: (amount) => (
        <span className="text-gray-900">₹ {amount.toFixed(2)}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-1">
          <span>BALANCE</span>
          <FilterOutlined className="text-gray-400" />
        </div>
      ),
      dataIndex: "balance",
      key: "balance",
      width: 200,
      render: (amount) => (
        <span className="font-medium text-gray-900">₹ {amount.toFixed(2)}</span>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => (
        <Tag
          color={status === "Quotation Open" ? "orange" : "green"}
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
      width: 180,
      render: () => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            className="border-blue-500 text-blue-500"
          >
            CONVERT
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Edit Quotation" },
                { key: "2", label: "Delete Quotation" },
                { key: "3", label: "Download PDF" },
                { key: "4", label: "Send via Email" },
                { key: "5", label: "Mark as Accepted" },
                { key: "6", label: "Mark as Rejected" },
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
              No Estimates Yet
            </h3>
            <p className="text-gray-500">
              Create your first estimate/quotation to get started
            </p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/sale/quotation/add")}
              size="large"
              className="mt-4 "
            >
              Create Estimate
            </Button>
          </div>
        }
      />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TransactionHeader title="Estimates & Quotations"/>

      <div className="bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">TRANSACTIONS</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/sale/quotation/add")}
            size="large"
          >
            Add Estimate
          </Button>
        </div>

        <div className="mb-6">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search by name, reference number..."
            className="max-w-md"
            size="large"
          />
        </div>
      </div>

      <div className="flex-1 p-6">
        <Table
          columns={columns}
          dataSource={quotations}
          locale={{
            emptyText: <EmptyState />,
          }}
          pagination={{
            total: quotations.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 1300, y: "calc(100vh - 280px)" }}
          className="bg-white shadow-sm rounded-lg"
          sticky
          rowSelection={{
            type: "checkbox",
            columnWidth: 48,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
          }}
          rowClassName={(record) =>
            `hover:bg-blue-50 transition-colors ${
              record.status === "Quotation Open" ? "bg-orange-50/30" : ""
            }`
          }
        />
      </div>
    </div>
  );
};

export default Estimates;
