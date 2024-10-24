import React, { useState } from "react";
import { Form, Button, Tabs, Space, Typography, Card } from "antd";
import { SettingOutlined, CloseOutlined } from "@ant-design/icons";
import { ItemTypeSwitch } from "./ItemTypeSwitch";
import { BasicDetails } from "./BasicDeyails";
import { ImageUploadSection } from "./ImageUpload";
import { PricingSection } from "./PricingSection";
import { StockSection } from "./StockSection";
import { UnitSelectorModal } from "./UnitSelectorModal";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { TabPane } = Tabs;

const AddItemPage = () => {
  const [form] = Form.useForm();
  const navigate =useNavigate()
  const [isProductType, setIsProductType] = useState(true);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pricing");
  const [fileList, setFileList] = useState([]);

  const generateRandomCode = () => {
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    form.setFieldValue("itemCode", code);
  };

  const handleUnitSelect = (unit: string) => {
    form.setFieldsValue({ unit });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="shadow-crisp">
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Add Item</Title>
          <Space>
            <Button icon={<SettingOutlined />} />
            <Button onClick={()=>navigate('/items')} icon={<CloseOutlined />} />
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
          <ItemTypeSwitch
            isProductType={isProductType}
            onChange={setIsProductType}
          />

          <BasicDetails
            generateRandomCode={generateRandomCode}
            onUnitClick={() => setUnitModalVisible(true)}
          />

          <Form.Item name="images" label="Item Images" className="col-span-2">
            <ImageUploadSection fileList={fileList} setFileList={setFileList} />
          </Form.Item>

          <Tabs activeKey={activeTab} onChange={setActiveTab} className="mt-6">
            <TabPane tab="Pricing" key="pricing">
              <PricingSection />
            </TabPane>
            <TabPane tab="Stock" key="stock">
              <StockSection />
            </TabPane>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button>Save & New</Button>
            <Button type="primary">Save</Button>
          </div>
        </Form>
      </Card>

      <UnitSelectorModal
        visible={unitModalVisible}
        onClose={() => setUnitModalVisible(false)}
        onSelect={handleUnitSelect}
      />
    </div>
  );
};

export default AddItemPage;
