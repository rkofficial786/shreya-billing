// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllItems } from "../../store/items";
import {
  Table,
  Input,
  Button,
  Space,
  Tooltip,
  Card,
  Tag,
  Image,
  Radio,
  Badge,
  Popover,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  StarFilled,
  InfoCircleOutlined,
  TagOutlined,
  CalendarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import TransactionHeader from "../../component/TransactionHeader";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const BASE_URL = "https://www.shreyacollection.in/api";

interface ShreyaProduct {
  _id: string;
  name: string;
  itemCode: string;
  image?: string;
  description: string;
  color: string;
  material: string[];
  washCare: string;
  rating?: {
    star: number;
    ratedBy: number;
  };
  price: {
    actual: number;
    offer: number;
    discount: number;
  };
  stock: number;
  sizes?: Array<{
    size: string;
    stock: number;
    sellCount: number;
    offerPrice: number;
    comboPrice: number;
  }>;
  categories: Array<{
    _id: string;
    name: string;
  }>;
  features: {
    feature: boolean;
    latest: boolean;
    bestseller: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  itemCode: string;
  hsn: string;
  unit: {
    baseUnit: string;
  };
  salePrice: {
    salePrice: number;
    discountPrice: number;
  };
  purchasePrice: {
    purchasePrice: number;
  };
  stock: {
    openingQty: number;
    minimumStock: number;
    location: string;
  };
  taxes: number;
}

const Inventory: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [activeSource, setActiveSource] = useState<"shreya" | "inventory">(
    "shreya"
  );
  const [shreyaItems, setShreyaItems] = useState<ShreyaProduct[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [shreyaPagination, setShreyaPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [inventoryPagination, setInventoryPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchShreyaData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/products?page=${page}&limit=${pageSize}`
      );
      const { products, totalProducts, currentPage } = response.data;

      const normalizedProducts: ShreyaProduct[] = products.map((item) => ({
        _id: item._id,
        name: item.name,
        itemCode: item.sku,
        image: item.img?.[0],
        description: item.description,
        color: item.color,
        material: item.material || [],
        washCare: item.washCare,
        rating: item.rating,
        price: {
          actual: item.actualPrice,
          offer: item.sizes?.[0]?.offerPrice || item.actualPrice,
          discount: item.sizes?.[0]?.offerPrice
            ? ((item.actualPrice - item.sizes[0].offerPrice) /
                item.actualPrice) *
              100
            : 0,
        },
        stock: item.sizes?.[0]?.stock || 0,
        sizes: item.sizes,
        categories: item.categories || [],
        features: {
          feature: item.featureProduct,
          latest: item.latestProduct,
          bestseller: item.bestsellerProduct,
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      setShreyaItems(normalizedProducts);
      setShreyaPagination({
        ...shreyaPagination,
        current: currentPage,
        total: totalProducts,
      });
    } catch (error) {
      console.error("Error fetching Shreya data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const { payload } = await dispatch(getAllItems());

      if (payload.data.success) {
        const items = payload.data.items;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedItems = items.slice(startIndex, endIndex);

        setInventoryItems(paginatedItems);
        setInventoryPagination({
          ...inventoryPagination,
          current: page,
          total: items.length,
        });
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSource === "shreya") {
      fetchShreyaData(shreyaPagination.current);
    } else {
      fetchInventoryData(inventoryPagination.current);
    }
  }, [activeSource]);

  const handleTableChange = (pagination: any) => {
    if (activeSource === "shreya") {
      fetchShreyaData(pagination.current, pagination.pageSize);
    } else {
      fetchInventoryData(pagination.current, pagination.pageSize);
    }
  };

  const getFilteredItems = () => {
    const items = activeSource === "shreya" ? shreyaItems : inventoryItems;

    if (!searchText) return items;

    const searchLower = searchText.toLowerCase();

    if (activeSource === "shreya") {
      return shreyaItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.itemCode.toLowerCase().includes(searchLower)
      );
    } else {
      return inventoryItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.itemCode.toLowerCase().includes(searchLower)
      );
    }
  };

  const shreyaColumns = [
    {
      title: "Basic Info",
      key: "basicInfo",
      fixed: "left",
      width: 300,
      render: (_, record: ShreyaProduct) => (
        <div className="flex gap-3">
          {record.image ? (
            <Image
              src={`https://www.shreyacollection.in${record.image}`}
              alt={record.name}
              className="rounded"
              width={80}
              height={100}
              style={{ objectFit: "cover" }}
              fallback="/placeholder-image.jpg"
            />
          ) : (
            <div className="w-[80px] h-[100px] bg-gray-200 rounded flex items-center justify-center">
              No IMG
            </div>
          )}
          <div className="flex flex-col justify-between py-1">
            <div>
              <Paragraph strong className="text-base mb-0">
                {record.name}
              </Paragraph>
              <Paragraph type="secondary" className="text-xs mb-0">
                SKU: {record.itemCode}
              </Paragraph>
              {record.rating && (
                <div className="text-sm text-green-500 flex items-center gap-1">
                  <StarFilled />{" "}
                  <span className="text-black">
                    {" "}
                    {record.rating.star} ({record.rating.ratedBy}){" "}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-1 flex-wrap">
              {record.features.feature && <Tag color="blue">Featured</Tag>}
              {record.features.latest && <Tag color="green">Latest</Tag>}
              {record.features.bestseller && <Tag color="gold">Bestseller</Tag>}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category & Details",
      key: "details",
      width: 200,
      render: (_, record: ShreyaProduct) => (
        <div className="space-y-2">
          <div>
            {record.categories?.map((cat) => (
              <Tag key={cat._id} icon={<TagOutlined />}>
                {cat.name}
              </Tag>
            ))}
          </div>
          <Space direction="vertical" size="small">
            <Paragraph className="mb-0">
              <Text type="secondary">Color:</Text> {record.color}
            </Paragraph>
            <Paragraph className="mb-0">
              <Text type="secondary">Material:</Text>{" "}
              {record.material?.join(", ")}
            </Paragraph>
          </Space>
        </div>
      ),
    },
    {
      title: "Description",
      key: "description",
      width: 200,
      render: (_, record: ShreyaProduct) => (
        <Popover
          content={
            <div style={{ maxWidth: "300px" }}>
              <Paragraph
                className="text-sm text-gray-700"
                style={{
                  margin: 0,
                  lineHeight: "1.6",
                  whiteSpace: "pre-line",
                }}
              >
                {record.description}
              </Paragraph>
            </div>
          }
          title={
            <div className="flex items-center gap-2">
              <InfoCircleOutlined className="text-blue-500" />
              <Title level={5} style={{ margin: 0 }}>
                Product Details
              </Title>
            </div>
          }
          trigger="click"
          placement="left"
          overlayStyle={{ maxWidth: "350px" }}
          overlayInnerStyle={{
            padding: "16px",
          }}
        >
          <div className="cursor-pointer hover:bg-gray-50 p-1 rounded">
            <Paragraph ellipsis={{ rows: 2 }} className="mb-0 text-sm">
              {record.description}
            </Paragraph>
            <Text type="link" className="text-xs">
              Read more
            </Text>
          </div>
        </Popover>
      ),
    },
    {
      title: "Pricing",
      key: "pricing",
      width: 180,
      render: (_, record: ShreyaProduct) => (
        <Space direction="vertical" size="small">
          <Title level={4} className="mb-0">
            ₹{record.price.offer}
          </Title>
          {record.price.discount > 0 && (
            <>
              <Text type="secondary" delete>
                ₹{record.price.actual}
              </Text>
              <Tag color="green">{record.price.discount.toFixed(0)}% OFF</Tag>
            </>
          )}
          {record.sizes?.[0]?.comboPrice && (
            <Text type="secondary">
              Combo Price: ₹{record.sizes[0].comboPrice}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Stock & Size",
      key: "stockSize",
      width: 150,
      render: (_, record: ShreyaProduct) => (
        <Space direction="vertical">
          <Badge
            status={record.stock > 0 ? "success" : "error"}
            text={
              record.stock > 0 ? `${record.stock} in stock` : "Out of stock"
            }
          />
          {record.sizes?.[0] && (
            <div>
              <Tag color="purple">{record.sizes[0].size}</Tag>
              {record.sizes[0].sellCount > 0 && (
                <Text type="secondary" className="flex items-center gap-1">
                  <ShoppingOutlined /> Sold: {record.sizes[0].sellCount}
                </Text>
              )}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: "Care Instructions",
      key: "care",
      width: 150,
      render: (_, record: ShreyaProduct) => (
        <Popover
          content={
            <div style={{ maxWidth: "300px" }}>
              {record.washCare.split(". ").map((instruction, index) => (
                <Paragraph key={index} className="mb-2">
                  • {instruction.trim()}
                </Paragraph>
              ))}
            </div>
          }
          title={<Title level={5}>Wash Care Instructions</Title>}
          trigger="click"
          placement="left"
          overlayStyle={{ maxWidth: "350px" }}
          overlayInnerStyle={{ padding: "16px" }}
        >
          <Button type="link" icon={<InfoCircleOutlined />} className="px-0">
            Care Instructions
          </Button>
        </Popover>
      ),
    },
    {
      title: "Dates",
      key: "dates",
      width: 180,
      render: (_, record: ShreyaProduct) => (
        <Space direction="vertical" size="small">
          <Text type="secondary">
            <CalendarOutlined className="mr-2" />
            Created: {new Date(record.createdAt).toLocaleDateString()}
          </Text>
          <Text type="secondary">
            <CalendarOutlined className="mr-2" />
            Updated: {new Date(record.updatedAt).toLocaleDateString()}
          </Text>
        </Space>
      ),
    },
  ];

  const inventoryColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
      sorter: (a: InventoryItem, b: InventoryItem) =>
        a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: "Item Code",
      dataIndex: "itemCode",
      key: "itemCode",
      width: 100,
      ellipsis: true,
    },
    {
      title: "HSN",
      dataIndex: "hsn",
      key: "hsn",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Unit",
      dataIndex: ["unit", "baseUnit"],
      key: "unit",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Sale Price",
      key: "salePrice",
      width: 120,
      render: (_, record: InventoryItem) => (
        <Space direction="vertical" size={0}>
          <Text strong>₹{record.salePrice?.salePrice}</Text>
          {record.salePrice?.discountPrice > 0 && (
            <Text type="success">{record.salePrice.discountPrice}% off</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Stock",
      key: "stock",
      width: 120,
      render: (_, record: InventoryItem) => (
        <Tooltip title={`Location: ${record.stock?.location}`}>
          <Space direction="vertical" size={0}>
            <Text>{record.stock?.openingQty}</Text>
            <Text type="secondary">Min: {record.stock?.minimumStock}</Text>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: "Tax",
      dataIndex: "taxes",
      key: "taxes",
      width: 80,
      render: (tax: number) => `${tax}%`,
    },
  ];

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-4">
           <div className="-ml-6"> <TransactionHeader  title="Inventory Management" /></div>
            <Radio.Group
              value={activeSource}
              onChange={(e) => setActiveSource(e.target.value)}
              size="large"
              className="bg-gray-100 p-1 rounded-lg"
            >
              <Radio.Button value="shreya" className="px-6">
                Shreya Products
              </Radio.Button>
              <Radio.Button value="inventory" className="px-6">
                Inventory Items
              </Radio.Button>
            </Radio.Group>
          </div>

          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder={`Search ${
                activeSource === "shreya" ? "products" : "inventory"
              }...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
              size="large"
            />
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => {
                if (activeSource === "shreya") {
                  fetchShreyaData(shreyaPagination.current);
                } else {
                  fetchInventoryData(inventoryPagination.current);
                }
              }}
              size="large"
            >
              Refresh
            </Button>
          </Space>
        </div>

        <Table
          columns={activeSource === "shreya" ? shreyaColumns : inventoryColumns}
          dataSource={getFilteredItems()}
          rowKey="_id"
          loading={loading}
          pagination={
            activeSource === "shreya"
              ? {
                  ...shreyaPagination,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} items`,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  position: ["bottomRight"],
                }
              : {
                  ...inventoryPagination,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total} items`,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  position: ["bottomRight"],
                }
          }
          onChange={handleTableChange}
          scroll={{ x: 1800 }}
          sticky
          className="inventory-table"
          size="middle"
          rowClassName={(record) => {
            if (activeSource === "shreya") {
              return (record as ShreyaProduct).stock === 0 ? "bg-red-50" : "";
            }
            // Since we know it's inventory if not shreya
            const inventoryRecord = record as InventoryItem;
            return inventoryRecord.stock.openingQty === 0 ? "bg-red-50" : "";
          }}
        />

        <style>{`
          .inventory-table .ant-table-cell {
            vertical-align: top;
          }
          .bg-red-50 {
            background-color: #fff1f0;
          }
        `}</style>
      </div>
    </Card>
  );
};

export default Inventory;
