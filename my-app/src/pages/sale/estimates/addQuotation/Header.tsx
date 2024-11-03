import React, { useEffect } from "react";
import { Form, Switch, Space, DatePicker, Select, Popconfirm } from "antd";
import {
  FloatingLabelSelect,
  FloatingLabelInput,
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

  // Handler for customer selection
  const handleCustomerSelect = (value, option) => {
    // Find the selected party
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

        <Form.Item className="mb-0" name="referenceNumber">
          <FloatingLabelInput className="mb-0" label="Reference Number" />
        </Form.Item>

        <Form.Item
          name="invoiceDate"
          className="mb-0"
          initialValue={initialData.invoiceDate}
          rules={[{ required: true, message: "Please select invoice date" }]}
        >
          <DatePicker placeholder="Invoice Date" className="w-full py-3 mb-0" />
        </Form.Item>

        <Form.Item
          name="stateOfSupply"
          className="mb-0"
          rules={[{ required: true, message: "Please select state of supply" }]}
        >
          <FloatingLabelSelect
            label="State of Supply"
            className="mb-0"
            placeholder="Select state"
          >
            <Option value="karnataka">Karnataka</Option>
            <Option value="maharashtra">Maharashtra</Option>
            {/* Add other states as needed */}
          </FloatingLabelSelect>
        </Form.Item>
      </div>
    </>
  );
};
