import React, { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  deleteDeliveryChallan,
  getAllDeliveryChallan,
} from "../../../store/sale/deliveryChallan";
import toast from "react-hot-toast";
import InvoicePreviewModal from "./InvoiceTempelate";

const DeliveryChallan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const dispatch = useDispatch<any>();

  const callGetDeliveryChallan = async (
    page = 1,
    pageSize = 10,
    search = ""
  ) => {
    setLoading(true);
    try {
      const { payload } = await dispatch(
        getAllDeliveryChallan({
          page,
          
          search,
        })
      );

      console.log(payload,"challan")

      if (payload.data.success) {
        const tableData = payload?.data?.deliveryChallans.map(
          (item, index) => ({
            key: index + 1,
            id: item._id,
            dueDate: dayjs(item.challanDate).format("YYYY-MM-DD"),
            challanNo: item.challanNumber,
            party: item?.party?.name,
            date: dayjs(item.challanDate).format("YYYY-MM-DD"),
            status: item?.party.status,
            totalAmount: item?.total,
            originalData: item,
          })
        );
        setData(tableData);
        setPagination({
          total: payload.data.pagination.totalDeliveryChallans,
          current: payload.data.pagination.currentPage,
          pageSize: payload.data.pagination.pageSize,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch delivery challans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callGetDeliveryChallan(pagination.current, pagination.pageSize, searchText);
  }, [searchText]);

  const handleTableChange = (newPagination: any) => {
    callGetDeliveryChallan(
      newPagination.current,
      newPagination.pageSize,
      searchText
    );
  };

  const handleSearch = (value: string) => {
    // Reset to first page when searching
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearchText(value);
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
          {/* {text === "26/10/2024" && (
            <span className="text-gray-500">(Due: Today)</span>
          )} */}
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
      render: (_, record) => (
        <Space size="middle">
          {/* <Button type="primary" ghost>
            CONVERT TO SALE
          </Button> */}
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit Order",
                  onClick: () =>
                    navigate(`/sale/delivery-challan/add?id=${record.id}`),
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
        </Space>
      ),
    },
  ];

  const handleConvertToSale = (orderData) => {
    // Implement convert to sale logic
    console.log("Converting to sale:", orderData);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const { payload } = await dispatch(deleteDeliveryChallan(orderId));
      if (payload.data.success) {
        toast.success("Order deleted Successfully");
        callGetDeliveryChallan();
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
          placeholder="Search by party name, challan number..."
          className="max-w-md"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={(e) =>
            handleSearch((e.target as HTMLInputElement).value)
          }
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        locale={{
          emptyText: <EmptyState />,
        }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        className="shadow-sm"
      />
      <InvoicePreviewModal
        invoice={selectedInvoice}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
      />
    </div>
  );
};

export default DeliveryChallan;
