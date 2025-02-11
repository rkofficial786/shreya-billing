//@ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Dropdown,
  Menu,
  Tag,
  Modal,
  Tooltip,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  FilterOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteItems, getAllItems, getAllItemsFromWebsite, setEditItem } from "../../store/items";
import ItemDetailsModal from "./ViewModal";

const Items = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const callGetAllItems = async () => {
    try {
      const { payload } = await dispatch(getAllItems());
      console.log(payload);
      if (payload.data.success) {
        const {payload : webItems} =await dispatch(getAllItemsFromWebsite())

        console.log(webItems,"websitems");
        
        setItems(payload.data.items);
        if (payload.data.items.length > 0) {
          setSelectedRecord(payload.data.items[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callGetAllItems();
  }, []);

  const [transactions] = useState([
    // {
    //   id: 1,
    //   type: "Sale",
    //   invoiceNo: "INV-001",
    //   name: "Rupraj",
    //   date: "20/10/2024",
    //   quantity: 10,
    //   pricePerUnit: 100.0,
    //   status: "Partial",
    //   paymentMethod: "Credit Card",
    //   total: 1000.0,
    // },
    // {
    //   id: 2,
    //   type: "Purchase",
    //   invoiceNo: "PO-001",
    //   name: "Supplier Co.",
    //   date: "19/10/2024",
    //   quantity: 20,
    //   pricePerUnit: 80.0,
    //   status: "Complete",
    //   paymentMethod: "Bank Transfer",
    //   total: 1600.0,
    // },
  ]);

  const handleMenuClick = (record, action) => {
    setSelectedRecord(record);
    switch (action) {
      case "view":
        setIsModalVisible(true);
        break;
      case "edit":
        dispatch(setEditItem(record));
        navigate(`/items/add-item?id=${record._id}`);
        break;
      case "delete":
        dispatch(deleteItems(record._id));
        callGetAllItems()
        break;
      default:
        break;
    }
  };

  const itemActionMenu = (record) => (
    <Menu>
      <Menu.Item key="view" onClick={() => handleMenuClick(record, "view")}>
        <Space>
          <EyeOutlined />
          View Details
        </Space>
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => handleMenuClick(record, "edit")}>
        <Space>
          <EditOutlined />
          Edit Item
        </Space>
      </Menu.Item>
      <Menu.Divider />
    
     
      <Menu.Item
        key="delete"
        danger
        onClick={() => handleMenuClick(record, "delete")}
      >
        <Space>
          <DeleteOutlined />
          Delete Item
        </Space>
      </Menu.Item>
    </Menu>
  );

  const transactionActionMenu = (record) => (
    <Menu>
      <Menu.Item key="view" onClick={() => handleMenuClick(record, "view")}>
        <Space>
          <EyeOutlined />
          View Details
        </Space>
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => handleMenuClick(record, "edit")}>
        <Space>
          <EditOutlined />
          Edit Transaction
        </Space>
      </Menu.Item>
      <Menu.Item key="download">
        <Space>
          <DownloadOutlined />
          Download Invoice
        </Space>
      </Menu.Item>
      <Menu.Item key="share">
        <Space>
          <ShareAltOutlined />
          Share
        </Space>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="delete"
        danger
        onClick={() => handleMenuClick(record, "delete")}
      >
        <Space>
          <DeleteOutlined />
          Delete Transaction
        </Space>
      </Menu.Item>
    </Menu>
  );

  const itemColumns = [
    {
      title: "ITEM",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "QUANTITY",
      dataIndex: ["stock", "openingQty"], // Modified to access nested property
      key: "quantity",
      align: "right",
      render: (
        openingQty // Changed parameter name to match
      ) => (
        <span className={openingQty < 0 ? "text-red-500" : "text-green-500"}>
          {openingQty}
        </span>
      ),
    },

    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={itemActionMenu(record)} trigger={["click"]}>
          <Button type="text" className="border-none" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <Space>
          <span
            className={`w-2 h-2 rounded-full ${
              text === "Sale" ? "bg-green-500" : "bg-blue-500"
            } inline-block`}
          ></span>
          {text}
        </Space>
      ),
    },
    {
      title: "INVOICE/REF. NO",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
    },
    {
      title: "PRICE/UNIT",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      align: "right",
      render: (value) => `₹ ${value.toFixed(2)}`,
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (value) => `₹ ${value.toFixed(2)}`,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Partial" ? "warning" : "success"}>{status}</Tag>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={transactionActionMenu(record)} trigger={["click"]}>
          <Button type="text" className="border-none" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];


  console.log(selectedRecord,"selecetd record");
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/4 p-4 border-r border-gray-200 shadow-crisp">
        <div className="flex justify-between items-center mb-4">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search items"
            className="w-48"
          />
          <Tooltip title="Add New Item">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="flex items-center"
              onClick={() => navigate("/items/add-item")}
            >
              Add Item
            </Button>
          </Tooltip>
        </div>

        <Table
          dataSource={items}
          columns={itemColumns}
          pagination={false}
          className="min-h-[80vh]"
          rowClassName="cursor-pointer hover:bg-blue-50"
          size="small"
        />
      </div>

      {/* Right Panel */}
      <div className="flex-1 px-4">
        <Card className="mb-4 shadow-crisp">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">TRANSACTIONS</span>
            <Space>
              <DatePicker className="w-40" placeholder="Filter by date" />
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search transactions"
                className="w-64"
              />
            </Space>
          </div>
          <Table
            dataSource={transactions}
            columns={transactionColumns}
            pagination={{
              total: transactions.length,
              pageSize: 10,
              showTotal: (total) => `Total ${total} items`,
            }}
            className="min-h-[90vh]"
            size="small"
          />
        </Card>
      </div>

      {/* <Modal
        title="Item Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p>Name: {selectedRecord.name}</p>
            <p>Quantity: {selectedRecord.quantity}</p>
            <p>Category: {selectedRecord.category}</p>
            <p>Last Updated: {selectedRecord.lastUpdated}</p>
          </div>
        )}
      </Modal> */}
      <ItemDetailsModal
       visible={isModalVisible}
       onCancel={() => setIsModalVisible(false)}
       selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default Items;
