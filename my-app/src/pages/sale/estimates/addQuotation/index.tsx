import React, { useState, useEffect } from "react";
import { Form, Button, Card, Divider, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import PaymentDetails from "./PaymentDetails";
import { SalesFormHeader } from "./Header";
import { ItemsTable } from "./ItemTable";
import { useDispatch } from "react-redux";
import {
  createQuotation,
  getQuotationById,
  updateQuotation,
} from "../../../../store/sale/quotation";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const AddQuotation = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [docList, setDocList] = useState([]);
  const [isCash, setIsCash] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [existingDocs, setExistingDocs] = useState([]);

  const initialData = {
    invoiceNumber: "2",
    invoiceDate: dayjs(),
    paymentType: "Cash",
    roundOff: -0.3,
  };

  useEffect(() => {
    if (!id) {
      setItems([
        {
          key: 1,
          id: "",
          item: "",
          quantity: 0,
          unit: "NONE",
          price: 0,
          priceType: "withoutTax",
          tax: "NONE",
        },
      ]);
    }
  }, []);

  const [payments, setPayments] = useState([]);

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

    return {
      customerName: data.party._id,
      invoiceDate: dayjs(data.invoiceDate),
      referenceNumber: data.refNumber,
      roundOff: data.roundOff,
    };
  };

  const callGetQuotationById = async () => {
    if (!id) return;

    try {
      const { payload } = await dispatch(getQuotationById(id));

      if (payload.data.success) {
        setExistingDocs(payload.data.quotation.document);
        const formData = mapQuotationDataToForm(payload.data.quotation);
        form.setFieldsValue(formData);
        setIsEditMode(true);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch quotation data");
    }
  };

  useEffect(() => {
    callGetQuotationById();
  }, [id]);

  useEffect(() => {
    setReceivedAmount(totalReceivedAmount);
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

  const calculateTotal = () => {
    return items
      .reduce((acc, curr) => acc + calculateFinalAmount(curr), 0)
      .toFixed(2);
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

    const quotationData = {
      refNumber: formValues.referenceNumber,
      invoiceDate: formValues.invoiceDate
        ? formValues.invoiceDate.toDate()
        : new Date(),
      party: formValues.customerName,
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
        } else if (key === "invoiceDate") {
          formData.append(key, quotationData[key].toISOString());
        } else {
          formData.append(key, quotationData[key]);
        }
      });
      if (isEditMode) {
        formData.append("existingDocument", JSON.stringify(existingDocs));
      }
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append(`img`, file.originFileObj, file.name);
        }
      });

      const action = isEditMode
        ? updateQuotation({ id, data: formData })
        : createQuotation(formData);

      const { payload } = await dispatch(action);

      if (payload.data.success) {
        message.success(
          `Quotation ${isEditMode ? "updated" : "created"} successfully`
        );
        navigate("/sale/quotation");
      } else {
        toast.error(payload.data.msg);
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
      message.error(
        `Failed to ${isEditMode ? "update" : "save"} quotation data`
      );
    }
  };

  return (
    <div className="mx-auto p-2">
      <Card className="shadow-lg overflow-x-auto">
        <Form form={form} layout="vertical" initialValues={initialData}>
          <SalesFormHeader
            isCash={isCash}
            setIsCash={setIsCash}
            initialData={initialData}
            form={form}
            // isEditMode={isEditMode}
          />

          <Divider />

          <ItemsTable
            setItems={setItems}
            items={items}
            handleDeleteRow={handleDeleteRow}
            calculateTaxAmount={calculateTaxAmount}
            calculateFinalAmount={calculateFinalAmount}
            // isEditMode={isEditMode}
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
            setExistingDocs={setExistingDocs}
            existingDocs={existingDocs}
            // isEditMode={isEditMode}
          />

          <div className="flex justify-end space-x-4 mt-6 left-0 sticky bottom-0 border-t-primary-50 border-t-[2px] bg-white w-[100%] p-8">
            <Button type="default">Save & New</Button>
            <Button type="primary" onClick={handleSave}>
              {isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddQuotation;
