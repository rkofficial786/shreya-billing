import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Card, Divider, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import PaymentDetails from "./PaymentDetails";
import { SalesFormHeader } from "./Header";
import { ItemsTable } from "./ItemTable";

const AddSale = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [docList, setDocList] = useState([]);
  const [isCash, setIsCash] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const uploadRef = useRef();
  const docRef = useRef();

  const initialData = {
    invoiceNumber: "2",
    invoiceDate: dayjs(),
    paymentType: "Cash",
    roundOff: -0.3,
  };

  useEffect(() => {
    setItems([
      {
        key: 1,
        item: "",
        quantity: 0,
        unit: "NONE",
        price: 0,
        priceType: "withoutTax",
        tax: "NONE",
      },
    ]);
  }, []);

  const getTaxRate = (taxString) => {
    if (taxString === "NONE") return 0;
    const percentage = parseFloat(taxString.match(/\d+(\.\d+)?/)[0]);
    return percentage / 100;
  };

  const calculateTaxAmount = (record) => {
    const baseAmount = record.quantity * record.price;
    const taxRate = getTaxRate(record.tax);

    if (record.priceType === "withTax") {
      return (baseAmount * taxRate) / (1 + taxRate);
    } else {
      return baseAmount * taxRate;
    }
  };

  const calculateFinalAmount = (record) => {
    const baseAmount = record.quantity * record.price;
    const taxRate = getTaxRate(record.tax);

    if (record.priceType === "withTax") {
      return baseAmount;
    } else {
      return baseAmount * (1 + taxRate);
    }
  };

  const handleAddRow = () => {
    const newKey = items.length + 1;
    setItems([
      ...items,
      {
        key: newKey,
        item: "",
        quantity: 0,
        unit: "NONE",
        price: 0,
        priceType: "withoutTax",
        tax: "NONE",
      },
    ]);
  };

  const handleDeleteRow = (key) => {
    if (items.length === 1) {
      message.warning("At least one item is required");
      return;
    }
    setItems(items.filter((item) => item.key !== key));
  };

  const handleItemChange = (key, field, value) => {
    setItems(
      items.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + calculateFinalAmount(curr), 0);
  };

  const calculateBalance = () => {
    return calculateTotal() - receivedAmount;
  };

  // New function to handle form submission
  const handleSave = async () => {
    try {
      // Validate and get all form values
      const formValues = await form.validateFields();
      console.log(formValues, "form values");

      const saleData = {
        // Header Information
        customerInfo: {
          customerName: formValues.customerName,
          phoneNumber: formValues.phoneNumber,
        },
        invoiceDetails: {
          invoiceNumber: formValues.invoiceNumber,
          invoiceDate: formValues.invoiceDate.toISOString(),
          stateOfSupply: formValues.stateOfSupply,
        },
        paymentMode: isCash ? "Cash" : "Credit",

        // Items list with calculated values
        items: items.map((item) => ({
          ...item,
          taxAmount: calculateTaxAmount(item),
          finalAmount: calculateFinalAmount(item),
        })),

        // Payment details
        paymentDetails: {
          isCash,
          receivedAmount,
          totalAmount: calculateTotal(),
          balance: calculateBalance(),
          roundOff: formValues.roundOff || 0,
        },

        // File attachments
        attachments: {
          images: fileList.map((file) => ({
            name: file.name,
            url: file.url,
            uid: file.uid,
            type: file.type,
          })),
          documents: docList.map((doc) => ({
            name: doc.name,
            url: doc.url,
            uid: doc.uid,
            type: doc.type,
          })),
        },
      };

      // Log the complete data (remove in production)
      console.log("Sale Data:", saleData);

      // Here you would typically send this data to your backend
      // await api.saveSale(saleData);

      message.success("Sale data collected successfully");

      // Optional: Reset form after successful save
      // form.resetFields();
      // setItems([{
      //   key: 1,
      //   item: "",
      //   quantity: 0,
      //   unit: "NONE",
      //   price: 0,
      //   priceType: "withoutTax",
      //   tax: "NONE",
      // }]);
      // setFileList([]);
      // setDocList([]);
      // setReceivedAmount(0);
    } catch (error) {
      console.error("Error saving sale:", error);
      message.error("Failed to save sale data");
    }
  };

  return (
    <div className="mx-auto p-2">
      <Card className="shadow-lg">
        <Form form={form} layout="vertical" initialValues={initialData}>
          <SalesFormHeader
            isCash={isCash}
            setIsCash={setIsCash}
            initialData={initialData}
            form={form}
          />

          <Divider />

          <ItemsTable
            items={items}
            handleItemChange={handleItemChange}
            handleDeleteRow={handleDeleteRow}
            calculateTaxAmount={calculateTaxAmount}
            calculateFinalAmount={calculateFinalAmount}
          />

          <Button
            type="dashed"
            onClick={handleAddRow}
            className="my-4"
            icon={<PlusOutlined />}
          >
            Add Row
          </Button>

          <Divider />

          <PaymentDetails
            isCash={isCash}
            receivedAmount={receivedAmount}
            setReceivedAmount={setReceivedAmount}
            calculateTotal={calculateTotal}
            calculateBalance={calculateBalance}
            setImageFileList={setFileList}
            imageFileList={fileList}
            docFileList={docList}
            setDocFileList={setDocList}
          />

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="default">Save & New</Button>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddSale;
