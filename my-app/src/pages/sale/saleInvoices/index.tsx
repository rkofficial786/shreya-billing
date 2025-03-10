import React, { useEffect, useState } from "react";
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
  Menu,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  MoreOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import SalesStatistics from "./SalesStatic";
import { useNavigate } from "react-router-dom";
import TransactionHeader from "../../../component/TransactionHeader";
import { useDispatch } from "react-redux";
import {
  conversionSaleInvoice,
  deleteSaleInvoice,
  getAllSaleInvoice,
  setEditSaleInvoice,
} from "../../../store/sale/saleInvoice";
import { handleInvoiceAction, InvoicePreviewModal } from "./InvoiceTempelate";
import ConversionDialog from "./convert";
const { RangePicker } = DatePicker;

const SaleInvoices = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [salesInvoiceData, setSaleInvoiceData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [conversionVisible, setConversionVisible] = useState(false);
  const [selectedSaleInvoice, setSelectedSaleInvoice] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const callGetSaleInvoice = async (
    page = 1,
    search = "",
    startDate = "",
    endDate = ""
  ) => {
    try {
      const { payload } = await dispatch(
        getAllSaleInvoice({
          page,

          search,
          startDate,
          endDate,
        })
      );

      if (payload.data.success) {
        const transformedData = payload.data.salesInvoices.map((invoice) => ({
          key: invoice._id,
          date: new Date(invoice.invoiceDate).toLocaleDateString(),
          invoiceNo: invoice.invoiceNumber,
          partyName: invoice.customerName,
          phone: invoice.phone,
          transactionType: "Sale",
          paymentType: invoice.paymentOption[0]?.paymentType || "N/A",
          amount: invoice.invoiceAmount,
          received: invoice.received,
          balanceDue: invoice.balance,
          items: invoice.items,
          stateOfSupply: invoice.stateOfSupply,
          paymentOption: invoice.paymentOption,
          description: invoice.description,
        }));

        setSaleInvoiceData(transformedData);
        setPagination({
          current: payload.data.pagination.currentPage,
          pageSize: payload.data.pagination.pageSize,
          total: payload.data.pagination.totalInvoices,
        });
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch sale invoices");
    }
  };

  useEffect(() => {
    callGetSaleInvoice(
      pagination.current,
      searchText,
      dateRange?.[0] || "",
      dateRange?.[1] || ""
    );
  }, [searchText, dateRange]);

  useEffect(() => {
    callGetSaleInvoice();
  }, []);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    callGetSaleInvoice(
      newPagination.current,
      searchText,
      dateRange?.[0] || "",
      dateRange?.[1] || ""
    );
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange([
        dates[0].startOf("day").toISOString(),
        dates[1].endOf("day").toISOString(),
      ]);
    } else {
      setDateRange(null);
    }
  };

  const handleEdit = (record, action) => {
    console.log(record, "reocede");

    setSelectedRecord(record);
    switch (action) {
      case "edit":
        dispatch(setEditSaleInvoice(record));
        navigate(`/sale/invoices/add-sale?id=${record.key}`);
        break;
      case "delete":
        dispatch(deleteSaleInvoice(record.key));
        callGetSaleInvoice();
        break;
      default:
        break;
    }
  };

  const handleConversion = async (type) => {
    try {
      const { payload } = await dispatch(
        conversionSaleInvoice({
          id: selectedSaleInvoice.key,
          data: { status: type },
        })
      );

      if (payload.data.success) {
        message.success(`Sale Invoice successfully converted `);

        callGetSaleInvoice(pagination.current);
      }
    } catch (error) {
      console.error("Conversion failed:", error);
      message.error("Failed to convert ");
    }
  };

  const handleConvert = (id) => {
    const saleInvoice = salesInvoiceData.find((q) => q.key === id);
    setSelectedSaleInvoice(saleInvoice);
    setConversionVisible(true);
  };

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
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
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
      render: (value) =>
        `₹${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Received",
      dataIndex: "received",
      key: "received",
      render: (value) =>
        `₹${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Balance Due",
      dataIndex: "balanceDue",
      key: "balanceDue",
      render: (value) =>
        `₹${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button
            type="primary"
            size="small"
            onClick={() => handleConvert(record.key)}
          >
            Convert
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="print"
                  icon={<PrinterOutlined />}
                  onClick={() =>
                    handleInvoiceAction(
                      record,
                      setPreviewVisible,
                      setSelectedInvoice
                    )
                  }
                >
                  Print
                </Menu.Item>
                <Menu.Item
                  key="edit"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record, "edit")}
                >
                  Edit
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="delete"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleEdit(record, "delete")}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="hover:bg-gray-100"
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <TransactionHeader
        title="Sale Invoices"
        subtitle="Review and Manage Your Sales Transactions"
      />

      <SalesStatistics salesInvoices={salesInvoiceData} />
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <RangePicker className="w-64" onChange={handleDateRangeChange} />
          {/* <Select
            defaultValue="ALL FIRMS"
            className="w-40"
            options={[
              { value: "ALL FIRMS", label: "ALL FIRMS" },
              { value: "FIRM1", label: "FIRM 1" },
              { value: "FIRM2", label: "FIRM 2" },
            ]}
          /> */}
          <Input
            placeholder="Search transactions..."
            prefix={<SearchOutlined />}
            className="w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
          {/* <Button icon={<FileExcelOutlined />}>Export</Button> */}
          {/* <Button icon={<PrinterOutlined />}>Print</Button> */}
        </div>
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={salesInvoiceData}
          pagination={{
            ...pagination,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <InvoicePreviewModal
        visible={previewVisible}
        invoice={selectedInvoice}
        onCancel={() => setPreviewVisible(false)}
      />

      <ConversionDialog
        visible={conversionVisible}
        onCancel={() => setConversionVisible(false)}
        onConvert={handleConversion}
        data={selectedSaleInvoice}
      />
    </div>
  );
};

export default SaleInvoices;
