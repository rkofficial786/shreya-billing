import React, { useState } from "react";
import {
  Input,
  Select,
  Table,
  Button,
  Card,
  InputNumber,
  Typography,
  Space,
  Badge,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MinusOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  NumberOutlined,
  CreditCardOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const POS = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Dummy products data
  const products = [
    {
      id: 1,
      code: "P001",
      name: "Product 1",
      unit: "piece",
      price: 299.99,
      quantity: 1,
    },
    {
      id: 2,
      code: "P002",
      name: "Product 2",
      unit: "kg",
      price: 199.99,
      quantity: 1,
    },
  ];

  // Dummy customers data
  const customers = [
    {
      id: 1,
      name: "John Doe",
      phone: "123-456-7890",
      email: "john@example.com",
      address: "123 Main St",
      gstNo: "GST123456",
      creditLimit: 50000,
      outstandingBalance: 15000,
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "098-765-4321",
      email: "jane@example.com",
      address: "456 Oak Ave",
      gstNo: "GST789012",
      creditLimit: 75000,
      outstandingBalance: 25000,
    },
  ];

  // Search products
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = products.filter(
      (product) =>
        product.code.toLowerCase().includes(value.toLowerCase()) ||
        product.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // Add product to selected list
  const addProduct = (product) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setSearchResults([]);
    setSearchText("");
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    setSelectedCustomer(customer);
  };

  // Selected products columns
  const selectedProductColumns = [
    { title: "#", dataIndex: "id", key: "id", width: 50 },
    { title: "Item Code", dataIndex: "code", key: "code" },
    { title: "Item Name", dataIndex: "name", key: "name" },
    {
      title: "QTY",
      key: "quantity",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<MinusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity - 1)}
            disabled={record.quantity <= 1}
          />
          <InputNumber
            min={1}
            value={record.quantity}
            onChange={(value) => updateQuantity(record.id, value)}
            className="w-10"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => updateQuantity(record.id, record.quantity + 1)}
          />
        </Space>
      ),
    },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    {
      title: "Price/Unit (₹)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toFixed(2),
    },
    {
      title: "Discount (₹)",
      key: "discount",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={record.price * record.quantity}
          defaultValue={0}
          onChange={(value) => updateDiscount(record.id, value)}
          className="w-20"
        />
      ),
    },
    {
      title: "Tax Applied (₹)",
      dataIndex: "tax",
      key: "tax",
      render: (_, record) => (record.price * record.quantity * 0.18).toFixed(2),
    },
    {
      title: "Total (₹)",
      key: "total",
      render: (_, record) =>
        (
          record.price * record.quantity +
          record.price * record.quantity * 0.18 -
          (record.discount || 0)
        ).toFixed(2),
    },
  ];

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  const updateDiscount = (productId, discount) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product.id === productId ? { ...product, discount } : product
      )
    );
  };

  // Custom Search Results Dropdown
  const SearchResultsDropdown = ({ results }) => {
    if (results.length === 0 || !searchText) return null;

    return (
      <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-64 overflow-y-auto">
        {results.map((product) => (
          <div
            key={product.id}
            className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-100"
            onClick={() => addProduct(product)}
          >
            <div>
              <div className="font-medium">{product.code}</div>
              <div className="text-sm text-gray-600">{product.name}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">₹{product.price.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Products */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <Card className="mb-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search by item code or name..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<SearchOutlined />}
                size="large"
              />
              <SearchResultsDropdown results={searchResults} />
            </div>
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="Select Customer"
              optionFilterProp="children"
              onChange={handleCustomerSelect}
              size="large"
            >
              {customers.map((customer) => (
                <Option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </Option>
              ))}
            </Select>
          </div>

          {/* Selected Products Table */}
          <Table
            className="min-h-[90vh]"
            columns={selectedProductColumns}
            dataSource={selectedProducts}
            pagination={false}
            scroll={{ y: "calc(100vh - 400px)" }}
            size="middle"
          />
        </Card>
      </div>

      {/* Right side - Customer Details & Bill Summary */}
      <Card className="w-[400px] m-4 flex flex-col  justify-between h-screen">
        {selectedCustomer ? (
          <div>
            <Title level={4} className="mb-4">
              Customer Details
            </Title>
            <div className="space-y-3">
              <div className="flex flex-col">
                <Text type="secondary" className="text-xs">
                  Customer Name
                </Text>
                <Text strong className="text-base">
                  {selectedCustomer.name}
                </Text>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text type="secondary" className="text-xs">
                    Phone
                  </Text>
                  <div className="text-sm">{selectedCustomer.phone}</div>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">
                    GST No
                  </Text>
                  <div className="text-sm">{selectedCustomer.gstNo}</div>
                </div>
              </div>

              <div>
                <Text type="secondary" className="text-xs">
                  Email Address
                </Text>
                <div className="text-sm">{selectedCustomer.email}</div>
              </div>

              <div>
                <Text type="secondary" className="text-xs">
                  Billing Address
                </Text>
                <div className="text-sm">{selectedCustomer.address}</div>
              </div>

              <Divider className="my-3" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text type="secondary" className="text-xs">
                    Credit Limit
                  </Text>
                  <div className="text-sm font-medium">
                    ₹{selectedCustomer.creditLimit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">
                    Outstanding
                  </Text>
                  <div className="text-sm font-medium">
                    ₹{selectedCustomer.outstandingBalance.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">No customer selected</div>
        )}

        <div className="mt-4 border-t pt-4 self-end">
          <Title level={4}>Payment Details</Title>
          <Space direction="vertical" className="w-full">
            <Select placeholder="Payment Mode" className="w-full">
              <Option value="cash">Cash</Option>
              <Option value="card">Card</Option>
              <Option value="upi">UPI</Option>
            </Select>
            <InputNumber
              placeholder="Amount Received"
              className="w-full"
              prefix="₹"
            />
          </Space>

          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <Text>Sub Total:</Text>
              <Text>
                ₹
                {selectedProducts
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Total Tax:</Text>
              <Text>
                ₹
                {selectedProducts
                  .reduce(
                    (sum, item) => sum + item.price * item.quantity * 0.18,
                    0
                  )
                  .toFixed(2)}
              </Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Total Discount:</Text>
              <Text>
                ₹
                {selectedProducts
                  .reduce((sum, item) => sum + (item.discount || 0), 0)
                  .toFixed(2)}
              </Text>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <Text strong>Grand Total:</Text>
              <Text strong>
                ₹
                {selectedProducts
                  .reduce(
                    (sum, item) =>
                      sum +
                      item.price * item.quantity +
                      item.price * item.quantity * 0.18 -
                      (item.discount || 0),
                    0
                  )
                  .toFixed(2)}
              </Text>
            </div>
          </div>

          <Button type="primary" className="w-full mt-4" size="large">
            Save & Generate Bill
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default POS;
