//@ts-nocheck

import React, { useEffect, useState } from "react";
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
import {
  deleteSaleOrder,
  getAllSaleOrder,
} from "../../../store/sale/saleOrder";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import InvoicePreviewModal from "./InvoiceTempelate";

// Define interfaces for type safety
interface PaymentOption {
  paymentType: string;
  paymentAmount: string;
  _id: string;
}

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  tax: string;
  taxAmount: number;
  amount: number;
}

interface SaleOrder {
  _id: string;
  orderNumber: string;
  orderDate: string;
  dueDate: string;
  stateOfSupply: string;
  party: string;
  phone: string;
  total: number;
  advanceAmount: number;
  roundOff: number;
  totalQty: number;
  pricePerUnitType: string;
  items: OrderItem[];
  paymentOption: PaymentOption[];
  description: string;
  img: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TableSaleOrder {
  key: string;
  party: string;
  no: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  balance: number;
  type: string;
  status: string;
  originalData: SaleOrder;
}

const SaleOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [orders, setOrders] = useState<TableSaleOrder[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const transformSaleOrders = (salesOrders: SaleOrder[]): TableSaleOrder[] => {
    return salesOrders.map((order) => ({
      key: order._id,
      party: order?.party?.name || "N/A", // Note: You might want to show party name instead of ID
      no: order.orderNumber,
      date: dayjs(order.orderDate).format("DD/MM/YYYY"),
      dueDate: dayjs(order.dueDate).format("DD/MM/YYYY"),
      totalAmount: order.total,
      balance: order.total - order.advanceAmount,
      type: "Sale Order",
      status: getOrderStatus(order),
      originalData: order,
    }));
  };

  const getOrderStatus = (order: SaleOrder): string => {
    if (order.status === "Pending") {
      const dueDate = dayjs(order.dueDate);
      const today = dayjs();
      return dueDate.isBefore(today) ? "Order Overdue" : "Pending";
    }
    return order.status;
  };

  const callGetSaleOrder = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const { payload } = await dispatch(getAllSaleOrder(page));

      if (payload.data.success) {
        const transformedOrders = transformSaleOrders(payload.data.salesOrders);
        setOrders(transformedOrders);
        setPagination({
          total: payload.data.pagination.totalSalesOrders,
          current: payload.data.pagination.currentPage,
          pageSize: payload.data.pagination.pageSize,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch sale orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callGetSaleOrder();
  }, []);

  const handleTableChange = (pagination: any) => {
    callGetSaleOrder(pagination.current, pagination.pageSize);
  };

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
      sorter: (a: TableSaleOrder, b: TableSaleOrder) =>
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 200,
      render: (text: string) => (
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
      render: (amount: number) => <span>₹ {amount.toFixed(2)}</span>,
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "balance",
      width: 150,
      render: (amount: number) => (
        <span className="font-medium">₹ {amount.toFixed(2)}</span>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type: string) => (
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
      render: (status: string) => (
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
      render: (_: any, record: TableSaleOrder) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            className="border-blue-500 text-blue-500"
            onClick={() => handleConvertToSale(record.originalData)}
          >
            CONVERT TO SALE
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit Order",
                  onClick: () => navigate(`/sale/order/add?id=${record.key}`),
                },
                {
                  key: "2",
                  label: "Delete Order",
                  onClick: () => handleDeleteOrder(record.key),
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
        </Space>
      ),
    },
  ];

  const handleConvertToSale = (orderData: SaleOrder) => {
    // Implement convert to sale logic
    console.log("Converting to sale:", orderData);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { payload } = await dispatch(deleteSaleOrder(orderId));
      if (payload.data.success) {
        toast.success("Order deleted Successfully");
        callGetSaleOrder();
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
          loading={loading}
          locale={{
            emptyText: <EmptyState />,
          }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500, y: "calc(100vh - 280px)" }}
          className="bg-white shadow-sm rounded-lg"
          sticky
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

export default SaleOrder;
