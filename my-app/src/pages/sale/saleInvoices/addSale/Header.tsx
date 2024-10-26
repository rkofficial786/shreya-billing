import React from "react";
import { Form, Switch, Space, DatePicker, Select, Popconfirm } from "antd";
import {
  FloatingLabelSelect,
  FloatingLabelInput,
} from "../../../../component/input";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export const SalesFormHeader = ({ isCash, setIsCash, initialData, form }) => {
  const navigate = useNavigate();

  // Handler for customer selection
  const handleCustomerSelect = (value, option) => {
    form.setFieldsValue({
      customerName: value,
      phoneNumber: option.phoneNumber // Assuming phone number is part of the option data
    });
  };

  return (
    <>
      <div className="flex justify-between mb-4 gap-10">
        <Space>
          <span>Credit</span>
          <Switch checked={isCash} onChange={(checked) => setIsCash(checked)} />
          <span>Cash</span>
        </Space>

        <Popconfirm
          title="Are you Sure to go back?"
          onConfirm={() => navigate("/sale/invoices")}
        >
          <X className="cursor-pointer" />
        </Popconfirm>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item
          name="customerName"
          label="Search by Name/Phone"
          rules={[{ required: true, message: "Please select a customer" }]}
        >
          <FloatingLabelSelect
            showSearch
            placeholder="Select customer"
            optionFilterProp="children"
            onChange={handleCustomerSelect}
          >
            <Option value="customer1">Customer 1</Option>
            <Option value="customer2">Customer 2</Option>
          </FloatingLabelSelect>
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone No."
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number",
            },
          ]}
        >
          <FloatingLabelInput placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="invoiceNumber"
          label="Invoice Number"
          initialValue={initialData.invoiceNumber}
        >
          <FloatingLabelInput disabled />
        </Form.Item>

        <Form.Item
          name="invoiceDate"
          label="Invoice Date"
          initialValue={initialData.invoiceDate}
          rules={[{ required: true, message: "Please select invoice date" }]}
        >
          <DatePicker className="w-full py-3" />
        </Form.Item>

        <Form.Item
          name="stateOfSupply"
          label="State of Supply"
          rules={[{ required: true, message: "Please select state of supply" }]}
        >
          <FloatingLabelSelect placeholder="Select state">
            <Option value="state1">State 1</Option>
            <Option value="state2">State 2</Option>
          </FloatingLabelSelect>
        </Form.Item>
      </div>
    </>
  );
};