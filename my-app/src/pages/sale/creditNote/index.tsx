//@ts-nocheck

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Select,
  Input,
  DatePicker,
  Space,
  Typography,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import TransactionHeader from "../../../component/TransactionHeader";

const { RangePicker } = DatePicker;
const { Option } = Select;

const CreditNote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [selectedFirm, setSelectedFirm] = useState("ALL FIRMS");
  const [searchText, setSearchText] = useState("");

  // Dummy data for demonstration
  const dummyData = [
    {
      key: "1",
      date: "2024-10-15",
      refNo: "CN-001",
      partyName: "ABC Trading Co.",
      categoryName: "Electronics",
      type: "Return",
      total: 5000.0,
      receivedPaid: 5000.0,
      balance: 0.0,
    },
    {
      key: "2",
      date: "2024-10-16",
      refNo: "CN-002",
      partyName: "XYZ Enterprises",
      categoryName: "Furniture",
      type: "Discount",
      total: 7500.0,
      receivedPaid: 5000.0,
      balance: 2500.0,
    },
    {
      key: "3",
      date: "2024-10-17",
      refNo: "CN-003",
      partyName: "Global Imports",
      categoryName: "Textiles",
      type: "Return",
      total: 3000.0,
      receivedPaid: 3000.0,
      balance: 0.0,
    },
  ];

  // Simulating API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setData(dummyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "REF NO.",
      dataIndex: "refNo",
      key: "refNo",
    },
    {
      title: "PARTY NAME",
      dataIndex: "partyName",
      key: "partyName",
      filterable: true,
    },
    {
      title: "CATEGORY NAME",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (value) => `₹ ${value.toFixed(2)}`,
    },
    {
      title: "RECEIVED/PAID",
      dataIndex: "receivedPaid",
      key: "receivedPaid",
      align: "right",
      render: (value) => `₹ ${value.toFixed(2)}`,
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "balance",
      align: "right",
      render: (value) => `₹ ${value.toFixed(2)}`,
    },
    {
      title: "PRINT/SHARE",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="print" icon={<PrinterOutlined />}>
                Print
              </Menu.Item>
              <Menu.Item key="share">Share</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const calculateTotals = () => {
    return data.reduce(
      (acc, curr) => {
        acc.total += curr.total;
        acc.balance += curr.balance;
        return acc;
      },
      { total: 0, balance: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="p-4 bg-white">
      <TransactionHeader
        title="Credit Notes"
        subtitle="Manage and Track Your Credit Transactions"
      />

      {/* Header Controls */}
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <Select defaultValue="This Month" className="w-32">
            <Option value="this_month">This Month</Option>
            <Option value="last_month">Last Month</Option>
            <Option value="custom">Custom</Option>
          </Select>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded">
            <Typography.Text>Between</Typography.Text>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
            />
          </div>

          <Select
            value={selectedFirm}
            onChange={setSelectedFirm}
            className="w-40"
          >
            <Option value="ALL FIRMS">ALL FIRMS</Option>
            <Option value="firm1">Firm 1</Option>
            <Option value="firm2">Firm 2</Option>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button icon={<FileExcelOutlined />}>Excel Report</Button>
          <Button icon={<PrinterOutlined />}>Print</Button>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-64"
        />
        <Button
          type="primary"
          onClick={() => navigate("/sale/credit-note/add")}
          className="bg-blue-500"
        >
          Add Credit Note
        </Button>
      </div>

      {/* Main Table */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          total: data.length,
          pageSize: 10,
          showTotal: (total) => `Total ${total} items`,
        }}
        scroll={{ x: true }}
      />

      {/* Footer Totals */}
      <div className="flex justify-between mt-4 text-sm">
        <div>Total Amount: ₹ {totals.total.toFixed(2)}</div>
        <div>Balance: ₹ {totals.balance.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default CreditNote;
