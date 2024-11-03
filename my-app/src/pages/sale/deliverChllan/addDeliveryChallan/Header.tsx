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
      phoneNumber: option.phoneNumber,
      challanNumber: option.challanNumber,
    });
  };

  return (
    <>
      <div className="flex justify-between mb-4 gap-10">
        <h3 className="text-2xl">Delivery Challan</h3>
        <Popconfirm
          title="Are you Sure to go back?"
          onConfirm={() => navigate("/sale/delivery-challan")}
        >
          <X className="cursor-pointer" />
        </Popconfirm>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Item
          name="customerName"
          className="mb-0"
          rules={[{ required: true, message: "Please select a customer" }]}
        >
          <FloatingLabelSelect
            className="mb-0"
            showSearch
            label="Search by Name/Phone"
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
           className="mb-0"
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number",
            },
          ]}
        >
          <FloatingLabelInput  className="mb-0" label="Phone No." />
        </Form.Item>

        <Form.Item  className="mb-0" name="challanNumber">
          <FloatingLabelInput  className="mb-0" label="Challan No." />
        </Form.Item>

        <Form.Item  className="mb-0"
          name="invoiceDate"
          initialValue={initialData.invoiceDate}
          rules={[{ required: true, message: "Please select Order date" }]}
        >
          <DatePicker  placeholder="Invoice Date" className="w-full py-3 mb-0" />
        </Form.Item>

        <Form.Item
         className="mb-0"
          name="stateOfSupply"
          rules={[{ required: true, message: "Please select state of supply" }]}
        >
          <FloatingLabelSelect
           className="mb-0"
            label="State of Supply"
            placeholder="Select state"
          >
            <Option value="state1">State 1</Option>
            <Option value="state2">State 2</Option>
          </FloatingLabelSelect>
        </Form.Item>
      </div>
    </>
  );
};
