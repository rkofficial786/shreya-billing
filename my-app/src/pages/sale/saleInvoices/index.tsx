import React, { useState } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Modal,
  Form,
  message,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  PrinterOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import SalesStatistics from "./SalesStatic";
import { useNavigate } from "react-router-dom";
import TransactionHeader from "../../../component/TransactionHeader";
const { RangePicker } = DatePicker;

const SaleInvoices = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // Dummy data for demonstration
  const dummyData = [
    {
      key: "1",
      date: "2024-10-20",
      invoiceNo: "INV-001",
      partyName: "Rupraj",
      transactionType: "Sale",
      paymentType: "Cash",
      amount: 1000,
      balanceDue: 100,
    },
    {
      key: "2",
      date: "2024-10-19",
      invoiceNo: "INV-002",
      partyName: "John Doe",
      transactionType: "Sale",
      paymentType: "Card",
      amount: 2500,
      balanceDue: 0,
    },
    // Add more dummy data as needed
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: "Party Name",
      dataIndex: "partyName",
      key: "partyName",
      filterSearch: true,
      filters: [
        { text: "Rupraj", value: "Rupraj" },
        { text: "John Doe", value: "John Doe" },
      ],
      onFilter: (value, record) => record.partyName.includes(value),
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      filters: [
        { text: "Cash", value: "Cash" },
        { text: "Card", value: "Card" },
      ],
      onFilter: (value, record) => record.paymentType === value,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Balance Due",
      dataIndex: "balanceDue",
      key: "balanceDue",
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<PrinterOutlined />}
            onClick={() => message.info(`Printing invoice ${record.invoiceNo}`)}
          />
          <Button
            type="link"
            danger
            onClick={() => message.info(`Editing invoice ${record.invoiceNo}`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const handleAddSale = (values) => {
    console.log("New sale values:", values);
    setIsModalVisible(false);
    form.resetFields();
    message.success("Sale added successfully!");
  };

  return (
    <div className="p-6">
      <TransactionHeader
        title="Sale Invoices"
        subtitle="Review and Manage Your Sales Transactions"
      />

      {/* Summary Cards */}
      <SalesStatistics />

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <RangePicker className="w-64" />
          <Select
            defaultValue="ALL FIRMS"
            className="w-40"
            options={[
              { value: "ALL FIRMS", label: "ALL FIRMS" },
              { value: "FIRM1", label: "FIRM 1" },
              { value: "FIRM2", label: "FIRM 2" },
            ]}
          />
          <Input
            placeholder="Search transactions..."
            prefix={<SearchOutlined />}
            className="w-64"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/sale/invoices/add-sale")}
          >
            Add Sale
          </Button>
          <Button icon={<FileExcelOutlined />}>Export</Button>
          <Button icon={<PrinterOutlined />}>Print</Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={dummyData}
          pagination={{
            total: dummyData.length,
            pageSize: 10,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default SaleInvoices;
