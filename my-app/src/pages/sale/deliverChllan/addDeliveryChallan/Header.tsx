import React, { useEffect } from "react";
import { Form, Switch, Space, DatePicker, Select, Popconfirm } from "antd";
import {
  FloatingLabelSelect,
  FloatingLabelInput,
} from "../../../../component/input";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllParties } from "../../../../store/parties";
import { useDispatch, useSelector } from "react-redux";

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
          <FloatingLabelInput className="mb-0" label="Phone No." />
        </Form.Item>

        <Form.Item className="mb-0" name="challanNumber">
          <FloatingLabelInput className="mb-0" label="Challan No." />
        </Form.Item>

        <Form.Item
          className="mb-0"
          name="challanDate"
          initialValue={initialData.challanDate}
          rules={[{ required: true, message: "Please select Order date" }]}
        >
          <DatePicker placeholder="Challan Date" className="w-full py-3 mb-0" />
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
