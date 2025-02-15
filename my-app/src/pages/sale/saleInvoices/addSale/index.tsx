import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Card, Divider, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import PaymentDetails from "./PaymentDetails";
import { SalesFormHeader } from "./Header";
import { ItemsTable } from "./ItemTable";
import { useDispatch, useSelector } from "react-redux";
import {
  createSaleInvoice,
  getSaleInvoiceById,
  updateSaleInvoice,
} from "../../../../store/sale/saleInvoice";
import { useNavigate, useSearchParams } from "react-router-dom";

const AddSale = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [docList, setDocList] = useState([]);
  const [isCash, setIsCash] = useState(false);
  const dispatch = useDispatch<any>();
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saleInvoiceData, setSaleInvoiceData] = useState(null);
  const navigate = useNavigate();
  const transformSaleInvoiceData = (data) => {
    if (!data) return null;
    console.log(data.items, "data.items");

    // Transform items data with proper key generation
    const transformedItems = data.items.map((item, index) => ({
      key: String(index + 1), // Ensure keys are unique strings
      item: item.name || "",
      id: item._id,
      quantity: Number(item.quantity) || 0,
      unit: item.unit || "NONE",
      price: Number(item.pricePerUnit) || 0,
      priceType: item.priceType || "withoutTax",
      tax: item.tax || "NONE",
    }));

    console.log(transformedItems, "transformed items");

    // Transform payment options with proper number conversion
    const transformedPayments = data.paymentOption.map((payment) => ({
      type: payment.paymentType,
      amount: Number(payment.paymentAmount) || 0,
    }));

    // Set the form data with proper defaults
    const formData = {
      invoiceNumber: data.invoiceNumber || "",
      invoiceDate: data.invoiceDate ? dayjs(data.invoiceDate) : dayjs(),
      customerName: data.customerName || "",
      phoneNumber: data.phone || "",
      stateOfSupply: data.stateOfSupply || "",
      description: data.description || "",
      paymentType: transformedPayments[0]?.type || "Cash",
      party: data.party || "",
    };

    return {
      formData,
      items: transformedItems,
      payments: transformedPayments,
      images: data.img || [],
      documents: data.documents || [],
    };
  };
  const callGetInvoiceSaleById = async () => {
    if (!id) return;

    try {
      const { payload } = await dispatch(getSaleInvoiceById(id));

      console.log(payload.data, "payload main id");

      if (payload.data.success) {
        const transformedData = transformSaleInvoiceData(
          payload.data.salesInvoice
        );
        setSaleInvoiceData(transformedData);
        setIsEditMode(true);

        form.setFieldsValue(transformedData.formData);
        setItems(transformedData.items);
        setPayments(transformedData.payments);
        setFileList(transformedData.images);
        setDocList(transformedData.documents);
        setIsCash(transformedData.formData.paymentType === "Cash");
        setReceivedAmount(payload.data.salesInvoice.received);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch sale invoice data");
    }
  };

  console.log("helo");

  const initializeData = async () => {
    if (id) {
      await callGetInvoiceSaleById();
    } else {
      setItems([
        {
          key: "1",
          item: "",
          quantity: 0,
          unit: "NONE",
          price: 0,
          priceType: "withoutTax",
          tax: "NONE",
        },
      ]);
    }
  };
  useEffect(() => {
    initializeData();
  }, []);

  const initialData = {
    invoiceNumber: "2",
    invoiceDate: dayjs(),
    paymentType: "Cash",
    roundOff: -0.3,
  };

  const [payments, setPayments] = useState([]);

  // Calculate total received amount from all payment entries
  const totalReceivedAmount = payments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  // Update parent component's receivedAmount whenever payments change
  React.useEffect(() => {
    if (totalReceivedAmount !== receivedAmount) {
      setReceivedAmount(totalReceivedAmount);
    }
  }, [totalReceivedAmount]);

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
  console.log(items, "items new");
  // New function to handle form submission
  const handleSave = async () => {
    try {
      const formValues = await form.validateFields();
      const totalInvoiceAmount = calculateTotal();
      const balance = totalInvoiceAmount - totalReceivedAmount;

      const itemData = items.map((item) => ({
        name: item.item,
        _id: item.id,
        quantity: item.quantity,
        pricePerUnit: item.price,
        tax: item.tax,
        taxAmount: calculateTaxAmount(item),
        amount: calculateFinalAmount(item),
      }));

      const formData = new FormData();

      // Add basic invoice details
      formData.append("invoiceNumber", formValues.invoiceNumber);
      formData.append("invoiceDate", formValues.invoiceDate.toISOString());
      formData.append("customerName", formValues.customerName);
      formData.append("phone", formValues.phoneNumber || "");
      formData.append("party", formValues.party || "");
      formData.append("stateOfSupply", formValues.stateOfSupply || "");
      formData.append("invoiceAmount", totalInvoiceAmount.toString());
      formData.append("received", totalReceivedAmount.toString());
      formData.append("balance", balance.toString());
      formData.append("description", formValues.description || "");

      // Add payment options
      payments.forEach((payment, index) => {
        formData.append(`paymentOption[${index}][paymentType]`, payment.type);
        formData.append(
          `paymentOption[${index}][paymentAmount]`,
          payment.amount.toString()
        );
      });

      // Add items
      itemData.forEach((item, index) => {
        formData.append(`items[${index}][name]`, item.name);
        formData.append(`items[${index}][quantity]`, item.quantity.toString());
        formData.append(`items[${index}][_id]`, item._id);
        formData.append(
          `items[${index}][pricePerUnit]`,
          item.pricePerUnit.toString()
        );
        formData.append(`items[${index}][tax]`, item.tax.toString());
        formData.append(
          `items[${index}][taxAmount]`,
          item.taxAmount.toString()
        );
        formData.append(`items[${index}][amount]`, item.amount.toString());
      });

      // Add images and documents
      fileList.forEach((file, index) => {
        if (file.originFileObj) {
          formData.append(`img`, file.originFileObj);
        }
      });

      docList.forEach((doc, index) => {
        if (doc.originFileObj) {
          formData.append(`documents`, doc.originFileObj);
        }
      });

      // Dispatch appropriate action based on mode
      const action = isEditMode
        ? updateSaleInvoice({ id, data: formData })
        : createSaleInvoice(formData);
      const { payload } = await dispatch(action);

      if (payload.data.success) {
        message.success(
          `Sale invoice ${isEditMode ? "updated" : "created"} successfully`
        );
        navigate("/sale/invoices");
      } else {
        throw new Error(payload.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving sale:", error);
      message.error(
        `Failed to ${isEditMode ? "update" : "create"} sale invoice`
      );
    }
  };

  return (
    <div className="mx-auto p-2 ">
      <Card className="shadow-lg overflow-x-auto">
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
            setItems={setItems}
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
            setPayments={setPayments}
            payments={payments}
            form={form}
            totalReceivedAmount={totalReceivedAmount}
          />

          <div className="flex justify-end space-x-4 mt-6 left-0 sticky bottom-0 border-t-primary-50 border-t-[2px] bg-white w-[100%] p-8 ">
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
