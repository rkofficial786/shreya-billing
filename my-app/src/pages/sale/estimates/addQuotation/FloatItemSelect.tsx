//@ts-nocheck
import { Select } from "antd";
import React from "react";
import { FloatingLabelSelect } from "../../../../component/input";
import { useNavigate } from "react-router-dom";

const FloatingLabelSelectWithAddItem = ({
  label,
  value,
  onChange,
  items,
  onAddItem,
  className = "",
}) => {
  const navigate = useNavigate();
  // Custom render for empty state/no matches
  const customNotFound = (input) => {
    return (
      <div
        className="p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onAddItem(input)}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium">Add new item:</p>
            <p className="text-xs text-gray-600">{input}</p>
          </div>
          <div className="text-blue-500">+</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <FloatingLabelSelect
        value={value}
        label={"Item Name"}
        onChange={onChange}
        className="w-full"
        showSearch
        filterOption={(input, option) => {
          // Don't filter the "Add New Item" option
          if (option.value === "add-new") return true;

          const item = items.find((i) => i._id === option?.value);
          return (
            item?.name?.toLowerCase().includes(input.toLowerCase()) ||
            item?.itemCode?.includes(input)
          );
        }}
        dropdownRender={(menu) => (
          <div>
            <div
              className="p-1 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => navigate("/items/add-item")}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-500">
                    + Add New Item
                  </p>
                </div>
              </div>
            </div>
            {menu}
          </div>
        )}
        notFoundContent={customNotFound}
      >
        {/* Existing items */}
        {items.map((item) => (
          <Select.Option key={item._id} value={item._id}>
            {item.name} ({item.itemCode})
          </Select.Option>
        ))}
      </FloatingLabelSelect>
    </div>
  );
};

export default FloatingLabelSelectWithAddItem;
