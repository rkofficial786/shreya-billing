import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Card, Divider, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import PaymentDetails from "./PaymentDetails";
import { SalesFormHeader } from "./Header";
import { ItemsTable } from "./ItemTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateQuotation } from "../../../../store/sale/quotation";
import {
  createSaleReturn,
  getSaleReturnById,
  updateSaleReturn,
} from "../../../../store/sale/saleReturn";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const AddCreditNote = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [searchParams] = useSearchParams();
  const [existingImage, setExistingImage] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingDocs, setExistingDocs] = useState([]);
  const id = searchParams.get("id");
  const [docList, setDocList] = useState([]);
  const navigate = useNavigate();
  const [isCash, setIsCash] = useState(false);
  const dispatch = useDispatch<any>();
  const [receivedAmount, setReceivedAmount] = useState(0);
  const uploadRef = useRef();
  const docRef = useRef();

  const initialData = {
    returnNumber: "2",
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

  const [payments, setPayments] = useState([]);

  // Calculate total received amount from all payment entries
  const totalReceivedAmount = payments.reduce(
    (sum, payment) => sum + (parseFloat(payment.amount) || 0),
    0
  );

  const mapQuotationDataToForm = (data) => {
    const mappedItems = data.items.map((item, index) => ({
      key: index + 1,
      id: item._id,
      item: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: item.pricePerUnit,
      priceType:
        data.pricePerUnitType === "With Tax" ? "withTax" : "withoutTax",
      tax: item.tax,
    }));

    setItems(mappedItems);

    // If there are documents, create file list
    if (data.document && data.document.length > 0) {
      const mappedFiles = data.document.map((url, index) => ({
        uid: `-${index}`,
        name: `Document ${index + 1}`,
        status: "done",
        url: url,
      }));
      setFileList(mappedFiles);
    }

    if (data.img && data.img.length > 0) {
      const mappedFiles = data.img.map((url, index) => ({
        uid: `-${index}`,
        name: `img ${index + 1}`,
        status: "done",
        url: url,
      }));
      setFileList(mappedFiles);
    }

    // setReceivedAmount(parseFloat(data.advanceAmount));
    const paymentsOption = data.paymentOption.map((item) => ({
      type: item.paymentType,
      amount: item.paymentAmount,
      id: item._id,
    }));

    setPayments(paymentsOption);

    return {
      customerName: data.party._id,
      returnNumber: data.returnNumber,
      phoneNumber: data.phone,
      stateOfSupply: data.stateOfSupply,
      description: data.description,
      invoiceDate: dayjs(data.date),
      invoiceNumber: data.invoiceNumber,
      roundOff: data.roundOff,
    };
  };

  const callGetSaleOrderById = async () => {
    if (!id) return;

    try {
      const { payload } = await dispatch(getSaleReturnById(id));
      console.log(payload, "payload");

      if (payload.data.success) {
        setExistingImage(payload.data.salesReturn.img);
        const formData = mapQuotationDataToForm(payload.data.salesReturn);
        form.setFieldsValue(formData);
        setIsEditMode(true);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch quotation data");
    }
  };

  useEffect(() => {
    callGetSaleOrderById();
  }, [id]);

  // Update parent component's receivedAmount whenever payments change
  React.useEffect(() => {
    setReceivedAmount(totalReceivedAmount);
  }, [totalReceivedAmount, setReceivedAmount]);

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

  const prepareQuotationData = (formValues) => {
    const quotationItems = items.map((item) => ({
      _id: item.id || undefined,
      name: item.item,
      quantity: item.quantity,
      unit: item.unit,
      pricePerUnit: item.price,
      tax: item.tax,
      taxAmount: calculateTaxAmount(item),
      amount: calculateFinalAmount(item),
    }));

    const totalAmount = quotationItems.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const paymentOption = payments.map((item) => ({
      paymentType: item.type,
      paymentAmount: item.amount,
    }));

    const quotationData = {
      returnNumber: formValues.returnNumber,
      invoiceNumber: formValues.invoiceNumber,
      invoiceDate: formValues.invoiceDate
        ? formValues.invoiceDate.toDate()
        : new Date(),
      party: formValues.customerName,
      phone: formValues.phoneNumber,
      date: formValues.invoiceDate,
      stateOfSupply: formValues.stateOfSupply,
      total: Number(totalAmount.toFixed(2)),
      roundOff: formValues.roundOff || 0,
      totalQty: quotationItems.reduce((sum, item) => sum + item.quantity, 0),
      pricePerUnitType:
        items[0]?.priceType === "withTax" ? "With Tax" : "Without Tax",
      items: quotationItems,
      paymentOption,
    };

    return quotationData;
  };

  const handleSave = async () => {
    try {
      const formValues = await form.validateFields();
      const quotationData = prepareQuotationData(formValues);
      const formData = new FormData();

      Object.keys(quotationData).forEach((key) => {
        if (key === "items") {
          formData.append(key, JSON.stringify(quotationData.items));
        } else if (key === "date") {
          formData.append(key, quotationData[key].toISOString());
        } else if (key == "paymentOption") {
          formData.append(
            "paymentOption",
            JSON.stringify(quotationData.paymentOption)
          );
        } else {
          formData.append(key, quotationData[key]);
        }
      });
      if (isEditMode) {
        formData.append("existingDocument", JSON.stringify(existingDocs));
      }
      if (isEditMode) {
        formData.append("existingImg", JSON.stringify(existingImage));
      }
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append(`img`, file.originFileObj, file.name);
        }
      });

      const action = isEditMode
        ? updateSaleReturn({ id, data: formData })
        : createSaleReturn(formData);

      const { payload } = await dispatch(action);

      if (payload.data.success) {
        message.success(
          `CR ${isEditMode ? "updated" : "created"} successfully`
        );
        navigate("/sale/credit-note");
      } else {
        toast.error(payload.data.msg);
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
      message.error(`Failed to ${isEditMode ? "update" : "save"} CR data`);
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
            handleDeleteRow={handleDeleteRow}
            calculateTaxAmount={calculateTaxAmount}
            calculateFinalAmount={calculateFinalAmount}
            setItems={setItems}
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
            existingImage={existingImage}
            setExistingImage={setExistingImage}
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

export default AddCreditNote;
