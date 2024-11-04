import { Button, Card, Divider, Form } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
} from "../../../component/input";
import Barcode from "react-barcode";
import { useState } from "react";

const BarcodeDisplay: React.FC<{
  itemCode?: string;
  itemDetails?: any;
}> = ({ itemCode, itemDetails }) => {
  if (!itemCode) return null;

  return (
    
      <div className="mt-4 flex">
        <Barcode value={itemCode} />
      </div>
    
  );
};

export const BasicDetails = ({
  onUnitClick,
  generateRandomCode,
  form,
}: any) => {
  const [itemDetails, setItemDetails] = useState<any>(null);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setItemDetails(values);
  };

  const setBarCode = () => {
    generateRandomCode();
    handleFormChange();
  };
  return (
    <div className="grid grid-cols-2 gap-6">
      <Form.Item
        name="itemName"
        className="mb-0"
        rules={[{ required: true, message: "Please enter item name" }]}
      >
        <FloatingLabelInput label="Enter item name" className="mb-0" />
      </Form.Item>

      <div className="flex gap-4">
        <Form.Item name="itemHSN" className="flex-1 mb-0">
          <FloatingLabelInput
            className="mb-0"
            label="Search HSN"
            suffix={<SearchOutlined className="text-gray-400" />}
          />
        </Form.Item>

        <Form.Item name="unit" className="flex-1 mb-0">
          <FloatingLabelInput
            label="Select Unit"
            readOnly
            className="mb-0"
            onClick={onUnitClick}
            suffix={
              <Button type="link" className="p-0 h-auto" onClick={onUnitClick}>
                Select Unit
              </Button>
            }
          />
        </Form.Item>
      </div>

      <Form.Item name="category" className="mb-0">
        <FloatingLabelSelect
          placeholder="Select category"
          allowClear
          className="mb-0"
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

      <Form.Item name="itemCode" className="mb-0">
        <FloatingLabelInput
          label="Enter code"
          className=" mb-0"
          suffix={
            <Button
              type="link"
              variant="link"
              className="p-0 h-auto "
              onClick={setBarCode}
            >
              Assign Code
            </Button>
          }
        />
      </Form.Item>
      <BarcodeDisplay
        itemCode={itemDetails?.itemCode}
        itemDetails={itemDetails}
      />
    </div>
  );
};
