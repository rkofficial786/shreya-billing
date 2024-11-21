import React, { useEffect, useState } from "react";
import { Form, Button, Tabs, Space, Typography, Card, Divider } from "antd";
import { SettingOutlined, CloseOutlined } from "@ant-design/icons";
import { ItemTypeSwitch } from "./ItemTypeSwitch";

import { ImageUploadSection } from "./ImageUpload";
import { PricingSection } from "./PricingSection";
import { StockSection } from "./StockSection";
import { UnitSelectorModal } from "./UnitSelectorModal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createItems, getItemsById, updateItems } from "../../../store/items";
import { BasicDetails } from "./BasicDeyails";
import dayjs from "dayjs";
import toast from "react-hot-toast";

interface FormData {
  itemName: string;
  itemHSN: string;
  itemCode: string;
  category: string;
  unit: {
    baseUnit: string;
    secondaryUnit?: string;
  };
  salePrice: string;
  salePriceType: "withTax" | "withoutTax";
  discount?: string;
  discountType?: "percentage" | "amount";
  wholesalePrice?: string;
  wholesalePriceType?: "withTax" | "withoutTax";
  minWholesaleQty?: string;
  purchasePrice: string;
  purchasePriceType: "withTax" | "withoutTax";
  taxRate: string;
  openingQuantity?: string;
  atPrice?: string;
  asOfDate?: any;
  minStockToMaintain?: string;
  location?: string;
}

const { Title } = Typography;
const { TabPane } = Tabs;

const AddItemPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { editItem } = useSelector((state: any) => state.items);
console.log(editItem,"edit oitem");

  const [isProductType, setIsProductType] = useState(true);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pricing");
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(editItem, id, "hell");
  console.log(id, "id ");

  // Fetch item data when editing
  useEffect(() => {
    const fetchItemData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          await dispatch(getItemsById(id));
        } catch (error) {
          console.error("Error fetching item:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchItemData();
  }, [id, dispatch]);

  // Set form values when editItem changes
  useEffect(() => {
    if (editItem && id) {
      console.log(id, "id in");

      // Transform the edit item data to match form fields
      const formValues = {
        itemName: editItem.name,
        itemHSN: editItem.hsn?.toString(),
        itemCode: editItem.itemCode,
        category: editItem.category[0]._id,
        unit: editItem.unit.baseUnit,

        // Pricing Section
        salePrice: editItem.salePrice?.salePrice?.toString(),
        salePriceType: editItem.salePrice?.taxType || "withoutTax",
        discount: editItem.salePrice?.discountPrice?.toString(),
        discountType: editItem.salePrice?.discountType || "percentage",

        purchasePrice: editItem.purchasePrice?.purchasePrice?.toString(),
        purchasePriceType: editItem.purchasePrice?.taxType || "withoutTax",

        taxRate: editItem.taxes ? `gst${editItem.taxes}` : undefined,

        // Stock Section
        openingQuantity: editItem.stock?.openingQty?.toString(),
        atPrice: editItem.stock?.atPrice?.toString(),
        asOfDate: editItem.stock?.date ? dayjs(editItem.stock.date) : undefined,
        minStockToMaintain: editItem.stock?.minimumStock?.toString(),
        location: editItem.stock?.location,
      };

      // Set the form values
      form.setFieldsValue(formValues);

      // Handle images if any
      if (editItem.img && editItem.img.length > 0) {
        const transformedFileList = editItem.img.map(
          (img: string, index: number) => ({
            uid: `-${index}`,
            name: `Image ${index + 1}`,
            status: "done",
            url: img,
          })
        );
        setFileList(transformedFileList);
      }
    }
  }, [editItem, form, id]);

  const generateRandomCode = () => {
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    form.setFieldValue("itemCode", code);
  };

  const handleUnitSelect = (unit) => {
    form.setFieldsValue({ unit });
  };

  const transformFormDataToPayload = (formData: FormData, fileList: any[]) => {
    const {
      // Basic Details
      itemName,
      itemHSN,
      itemCode,
      category,
      unit,

      // Sale Price Details
      salePrice,
      salePriceType,
      discount,
      discountType,

      // Wholesale Price Details
      wholesalePrice,
      wholesalePriceType,
      minWholesaleQty,

      // Purchase Price Details
      purchasePrice,
      purchasePriceType,

      // Tax Details
      taxRate,

      // Stock Details
      openingQuantity,
      atPrice,
      asOfDate,
      minStockToMaintain,
      location,
    } = formData;

    if (!asOfDate || !openingQuantity) {
      toast.error("Please fill stock inputs");
      return;
    }

    console.log(category, "caetfory");

    // Initialize FormData
    const payload = new FormData();

    // Append basic details
    payload.append("name", itemName);
    if (itemHSN) payload.append("hsn", itemHSN);
    payload.append("itemCode", itemCode);
    if (category) payload.append("category", category);

    // Append unit information
    if (unit) {
      payload.append(
        "unit",
        JSON.stringify({
          baseUnit: unit,
          secondaryUnit: unit?.secondaryUnit || undefined,
        })
      );
    }

    // Append sale price information
    if (salePrice) {
      payload.append(
        "salePrice",
        JSON.stringify({
          salePrice: Number(salePrice),
          taxType: salePriceType,
          discountPrice: discount ? Number(discount) : undefined,
          discountType: discountType,
        })
      );
    }

    // Append wholesale price information
    if (wholesalePrice) {
      payload.append(
        "wholeSalePrice",
        JSON.stringify({
          wholeSalePrice: Number(wholesalePrice),
          taxType: wholesalePriceType,
          minimumWholeSaleQty: minWholesaleQty
            ? Number(minWholesaleQty)
            : undefined,
        })
      );
    }

    // Append purchase price information
    if (purchasePrice) {
      payload.append(
        "purchasePrice",
        JSON.stringify({
          purchasePrice: Number(purchasePrice),
          taxType: purchasePriceType,
        })
      );
    }

    // Append tax information
    if (taxRate) payload.append("taxes", taxRate.replace("gst", ""));

    // Append stock information
    payload.append(
      "stock",
      JSON.stringify({
        openingQty: openingQuantity ? Number(openingQuantity) : undefined,
        atPrice: atPrice ? Number(atPrice) : undefined,
        date: asOfDate.format(),
        minimumStock: minStockToMaintain
          ? Number(minStockToMaintain)
          : undefined,
        location,
      })
    );

    // Append images
    fileList.forEach((file) => {
      if (file.originFileObj) {
        // Append new uploads
        payload.append("img", file.originFileObj);
      } else {
        // Append existing images
        payload.append("existingImg", file.url);
      }
    });

    return payload;
  };

  const handleSubmit = async (saveAndNew = false) => {
    try {
      setIsLoading(true);
      const formData = await form.validateFields();
      const payloadApi = transformFormDataToPayload(formData, fileList);
      //@ts-ignore

      let response;
      if (id) {
        // Update existing item
        response = await dispatch(updateItems({ id, data: payloadApi }));
      } else {
        // Create new item
        response = await dispatch(createItems(payloadApi));
      }

      console.log(response, "response");

      // Check if the response was successful before resetting or navigating
      if (response && response.payload.data.success) {
        // Adjust this condition based on your API response structure
        if (saveAndNew) {
          form.resetFields();
          setFileList([]);
        } else {
          navigate("/items");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="shadow-crisp">
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Add Item</Title>
          <Space>
            {/* <Button icon={<SettingOutlined />} /> */}
            <Button
              onClick={() => navigate("/items")}
              icon={<CloseOutlined />}
            />
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            itemType: "product",
            taxType: "withoutTax",
            discountType: "percentage",
            salePriceType: "withoutTax", // Add this
            purchasePriceType: "withoutTax", // Add this
            wholeSalePriceType: "withoutTax", // Add this
          }}
        >
          {/* <ItemTypeSwitch
            isProductType={isProductType}
            onChange={setIsProductType}
          /> */}

          <BasicDetails
            generateRandomCode={generateRandomCode}
            onUnitClick={() => setUnitModalVisible(true)}
            form={form}
          />
          <Divider />

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
            <Button onClick={() => handleSubmit(true)}>Save & New</Button>
            <Button onClick={() => handleSubmit(false)} type="primary">
              Save
            </Button>
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
