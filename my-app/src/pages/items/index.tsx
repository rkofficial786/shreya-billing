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
  Tooltip,
  Image,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  InboxOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  deleteItems,
  getAllItems,
  getAllItemsFromWebsite,
  setEditItem,
} from "../../store/items";
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
        const { payload: webItems } = await dispatch(getAllItemsFromWebsite());

        console.log(webItems, "websitems");

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
        callGetAllItems();
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "ITEM DETAILS",
      key: "itemDetails",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          {record.img && record.img.length > 0 ? (
            <Image
              src={record.img[0]}
              alt={record.name}
              className="!w-12 !h-12 object-cover rounded"
              fallback=""
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <InboxOutlined className="text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-xs text-gray-500">Code: {record.itemCode}</div>
            {record.category && record.category[0] && (
              <Tag color="blue" className="mt-1">
                {record.category[0].name}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "PRICING",
      key: "pricing",
      render: (_, record) => (
        <div>
          <div className="flex items-center text-green-600">
            <DollarOutlined className="mr-1" />
            Sale: ₹{record.salePrice?.salePrice || 0}
            {record.salePrice?.discountPrice && (
              <Tag color="orange" className="ml-2">
                {record.salePrice.discountPrice}% OFF
              </Tag>
            )}
          </div>
          <div className="text-gray-600 mt-1">
            Purchase: ₹{record.purchasePrice?.purchasePrice || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">Tax: {record.taxes}%</div>
        </div>
      ),
    },
    {
      title: "STOCK",
      key: "stock",
      render: (_, record) => (
        <div>
          <div className="flex items-center">
            <ShoppingCartOutlined className="mr-1" />
            <span
              className={`font-medium ${
                record.stock?.openingQty < record.stock?.minimumStock
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {record.stock?.openingQty || 0} {record.unit?.baseUnit}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Min Stock: {record.stock?.minimumStock || 0}
          </div>
          <div className="text-xs text-gray-500">
            Location: {record.stock?.location || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "LAST UPDATED",
      key: "lastUpdated",
      render: (_, record) => (
        <div className="text-gray-600">
          {new Date(record.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_, record) => (
        <Dropdown overlay={itemActionMenu(record)} trigger={["click"]}>
          <Button type="text" className="border-none" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

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

  console.log(selectedRecord, "selecetd record");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="shadow-crisp">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Items</h1>
            <p className="text-gray-500">Manage your inventory items</p>
          </div>
          <Space size="middle">
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search items"
              className="w-64"
              allowClear
            />
            <Tooltip title="Add New Item">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/items/add-item")}
              >
                Add Item
              </Button>
            </Tooltip>
          </Space>
        </div>

        <Table
          dataSource={items}
          columns={columns}
          rowKey="_id"
          pagination={{
            total: items.length,
            pageSize: 10,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="mt-4"
        />
      </Card>

      <ItemDetailsModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default Items;
