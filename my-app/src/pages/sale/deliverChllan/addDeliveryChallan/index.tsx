import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Card, Divider, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import PaymentDetails from "./PaymentDetails";
import { SalesFormHeader } from "./Header";
import { ItemsTable } from "./ItemTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createDeliveryChallan,
  getDeliveryChallanById,
  updateDeliveryChallan,
} from "../../../../store/sale/deliveryChallan";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const AddChallan = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [searchParams] = useSearchParams();
  const [fileList, setFileList] = useState([]);
  const [docList, setDocList] = useState([]);
  const [isCash, setIsCash] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [existingImage, setExistingImage] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingDocs, setExistingDocs] = useState([]);
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const dispatch = useDispatch<any>();
  const uploadRef = useRef();
  const docRef = useRef();

  const initialData = {
    challanNumber: "2",
    challanDate: dayjs(),
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
    (sum, payment) => sum + (payment.amount || 0),
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

    if (data.img && data.img.length > 0) {
      const mappedFiles = data.img.map((url, index) => ({
        uid: `-${index}`,
        name: `img ${index + 1}`,
        status: "done",
        url: url,
      }));
      setFileList(mappedFiles);
    }

    return {
      customerName: data.party._id,
      challanNumber: data.challanNumber,
      phoneNumber: data.phone,
      stateOfSupply: data.stateOfSupply,
      description: data.description,
      challanDate: dayjs(data.challanDate),
      // invoiceNumber: data.invoiceNumber,
      roundOff: data.roundOff,
    };
  };

  const callGetDeliveryChallanById = async () => {
    if (!id) return;

    try {
      const { payload } = await dispatch(getDeliveryChallanById(id));
      console.log(payload, "payload");

      if (payload.data.success) {
        setExistingImage(payload.data.deliveryChallan.img);
        const formData = mapQuotationDataToForm(payload.data.deliveryChallan);
        form.setFieldsValue(formData);
        setIsEditMode(true);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch quotation data");
    }
  };

  useEffect(() => {
    callGetDeliveryChallanById();
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
    return items
      .reduce((acc, curr) => acc + calculateFinalAmount(curr), 0)
      .toFixed(2);
  };

  const calculateBalance = () => {
    return calculateTotal() - receivedAmount;
  };

  // New function to handle form submission
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

    const quotationData = {
      challanNumber: formValues.challanNumber,

      challanDate: formValues.challanDate
        ? formValues.challanDate.toDate()
        : new Date(),
      party: formValues.customerName,
      phone: formValues.phoneNumber,

      stateOfSupply: formValues.stateOfSupply,
      total: Number(totalAmount.toFixed(2)),
      roundOff: formValues.roundOff || 0,
      totalQty: quotationItems.reduce((sum, item) => sum + item.quantity, 0),
      pricePerUnitType:
        items[0]?.priceType === "withTax" ? "With Tax" : "Without Tax",
      items: quotationItems,
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
        } else {
          formData.append(key, quotationData[key]);
        }
      });

      if (isEditMode) {
        formData.append("existingImg", JSON.stringify(existingImage));
      }
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append(`img`, file.originFileObj, file.name);
        }
      });

      const action = isEditMode
        ? updateDeliveryChallan({ id, data: formData })
        : createDeliveryChallan(formData);

      const { payload } = await dispatch(action);

      if (payload.data.success) {
        message.success(
          `Delivery Challan ${isEditMode ? "updated" : "created"} successfully`
        );
        navigate("/sale/delivery-challan");
      } else {
        toast.error(payload.data.msg);
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
      message.error(
        `Failed to ${isEditMode ? "update" : "save"} Delivery Challan`
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

export default AddChallan;
