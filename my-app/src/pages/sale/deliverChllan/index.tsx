import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, Empty, Dropdown, Space, Tag } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import TransactionHeader from "../../../component/TransactionHeader";

const DeliveryChallan = () => {
  const navigate = useNavigate();

  // Sample data - replace with your actual data
  const challans = [
    {
      date: "26/10/2024",
      party: "Rupraj",
      challanNo: "1",
      dueDate: "26/10/2024",
      totalAmount: 100.0,
      status: "Open",
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
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: (
        <div className="flex items-center space-x-1">
          <span>PARTY</span>
          <FilterOutlined className="text-gray-400" />
        </div>
      ),
      dataIndex: "party",
      key: "party",
    },
    {
      title: "Challan NO.",
      dataIndex: "challanNo",
      key: "challanNo",
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text) => (
        <span>
          {text}{" "}
          {text === "26/10/2024" && (
            <span className="text-gray-500">(Due: Today)</span>
          )}
        </span>
      ),
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => <span>₹ {amount.toFixed(2)}</span>,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Open" ? "blue" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      render: () => (
        <Space size="middle">
          <Button type="primary" ghost>
            CONVERT TO SALE
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "Edit" },
                { key: "2", label: "Delete" },
                { key: "3", label: "Print" },
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
            <h3 className="text-lg font-medium">No Delivery Challans Yet</h3>
            <p className="text-gray-500">
              Create your first delivery challan to get started
            </p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/sale/delivery-challan/add")}
              className="mt-4"
            >
              Add Delivery Challan
            </Button>
          </div>
        }
      />
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <TransactionHeader
        title="Delivery Challans"
        subtitle="Track and Manage Your Delivery Documents"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">TRANSACTIONS</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/sale/delivery-challan/add")}
          className=""
        >
          Add Delivery Challan
        </Button>
      </div>

      <div className="mb-6">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search transactions..."
          className="max-w-md"
        />
      </div>

      <Table
        columns={columns}
        dataSource={challans}
        locale={{
          emptyText: <EmptyState />,
        }}
        pagination={{
          total: challans.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        className="shadow-sm"
      />
    </div>
  );
};

export default DeliveryChallan;
