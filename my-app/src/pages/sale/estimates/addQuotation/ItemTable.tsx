import React, { useEffect } from "react";
import { Table, Button, InputNumber, Radio, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
} from "../../../../component/input";
import { useDispatch, useSelector } from "react-redux";
import { getAllItems } from "../../../../store/items";
import { useNavigate } from "react-router-dom";
import FloatingLabelSelectWithAddItem from "./FloatItemSelect";

const { Option } = Select;

export const ItemsTable = ({
  items,

  setItems,
  handleDeleteRow,
  calculateTaxAmount,
  calculateFinalAmount,
}) => {
  const dispatch = useDispatch<any>();
  const { items: saleItems } = useSelector((state: any) => state.items);
  const navigate = useNavigate();
  useEffect(() => {
    const callGetAllItems = async () => {
      await dispatch(getAllItems());
    };
    callGetAllItems();
  }, []);

  // Handler for item selection

  const handleItemChange = (key, field, value) => {
    console.log(key, value, field, "key value fields");
    // First find the item index
    const itemIndex = items.findIndex((item) => item.key === key);

    if (itemIndex === -1) {
      console.warn(`Item with key ${key} not found`);
      return;
    }

    // Create a new array with the updated item
    const updatedItems = [...items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      [field]: value,
    };

    setItems(updatedItems);
  };

  // Modified handleItemSelect to work with the new handleItemChange
  const handleItemSelect = (value, itemKey) => {
    const selectedItem = saleItems.find((item) => item._id === value);

    if (selectedItem) {
      // Update all fields at once to prevent multiple rerenders
      const itemIndex = items.findIndex((item) => item.key === itemKey);
      if (itemIndex === -1) return;

      const updatedItems = [...items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        id: selectedItem._id,
        item: selectedItem.name,
        quantity: selectedItem.stock.openingQty,
        unit: selectedItem.unit.baseUnit,
        price: selectedItem.salePrice.salePrice,
        priceType: selectedItem.salePrice.taxType,
        tax: `IGST@${selectedItem.taxes}%`,
      };

      setItems(updatedItems);
    }
  };
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "ITEM",
      dataIndex: "item",
      render: (_, record) => (
        <FloatingLabelSelectWithAddItem
        label="Select item"
        className="min-w-[200px] relative top-2"
        value={record.id || undefined}
        onChange={(value) => {
          if (value === 'add-new') {
            navigate('/items/add-item');
            return;
          }
          handleItemSelect(value, record.key);
        }}
        items={saleItems}
        onAddItem={(inputValue) => {
          // You can either navigate to the add item page with the input value
          navigate(`/items/add-item?name=${encodeURIComponent(inputValue)}`);
          // Or handle the new item creation in any other way you prefer
        }}
      />
      ),
    },
    {
      title: "QTY",
      dataIndex: "quantity",
      width: 100,
      render: (_, record) => (
        <InputNumber
          min={1}
          className="py-2"
          value={record.quantity}
          onChange={(value) => handleItemChange(record.key, "quantity", value)}
        />
      ),
    },
    {
      title: "UNIT",
      dataIndex: "unit",
      width: 120,
      render: (_, record) => (
        <FloatingLabelSelect
          value={record.unit}
          onChange={(value) => handleItemChange(record.key, "unit", value)}
        >
          <Option value="Box">Box</Option>
          <Option value="Unit">Unit</Option>
          <Option value="NONE">NONE</Option>
        </FloatingLabelSelect>
      ),
    },
    {
      title: "PRICE/UNIT",
      dataIndex: "price",
      width: 200,
      render: (_, record) => (
        <div className="flex items-start gap-2">
          <InputNumber
            className="w-32 py-2"
            value={record.price}
            onChange={(value) => handleItemChange(record.key, "price", value)}
          />
          <Radio.Group
            value={record.priceType}
            onChange={(e) =>
              handleItemChange(record.key, "priceType", e.target.value)
            }
            size="small"
            className="flex flex-col gap-1"
          >
            <Radio value="withTax" className="text-xs">
              With Tax
            </Radio>
            <Radio value="withoutTax" className="text-xs">
              Without Tax
            </Radio>
          </Radio.Group>
        </div>
      ),
    },
    {
      title: "TAX",
      dataIndex: "tax",
      width: 200,
      render: (_, record) => (
        <div className="space-y-2">
          <FloatingLabelSelect
            className="w-full"
            value={record.tax}
            onChange={(value) => handleItemChange(record.key, "tax", value)}
          >
            <Option value="NONE">NONE</Option>
            <Option value="IGST@0.25%">IGST@0.25%</Option>
            <Option value="IGST@5%">IGST@5%</Option>
            <Option value="IGST@12%">IGST@12%</Option>
            <Option value="IGST@18%">IGST@18%</Option>
          </FloatingLabelSelect>
          {record.tax !== "NONE" && (
            <div className="text-xs text-gray-500">
              Tax Amount: ₹{calculateTaxAmount(record).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      width: 120,
      render: (_, record) => (
        <div>
          <div className="font-medium">
            ₹{calculateFinalAmount(record).toFixed(2)}
          </div>
          {record.tax !== "NONE" && record.priceType === "withoutTax" && (
            <div className="text-xs text-gray-500">
              Base: ₹{(record.quantity * record.price).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "",
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(record.key)}
        />
      ),
    },
  ];

  return (
    <div className=" ">
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        className="my-4"
      />
    </div>
  );
};
