//@ts-nocheck

import React, { useState } from "react";
import {
  Form,
  Input,
  Switch,
  Button,
  Select,
  Modal,
  InputNumber,
  Upload,
  Divider,
  Tabs,
  Space,
  Typography,
  Card,
  DatePicker,
  message,
} from "antd";
import {
  SearchOutlined,
  UploadOutlined,
  PlusOutlined,
  CloseOutlined,
  SettingOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import {
  FloatingLabelInput,
  FloatingLabelInputNumber,
  FloatingLabelSelect,
} from "../../../component/input";

const { Title } = Typography;
const { TabPane } = Tabs;

const AddItemPage = () => {
  const [form] = Form.useForm();
  const [isProductType, setIsProductType] = useState(true);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pricing");
  const [fileList, setFileList] = useState([]);

  // Generate random 8-digit code
  const generateRandomCode = () => {
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    form.setFieldValue("itemCode", code);
  };

  // Image upload props
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    fileList,
    listType: "picture-card",
    maxCount: 5,
  };

  // Unit selector modal
  const UnitSelectorModal = () => (
    <Modal
      title="Select Unit"
      visible={unitModalVisible}
      onCancel={() => setUnitModalVisible(false)}
      width={600}
      footer={[
        <Button key="cancel" onClick={() => setUnitModalVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="select"
          type="primary"
          onClick={() => setUnitModalVisible(false)}
        >
          Select
        </Button>,
      ]}
    >
      <FloatingLabelInput
        prefix={<SearchOutlined className="text-gray-400" />}
        label="Search units"
        className="mb-4"
      />
      <div className="grid grid-cols-3 gap-4">
        {[
          "Piece",
          "Kg",
          "Gram",
          "Meter",
          "Liter",
          "Box",
          "Dozen",
          "Pack",
          "Unit",
        ].map((unit) => (
          <Card
            key={unit}
            size="small"
            className="cursor-pointer hover:border-blue-500"
            onClick={() => {
              form.setFieldsValue({ unit });
              setUnitModalVisible(false);
            }}
          >
            {unit}
          </Card>
        ))}
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="shadow-crisp">
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Add Item</Title>
          <Space>
            <Button icon={<SettingOutlined />} />
            <Button icon={<CloseOutlined />} />
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            itemType: "product",
            taxType: "withoutTax",
            discountType: "percentage",
          }}
        >
          {/* Product/Service Switch */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className={`${isProductType ? "text-blue-500" : "text-gray-500"}`}
            >
              Product
            </span>
            <Switch
              checked={!isProductType}
              onChange={(checked) => setIsProductType(!checked)}
              className="bg-gray-300"
            />
            <span
              className={`${
                !isProductType ? "text-blue-500" : "text-gray-500"
              }`}
            >
              Service
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Basic Details Section */}
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
                  onClick={() => setUnitModalVisible(true)}
                  suffix={
                    <Button
                      type="link"
                      className="p-0 h-auto"
                      onClick={() => setUnitModalVisible(true)}
                    >
                      Select Unit
                    </Button>
                  }
                />
              </Form.Item>
            </div>

            {/* Image Upload Section */}
            <Form.Item name="images" label="Item Images" className="col-span-2">
              <Upload {...uploadProps}>
                <div className="text-center">
                  <CameraOutlined className="text-2xl mb-2" />
                  <div>Upload Images</div>
                </div>
              </Upload>
            </Form.Item>

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
              >
                {/* Add category options here */}
              </FloatingLabelSelect>
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

          {/* Tabs Section */}
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="mt-6">
            <TabPane tab="Pricing" key="pricing">
              <div className="grid grid-cols-2 gap-6">
                {/* Sale Price Section */}
                <div>
                  <Title level={5}>Sale Price</Title>
                  <div className="flex gap-4">
                    <Form.Item name="salePrice" className="flex-1">
                      <FloatingLabelInputNumber
                        className="w-full"
                        placeholder="Enter sale price"
                        prefix="₹"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                    <Form.Item name="salePriceType" className="w-40">
                      <FloatingLabelSelect
                        defaultValue="withoutTax"
                        options={[
                          { value: "withoutTax", label: "Without Tax" },
                          { value: "withTax", label: "With Tax" },
                        ]}
                      ></FloatingLabelSelect>
                    </Form.Item>
                  </div>

                  <div className="flex gap-4">
                    <Form.Item name="discount" className="flex-1">
                      <FloatingLabelInputNumber
                        className="w-full"
                        label="Enter discount"
                      />
                    </Form.Item>
                    <Form.Item name="discountType" className="w-40">
                      <FloatingLabelSelect
                        defaultValue="percentage"
                        options={[
                          { value: "percentage", label: "Percentage" },
                          { value: "amount", label: "Amount" },
                        ]}
                      ></FloatingLabelSelect>
                    </Form.Item>
                  </div>

                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    className="text-blue-500 p-0"
                  >
                    Add Wholesale Price
                  </Button>
                </div>

                {/* Purchase Price Section */}
                <div>
                  <Title level={5}>Purchase Price</Title>
                  <div className="flex gap-4">
                    <Form.Item name="purchasePrice" className="flex-1">
                      <FloatingLabelInputNumber
                        className="w-full"
                        label="Enter purchase price"
                        prefix="₹"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                    <Form.Item name="purchasePriceType" className="w-40">
                      <FloatingLabelSelect
                        defaultValue="withoutTax"
                        style={{ width: 120 }}
                        // onChange={handleChange}
                        options={[
                          { value: "withoutTax", label: "Without Tax" },
                          { value: "withTax", label: "With Tax" },
                        ]}
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* Tax Section */}
                <div className="col-span-2">
                  <Title level={5}>Taxes</Title>
                  <Form.Item name="taxRate" className="w-full">
                    <FloatingLabelSelect placeholder="Select tax rate">
                      <Select.Option value="none">None</Select.Option>
                      <Select.Option value="gst5">GST 5%</Select.Option>
                      <Select.Option value="gst12">GST 12%</Select.Option>
                      <Select.Option value="gst18">GST 18%</Select.Option>
                      <Select.Option value="gst28">GST 28%</Select.Option>
                    </FloatingLabelSelect>
                  </Form.Item>
                </div>
              </div>
            </TabPane>

            <TabPane tab="Stock" key="stock">
              <div className="grid grid-cols-2 gap-6">
                <Form.Item name="openingQuantity" label="Opening Quantity">
                  <FloatingLabelInputNumber
                    className="w-full"
                    min={0}
                    placeholder="Enter opening quantity"
                  />
                </Form.Item>

                <Form.Item name="atPrice" label="At Price">
                  <FloatingLabelInputNumber
                    className="w-full"
                    min={0}
                    prefix="₹"
                    placeholder="Enter price"
                  />
                </Form.Item>

                <Form.Item name="asOfDate" label="As Of Date">
                  <DatePicker
                    className="w-full py-3"
                    format="DD/MM/YYYY"
                    placeholder="Select date"
                  />
                </Form.Item>

                <Form.Item
                  name="minStockToMaintain"
                  label="Min Stock To Maintain"
                >
                  <FloatingLabelInputNumber
                    className="w-full"
                    min={0}
                    placeholder="Enter minimum stock level"
                  />
                </Form.Item>

                <Form.Item name="location" label="Location">
                  <FloatingLabelInput placeholder="Enter storage location" />
                </Form.Item>
              </div>
            </TabPane>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-6">
            <Button>Save & New</Button>
            <Button type="primary">Save</Button>
          </div>
        </Form>
      </Card>

      {/* Unit Selector Modal */}
      <UnitSelectorModal />
    </div>
  );
};

export default AddItemPage;
