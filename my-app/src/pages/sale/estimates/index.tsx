//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Empty,
  Dropdown,
  Space,
  Tag,
  message,
} from "antd";
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
import { useDispatch } from "react-redux";
import {
  deleteQuotation,
  getAllQuotation,
} from "../../../store/sale/quotation";
import toast from "react-hot-toast";
import InvoicePreviewModal, { handleInvoiceAction } from "./InvoiceTempelate";

const Estimates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quotationData, setQuotationData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const callGetQuotation = async (page = 1, pageSize = 10, search = "") => {
    try {
      const { payload } = await dispatch(
        getAllQuotation({
          page,
          pageSize,
          search,
        })
      );

      if (payload.data.success) {
        // Transform the data to match the table structure
        const transformedData = payload.data.quotations.map((quotation) => ({
          key: quotation._id,
          date: new Date(quotation.invoiceDate).toLocaleDateString("en-GB"),
          referenceNo: quotation.refNumber,
          name: quotation.items[0]?.name || "N/A",
          totalAmount: quotation.total,
          balance: quotation.total,
          status: "Quotation Open",
          rawData: quotation,
        }));

        setQuotationData(transformedData);
        setFilteredData(transformedData);
        setPagination({
          current: payload.data.pagination.currentPage,
          pageSize: payload.data.pagination.pageSize,
          total: payload.data.pagination.totalQuotations,
        });
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch quotations");
    }
  };

  useEffect(() => {
    callGetQuotation();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    callGetQuotation(1, pagination.pageSize, value);
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    const { current, pageSize } = newPagination;

    // If search term exists, pass it to the API
    callGetQuotation(current, pageSize, searchTerm);

    setPagination({
      current,
      pageSize,
      total: pagination.total,
    });
  };
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
      sorter: (a, b) =>
        new Date(a.date.split("/").reverse().join("-")) -
        new Date(b.date.split("/").reverse().join("-")),
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
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            className="border-blue-500 text-blue-500"
            onClick={() => handleConvert(record.key)}
          >
            CONVERT
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit Quotation",
                  onClick: () =>
                    navigate(`/sale/quotation/add?id=${record.key}`),
                },
                {
                  key: "2",
                  label: "Delete Quotation",
                  onClick: () => handleDelete(record.key),
                },
                {
                  key: "3",
                  label: "Download PDF",
                  onClick: () => handleInvoiceAction(record),
                },
                // { key: "4", label: "Send via Email" },
                // { key: "5", label: "Mark as Accepted" },
                // { key: "6", label: "Mark as Rejected" },
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

  const handleInvoiceAction = (record) => {
    setPreviewVisible(true);
    setSelectedInvoice(record);
  };
  const handleConvert = (id) => {
    // Add your convert logic here
    console.log("Converting quotation:", id);
  };

  const handleDelete = async (id) => {
    try {
      const { payload } = await dispatch(deleteQuotation(id));
      if (payload.data.success) {
        toast.success("Quotation Deleted Successfully");
        callGetQuotation(pagination.current, pagination.pageSize, searchTerm);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
              className="mt-4"
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
      <TransactionHeader title="Estimates & Quotations" />

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </div>
      </div>

      <div className="flex-1 p-6">
        <Table
          columns={columns}
          dataSource={quotationData}
          locale={{
            emptyText: <EmptyState />,
          }}
          pagination={{
            ...pagination,
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

      <InvoicePreviewModal
        invoice={selectedInvoice}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
      />
    </div>
  );
};

export default Estimates;
