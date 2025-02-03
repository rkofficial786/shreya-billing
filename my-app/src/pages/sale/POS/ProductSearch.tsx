import React from "react";
import { Button, Input, Select, Form, Card, Divider, Space } from "antd";
import { SearchOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import PaymentTypeSelector from "./PaymentType";

const { Search } = Input;
const { Option } = Select;

interface ProductSearchProps {
  searchText: string;
  handleSearch: (value: string) => void;
  searchResults: any[];
  addProduct: (product: any) => void;
  parties: any[];
  handleCustomerSelect: (customerId: string) => void;
  saved: boolean;
  handleClear: () => void;
  paymentType: "cash" | "credit";
  setPaymentType: (type: "cash" | "credit") => void;
  onAddCashCustomer: (values: { name: string; phone: string }) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchText,
  handleSearch,
  searchResults,
  addProduct,
  parties,
  handleCustomerSelect,
  saved,
  handleClear,
  paymentType,
  setPaymentType,
  onAddCashCustomer,
}) => {
  const [form] = Form.useForm();

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
              <div className="font-medium">₹{product?.price?.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleCashCustomerSubmit = (values) => {
    onAddCashCustomer(values);
    form.resetFields();
  };

  return (
    <Card className="mb-4 shadow-sm">
      <div className="space-y-2">
        {/* Top Section: Payment Type and Clear Button */}
        <div className="flex items-center justify-between">
          <PaymentTypeSelector
            paymentType={paymentType}
            setPaymentType={setPaymentType}
          />
          {saved && (
            <Button onClick={handleClear} size="large" type="default">
              Clear
            </Button>
          )}
        </div>

        {/* <Divider className="my-4" /> */}

        {/* Middle Section: Product Search */}
        <div className="w-full">
          <Input
            placeholder="Search by item code or name..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400" />}
            size="large"
            className="w-full"
          />
          <SearchResultsDropdown results={searchResults} />
        </div>

        {/* Bottom Section: Customer Selection/Add */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Customer Dropdown - Always Visible */}
          <Select
            showSearch
            style={{ minWidth: 250 }}
            placeholder="Select Existing Customer"
            optionFilterProp="children"
            onChange={handleCustomerSelect}
            size="large"
            className="flex-1"
          >
            {parties.map((customer) => (
              <Option key={customer._id} value={customer._id}>
                {customer.name} - {customer.phone}
              </Option>
            ))}
          </Select>

          {/* Quick Add Customer Form */}
          {paymentType === "cash" && (
            <Form
              form={form}
              onFinish={handleCashCustomerSubmit}
              className="flex flex-1 gap-3"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
                className="mb-0 flex-1"
              >
                <Input
                  placeholder="New Customer Name"
                  size="large"
                  prefix={<UserOutlined className="text-gray-400" />}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true, message: "Phone is required" }]}
                className="mb-0 flex-1"
              >
                <Input
                  placeholder="Phone Number"
                  size="large"
                  prefix={<PhoneOutlined className="text-gray-400" />}
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="px-6"
              >
                Add New
              </Button>
            </Form>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductSearch;
