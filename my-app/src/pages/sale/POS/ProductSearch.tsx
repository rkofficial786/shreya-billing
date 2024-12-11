import React from "react";
import { Button, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const ProductSearch = ({
  searchText,
  handleSearch,
  searchResults,
  addProduct,
  parties,
  handleCustomerSelect,
  saved,
  handleClear,
}) => {
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
              <div className="font-medium">₹{product?.price?.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
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
        {parties.map((customer) => (
          <Option key={customer._id} value={customer._id}>
            {customer.name} - {customer.phone}
          </Option>
        ))}
      </Select>
      {saved && (
        <Button
          onClick={handleClear}
          className="py-5 "
          variant="filled"
        
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default ProductSearch;
