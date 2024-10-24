import { Button, Divider, Form } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
} from "../../../component/input";

interface BasicDetailsProps {
  onUnitClick: () => void;
  generateRandomCode: any;
}

export const BasicDetails = ({
  onUnitClick,
  generateRandomCode,
}: BasicDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Form.Item
        name="itemName"
        label="Item Name"
        rules={[{ required: true, message: "Please enter item name" }]}
      >
        <FloatingLabelInput label="Enter item name" />
      </Form.Item>

      <div className="flex gap-4">
        <Form.Item name="itemHSN" label="Item HSN" className="flex-1">
          <FloatingLabelInput
            label="Search HSN"
            suffix={<SearchOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item name="unit" label="Unit" className="flex-1">
          <FloatingLabelInput
            label="Select Unit"
            readOnly
            onClick={onUnitClick}
            suffix={
              <Button type="link" className="p-0 h-auto" onClick={onUnitClick}>
                Select Unit
              </Button>
            }
          />
        </Form.Item>
      </div>

      <Form.Item name="category" label="Category">
        <FloatingLabelSelect
          placeholder="Select category"
          allowClear
          showSearch
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider className="my-2" />
              <Button
                type="link"
                icon={<PlusOutlined />}
                className="text-gray-600"
              >
                Add New Category
              </Button>
            </div>
          )}
        />
      </Form.Item>

      <Form.Item name="itemCode" label="Item Code">
        <FloatingLabelInput
          label="Enter code"
          className="py-2"
          suffix={
            <Button
              type="link"
              className="p-0 h-auto"
              onClick={generateRandomCode}
            >
              Assign Code
            </Button>
          }
        />
      </Form.Item>
    </div>
  );
};
