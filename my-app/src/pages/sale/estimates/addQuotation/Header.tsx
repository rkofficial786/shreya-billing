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
      referenceNumber: option.referenceNumber,
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4 gap-10">
        <Popconfirm
          title="Are you Sure to go back?"
          onConfirm={() => navigate("/sale/quotation")}
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
            optionFilterProp="children"
            onChange={handleCustomerSelect}
          >
            <Option value="customer1">Customer 1</Option>
            <Option value="customer2">Customer 2</Option>
          </FloatingLabelSelect>
        </Form.Item>

        <Form.Item   className="mb-0" name="referenceNumber" >
          <FloatingLabelInput className="mb-0" label="Reference Number" />
        </Form.Item>

        <Form.Item
          name="invoiceDate"
         
          className="mb-0"
          initialValue={initialData.invoiceDate}
          rules={[{ required: true, message: "Please select invoice date" }]}
        >
          <DatePicker  placeholder="Invoice Date" className="w-full py-3 mb-0" />
        </Form.Item> 

        <Form.Item
          name="stateOfSupply"
            className="mb-0"
          rules={[{ required: true, message: "Please select state of supply" }]}
        >
          <FloatingLabelSelect label="State of Supply"   className="mb-0" placeholder="Select state">
            <Option value="state1">State 1</Option>
            <Option value="state2">State 2</Option>
          </FloatingLabelSelect>
        </Form.Item>
      </div>
    </>
  );
};
