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
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import TransactionHeader from "../../../component/TransactionHeader";
import { useDispatch } from "react-redux";
import {
  deleteSaleReturn,
  getAllSaleReturn,
} from "../../../store/sale/saleReturn";
import toast from "react-hot-toast";
import InvoicePreviewModal from "./InvoiceTempelate";

const { RangePicker } = DatePicker;
const { Option } = Select;

const CreditNote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [selectedFirm, setSelectedFirm] = useState("ALL FIRMS");
  const [searchText, setSearchText] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const dispatch = useDispatch<any>();
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const callGetSaleReturn = async (
    page = 1,
    search = "",
    startDate = "",
    endDate = ""
  ) => {
    setLoading(true);
    try {
      const { payload } = await dispatch(
        getAllSaleReturn({
          page,
          search,
          startDate,
          endDate,
        })
      );

      if (payload.data.success) {
        const tableData = payload.data.salesReturns.map((item, index) => ({
          key: index + 1,
          id: item._id,
          date: dayjs(item.date).format("YYYY-MM-DD"),
          refNo: item.returnNumber,
          partyName: item.party.name,
          categoryName: "Electronics", // Assuming all items are in the Electronics category
          type: item.status,
          total: item.total,
          receivedPaid: item.paymentOption.reduce(
            (acc, payment) => acc + parseFloat(payment.paymentAmount),
            0
          ),
          balance: item.total,
          originalData: item,
        }));

        setData(tableData);
        setPagination({
          total: payload.data.pagination.totalSalesReturns,
          current: payload.data.pagination.currentPage,
          pageSize: payload.data.pagination.pageSize,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch sale returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Trigger fetch when search or date range changes
    callGetSaleReturn(
      1,
      searchText,
      dateRange?.[0]?.toISOString() || "",
      dateRange?.[1]?.toISOString() || ""
    );
  }, [searchText, dateRange]);

  const handleTableChange = (newPagination) => {
    callGetSaleReturn(
      newPagination.current,
      searchText,
      dateRange?.[0]?.toISOString() || "",
      dateRange?.[1]?.toISOString() || ""
    );
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  useEffect(() => {
    callGetSaleReturn();
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
      title: "ACTIONS",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "Edit Order",
                onClick: () =>
                  navigate(`/sale/credit-note/add?id=${record.id}`),
              },
              {
                key: "2",
                label: "Delete Order",
                onClick: () => handleDeleteOrder(record.id),
              },
              {
                key: "3",
                label: "Download PDF",
                onClick: () => handleDownloadPDF(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleConvertToSale = (orderData) => {
    // Implement convert to sale logic
    console.log("Converting to sale:", orderData);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { payload } = await dispatch(deleteSaleReturn(orderId));
      if (payload.data.success) {
        toast.success("Order deleted Successfully");
        callGetSaleReturn();
      }
    } catch (error) {
      console.log(error);
    }
    console.log("Deleting order:", orderId);
  };

  const handleDownloadPDF = (record: any) => {
    setPreviewVisible(true);
    setSelectedInvoice(record.originalData);
  };

  const handleShareOrder = (orderId: string) => {
    // Implement share logic
    console.log("Sharing order:", orderId);
  };

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
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded">
            <Typography.Text>Between</Typography.Text>
            <RangePicker onChange={handleDateRangeChange} format="DD/MM/YYYY" />
          </div>
        </div>

        {/* <div className="flex gap-2">
          <Button icon={<FileExcelOutlined />}>Excel Report</Button>
          <Button icon={<PrinterOutlined />}>Print</Button>
        </div> */}
      </div>

      {/* Search and Add Button */}
      <div className="flex justify-between mb-4">
      <Input
          placeholder="Search transactions..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-64"
        />
        <Button
          type="primary"
          onClick={() => navigate("/sale/credit-note/add")}
        >
          + Add Credit Note
        </Button>
      </div>

      {/* Main Table */}
      <Table
        // @ts-ignore
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        scroll={{ x: true }}
      />

      {/* Footer Totals */}
      <div className="flex justify-between mt-4 text-sm">
        <div>Total Amount: ₹ {totals.total.toFixed(2)}</div>
        <div>Balance: ₹ {totals.balance.toFixed(2)}</div>
      </div>

      <InvoicePreviewModal
        invoice={selectedInvoice}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
      />
    </div>
  );
};

export default CreditNote;
