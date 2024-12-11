import { useState, useEffect } from "react";
import { Button, Card, Divider, Form, Input, Modal, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
} from "../../../component/input";
import Barcode from "react-barcode";
import { useDispatch } from "react-redux";
import { createCategory, getAllCategories } from "../../../store/category";
import { hsnData } from "../../../helpers/hsn";
const { Option } = Select;
const BarcodeDisplay: React.FC<{ itemCode?: string; itemDetails?: any }> = ({
  itemCode,
  itemDetails,
}) => {
  if (!itemCode) return null;

  return (
    <div className="mt-4 flex">
      <Barcode value={itemCode} />
    </div>
  );
};

export const BasicDetails = ({ onUnitClick, generateRandomCode, form }) => {
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const dispatch = useDispatch<any>();
  const [categoryForm] = Form.useForm();
  const [filteredHSN, setFilteredHSN] = useState(hsnData);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { payload } = await dispatch(getAllCategories());
      console.log(categories, "categories");

      if (payload.data.success) {
        setCategories(payload.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setItemDetails(values);
  };

  const setBarCode = () => {
    // Get the current value of itemCode from the form
    const currentItemCode = form.getFieldValue("itemCode");

    if (!currentItemCode) {
      // If itemCode is empty, generate a random code
      const randomCode = generateRandomCode();
      form.setFieldsValue({ itemCode: randomCode });
    }

    // Update form and itemDetails
    handleFormChange();
  };

  const handleCreateCategory = async (values) => {
    console.log(values, "values");

    try {
      const { payload } = await dispatch(createCategory(values));

      if (payload.data.success) {
        setShowCategoryModal(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  // hsn
  const handleSearch = (value) => {
    // Filter the HSN data by both HSN_CD and HSN_Description
    const lowerValue = value.toLowerCase();
    const filtered = hsnData.filter(
      (item) =>
        item.HSN_CD.toLowerCase().includes(lowerValue) ||
        item.HSN_Description.toLowerCase().includes(lowerValue)
    );
    setFilteredHSN(filtered);
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
          <FloatingLabelSelect
            placeholder="Select HSN Code"
            allowClear
            className="mb-0"
            showSearch
            onSearch={handleSearch}
            filterOption={false}
            dropdownRender={(menu) => <div>{menu}</div>}
          >
            {filteredHSN.map((item) => (
              <Option key={item.HSN_CD} value={item.HSN_CD}>
                {item.HSN_CD} -{" "}
                {item.HSN_Description.length > 20
                  ? item.HSN_Description.slice(0, 20) + "..."
                  : item.HSN_Description}
              </Option>
            ))}
          </FloatingLabelSelect>
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
                onClick={() => setShowCategoryModal(true)}
              >
                Add New Category
              </Button>
            </div>
          )}
          options={categories.map((category) => ({
            label: category.name,
            value: category._id,
          }))}
        />
      </Form.Item>

      <Form.Item name="itemCode" className="mb-0">
        <FloatingLabelInput
          label="Enter code"
          className="mb-0"
          suffix={
            <Button
              type="link"
              variant="link"
              className="p-0 h-auto"
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

      <Modal
        title="Create New Category"
        open={showCategoryModal}
        onCancel={() => {
          setShowCategoryModal(false);
          categoryForm.resetFields();
        }}
        onOk={() => {
          categoryForm.submit();
        }}
      >
        <Form form={categoryForm} onFinish={handleCreateCategory}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter a category name" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
