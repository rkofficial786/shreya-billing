//@ts-nocheck

import React, { useState, useEffect } from "react";
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
  Form,
} from "antd";
import {
  SearchOutlined,
  MoreOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import TransactionHeader from "../../../component/TransactionHeader";
import PaymentModal from "./Modal";
import { useDispatch } from "react-redux";
import {
  createPaymentInvoice,
  updatePaymentInvoice,
  getAllPaymentInvoices,
} from "../../../store/sale/paymentIn";

const { RangePicker } = DatePicker;
const { Option } = Select;

const PaymentIn = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch<any>();
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([]);
  const [selectedFirm, setSelectedFirm] = useState("ALL FIRMS");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    searchText: "",
    firm: "ALL FIRMS",
  });
  const [payments, setPayments] = useState([
    { type: "Cash", amount: "", refNo: "" },
  ]);
  const [total, setTotal] = useState(0);
  const [existingImage, setExistingImage] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  console.log(fileList, "file list");
  console.log(existingImage, "existingimge");

  const handleModalSubmit = async (values) => {
    const formData = new FormData();

    const fileListUrls = new Set(fileList.map((item) => item.url));

    // Filter the existing image list to only include URLs that are in the file list
    const filteredImage = existingImage.filter((url) => fileListUrls.has(url));

    const payments = values.payments.map((item) => ({
      paymentType: item.type,
      amount: item.amount,
    }));
    formData.append("party", values.party);
    formData.append("receiptNumber", values.receiptNo);

    formData.append(`payments`, JSON.stringify(payments));

    formData.append("date", values.date);
    formData.append("description", values.description);
    formData.append("received", values.received.toString());
    formData.append("existingImg", JSON.stringify(filteredImage));

    const actualFiles = values.fileList.filter((item) => item.originFileObj);
    actualFiles.forEach((file, index) => {
      formData.append(`img`, file.originFileObj);
    });

    try {
      let payload;
      if (selectedRecord) {
        payload = await dispatch(
          updatePaymentInvoice({ id: selectedRecord._id, data: formData })
        );
      } else {
        payload = await dispatch(createPaymentInvoice(formData));
      }
      console.log(payload, "payment");
      fetchData();
      setModalOpen(false);
      setFileList([]);
      setSelectedRecord(null);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { payload } = await dispatch(
        getAllPaymentInvoices({
          page: pagination.current,

          startDate: dateRange[0],
          endDate: dateRange[1],

          search: searchParams.searchText,
        })
      );

      console.log(payload.data.success, "data");
      if (payload.data.success) {
        setData(payload.data.paymentsIn);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: payload.data.pagination.totalRecords,
        }));
      } else {
        message.error("Failed to fetch payment invoices");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Trigger data fetching when search, pagination, or date changes
  useEffect(() => {
    fetchData();
  }, [
    pagination.current,
    pagination.pageSize,
    dateRange,
    searchParams.firm,
    searchParams.searchText,
  ]);

  // Handle Table Change for Pagination and Sorting
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      total: newPagination.total,
    });
  };

  // Search Handler
  const handleSearch = (value) => {
    // Reset to first page when searching
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearchParams((prev) => ({ ...prev, searchText: value }));
  };

  // Date Range Handler
  const handleDateRangeChange = (dates) => {
    // Reset to first page when changing date range
    const formattedDates = dates
      ? dates.map((date) => (date ? date.toISOString() : null))
      : [null, null];

    setDateRange(formattedDates);
  };

  // Firm Filter Handler
  const handleFirmChange = (value) => {
    // Reset to first page when changing firm
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearchParams((prev) => ({ ...prev, firm: value }));
  };

  // useEffect(() => {
  //   fetchData();
  // }, [dispatch, page, pageSize, dateRange, selectedFirm, searchText]);

  const editPaymentIn = (record) => {
    setSelectedRecord(record);
    setFileList(record.img.map((img) => ({ url: img })));
    setModalOpen(true);
    const pay = record.payments.map((payment) => ({
      type: payment.paymentType,
      amount: payment.amount,
    }));
    setExistingImage(record.img);
    setPayments(pay);
    form.setFieldsValue({
      party: record.party._id,
      receiptNo: record.receiptNumber,
      payments: record.payments.map((payment) => ({
        type: payment.paymentType,
        amount: payment.amount,
      })),
      date: dayjs(record.date),
      description: record.description,
      received: record.received,
      existingImg: record.img,
    });
  };

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
      render: (_, record) => dayjs(record.date).format("YYYY-MM-DD"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "REF NO.",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
    },
    {
      title: "PARTY NAME",
      dataIndex: "party?.name",
      key: "partyName",
      filterable: true,
      render: (_, record) => record?.party?.name,
    },
    // {
    //   title: "CATEGORY NAME",
    //   dataIndex: "party.categoryName",
    //   key: "categoryName",
    // },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "RECEIVED/PAID",
      dataIndex: "received",
      key: "receivedPaid",
      align: "left",
      render: (_, record) => `₹ ${record?.received}`,
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "balance",
      align: "left",
      render: (_, record) => `₹ ${record?.received}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<PrinterOutlined />} />
          <Button type="text" icon={<ShareAltOutlined />} />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => editPaymentIn(record)}
          />
        </Space>
      ),
    },
  ];

  const calculateTotals = () => {
    return data?.reduce(
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
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded">
            <Typography.Text>Between</Typography.Text>
            <RangePicker className="w-64" onChange={handleDateRangeChange} />
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search by party name, ref no..."
          prefix={<SearchOutlined />}
          value={searchParams.searchText}
          onChange={(e) =>
            setSearchParams((prev) => ({
              ...prev,
              searchText: e.target.value,
            }))
          }
          onPressEnter={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-64"
        />
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Payment-In
        </Button>
      </div>

      {/* Main Table */}
      <Table
        columns={columns}
        dataSource={data?.map((item, index) => ({
          key: index + 1,
          ...item,
        }))}
        className="min-h-[60vh]"
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        scroll={{ x: true }}
      />

      <PaymentModal
        open={modalOpen}
        fileList={fileList}
        setFileList={setFileList}
        onCancel={() => {
          setModalOpen(false);
          setFileList([]);
          setSelectedRecord(null);
          form.resetFields();
        }}
        onSubmit={handleModalSubmit}
        form={form}
        isEdit={!!selectedRecord}
        setPayments={setPayments}
        payments={payments}
      />
    </div>
  );
};

export default PaymentIn;
