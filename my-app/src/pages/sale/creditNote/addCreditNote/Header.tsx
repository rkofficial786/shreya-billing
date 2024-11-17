import React, { useEffect } from "react";
import {
  Form,
  Switch,
  Space,
  DatePicker,
  Select,
  Popconfirm,
  Input,
} from "antd";
import {
  FloatingLabelSelect,
  FloatingLabelInput,
  FloatingLabelInputNumber,
} from "../../../../component/input";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllParties } from "../../../../store/parties";

const { Option } = Select;

export const SalesFormHeader = ({ isCash, setIsCash, initialData, form }) => {
  const navigate = useNavigate();
  const { parties } = useSelector((state: any) => state.party);
  const dispatch = useDispatch<any>();

  const handleCustomerSelect = (value, option) => {
    const selectedParty = parties.find((party) => party._id === value);

    if (selectedParty) {
      form.setFieldsValue({
        customerName: value, // This will be the _id
        phoneNumber: selectedParty.phone,
        // You might want to generate or set reference number differently
        referenceNumber: `REF-${Date.now()}`,
        // If you need to set other fields based on party data:
        stateOfSupply: selectedParty.gstAndAddress?.state || "",
      });
    }
  };

  useEffect(() => {
    const callGetAllParty = async () => {
      await dispatch(getAllParties());
    };
    callGetAllParty();
  }, []);

  return (
    <>
      <div className="flex justify-between mb-4 gap-10">
        <div className="flex items-center gap-8">
          <h3 className="text-2xl">Credit Note</h3>
          {/* <Space>
            <span>Credit</span>
            <Switch
              checked={isCash}
              onChange={(checked) => setIsCash(checked)}
            />
            <span>Cash</span>
          </Space> */}
        </div>

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
          className="mb-0"
          // label="Search by Name/Phone"
          rules={[{ required: true, message: "Please select a customer" }]}
        >
          <FloatingLabelSelect
            className="mb-0"
            showSearch
            label="Search by Name/Phone"
            optionFilterProp="children"
            onChange={handleCustomerSelect}
            filterOption={(input, option) => {
              const party = parties.find((p) => p._id === option?.value);
              return (
                party?.name?.toLowerCase().includes(input.toLowerCase()) ||
                party?.phone?.includes(input)
              );
            }}
          >
            {parties.map((party) => (
              <Option
                key={party._id}
                value={party._id}
                phoneNumber={party.phone}
              >
                {party.name} - {party.phone}
              </Option>
            ))}
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
          <FloatingLabelInput label="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="returnNumber"
          className="mb-0 "
          initialValue={initialData.returnNumber}
        >
          <FloatingLabelInputNumber className="py-3" label="Return Number" />
        </Form.Item>

        {/* <Form.Item 
  name="returnNumber" 
  initialValue={initialData.returnNumber}
  // Remove default label alignment
  labelCol={{ flex: '0 0 auto' }}
  wrapperCol={{ flex: '1 1 auto' }}
  // Force horizontal layout
  labelAlign="left"
  // Important: this makes the layout horizontal
  className="!flex !flex-row !items-center mb-1"
  colon={false}
  label={<span className="text-xs text-gray-600 whitespace-nowrap">Return Number</span>}
>
  <Input               
    className="border-0 border-b border-gray-200 rounded-none focus:shadow-none hover:border-b hover:border-gray-400 transition-colors text-xs py-1"
    placeholder="Enter return number"
  />
</Form.Item> */}

        <Form.Item className="mb-0" name="invoiceNumber">
          <FloatingLabelInput label="Invoice Number" />
        </Form.Item>

        <Form.Item
          name="invoiceDate"
          className="mb-0"
          initialValue={initialData.invoiceDate}
          rules={[{ required: true, message: "Please select invoice date" }]}
        >
          <DatePicker className="w-full py-3" />
        </Form.Item>

        <Form.Item
          name="stateOfSupply"
          className="mb-0"
          rules={[{ required: true, message: "Please select state of supply" }]}
        >
          <FloatingLabelSelect label="Select state of supply">
            <Option value="state1">State 1</Option>
            <Option value="state2">State 2</Option>
          </FloatingLabelSelect>
        </Form.Item>
      </div>
      {/* border-b border-gray-200 rounded-none hover:border-b hover:border-gray-300 */}
      <div></div>
    </>
  );
};
