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
  ShareAltOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import TransactionHeader from "../../../component/TransactionHeader";
import PaymentModal from "./Modal";

const { RangePicker } = DatePicker;
const { Option } = Select;

const PaymentIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs("2024-10-01"),
    dayjs("2024-10-31"),
  ]);
  const [selectedFirm, setSelectedFirm] = useState("ALL FIRMS");
  const [searchText, setSearchText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  // ... rest of the state variables ...

  const handleModalSubmit = (values) => {
    // Add the new payment to the data
    const newPayment = {
      key: (data.length + 1).toString(),
      date: values.date,
      receiptNo: values.receiptNo,
      partyName: values.party,
      categoryName: "",
      description: values.description,
      type: "Payment-In",
      total: parseFloat(values.received),
      payments: values.payments,
      receivedPaid: parseFloat(values.received),
      balance: 0.0,
      fileList: values.fileList,
    };

    console.log(newPayment, "newpayment");

    setData([...data, newPayment]);

    setModalOpen(false);
    setFileList([]);
  };

  // Data matching the screenshot
  const dummyData = [
    {
      key: "1",
      date: "26/10/2024",
      refNo: "1",
      partyName: "Rupraj",
      categoryName: "",
      type: "Payment-In",
      total: 10000.0,
      receivedPaid: 10000.0,
      balance: 0.0,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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
      sorter: (a, b) =>
        dayjs(a.date, "DD/MM/YYYY").unix() - dayjs(b.date, "DD/MM/YYYY").unix(),
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
      title: "PRINT / SHARE",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<PrinterOutlined />} />
          <Button type="text" icon={<ShareAltOutlined />} />
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
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
        title="Payment In"
        subtitle="Manage Your Payment Transactions"
      />

      {/* Header Controls */}
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          {/* <Select defaultValue="This Month" className="w-32">
            <Option value="this_month">This Month</Option>
            <Option value="last_month">Last Month</Option>
            <Option value="custom">Custom</Option>
          </Select> */}

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

          {/* <Select defaultValue="Payment-In" className="w-40">
            <Option value="Payment-In">Payment-In</Option>
          </Select> */}
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
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Payment-In
        </Button>
      </div>

      {/* Main Table */}
      <Table
        columns={columns}
        dataSource={data}
        className="min-h-[60vh]"
        loading={loading}
        pagination={false}
        scroll={{ x: true }}
      />

      {/* Footer Totals */}
      <div className="flex justify-between mt-4 text-sm">
        <div>Total Amount: ₹ {totals.total.toFixed(2)}</div>
        <div>Balance: ₹ {totals.balance.toFixed(2)}</div>
      </div>

      <PaymentModal
        open={modalOpen}
        fileList={fileList}
        setFileList={setFileList}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default PaymentIn;
