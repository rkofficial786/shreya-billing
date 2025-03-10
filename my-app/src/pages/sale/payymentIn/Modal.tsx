import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Space,
  Typography,
  Upload,
} from "antd";
import {
  CameraOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { ImageUploadSection } from "../../items/add-item/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { getAllParties } from "../../../store/parties";
import { FloatingLabelSelect } from "../../../component/input";

const { Option } = Select;

const PaymentModal = ({
  open,
  onCancel,
  onSubmit,
  setFileList,
  fileList,
  form,
  setPayments,
  payments,
  isEdit,
}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { parties } = useSelector((state: any) => state.party);
  const dispatch = useDispatch<any>();
  useEffect(() => {
    const total = payments.reduce(
      (sum, payment) => sum + (Number(payment.amount) || 0),
      0
    );
    setTotalAmount(total);
    form.setFieldsValue({ received: total });
  }, [payments, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({
        ...values,
        fileList,
        date: dayjs(values.date),
        payments: payments,
      });
      form.resetFields();
      setPayments([{ type: "Cash", amount: "", refNo: "" }]);
    });
  };

  const handleAddPayment = () => {
    setPayments([...payments, { type: "Cash", amount: "", refNo: "" }]);
  };

  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = [...payments];
    updatedPayments[index] = { ...updatedPayments[index], [field]: value };
    setPayments(updatedPayments);
  };

  const handleRemovePayment = (index) => {
    if (payments.length > 1) {
      const updatedPayments = payments.filter((_, i) => i !== index);
      setPayments(updatedPayments);
    }
  };

  // Handler for customer selection
  const handleCustomerSelect = (value, option) => {
    // Find the selected party
    const selectedParty = parties.find((party) => party._id === value);
    console.log(selectedParty, "selecyted paryt");
    console.log(value, "values");

    if (selectedParty) {
      form.setFieldsValue({
        party: value,
      });
    }
  };

  useEffect(() => {
    const callGetAllParty = async () => {
      await dispatch(getAllParties());
    };
    callGetAllParty();
  }, []);

  return (
    <Modal
      title="Payment-In"
      open={open}
      onCancel={() => {
        onCancel();
        setPayments([{ type: "Cash", amount: "", refNo: "" }]);
        form.resetFields();
      }}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs(),
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <Form.Item name="party" label="Party" required className="mb-2">
              <FloatingLabelSelect
                className="mb-0"
                showSearch
                label="Search by Name/Phone"
                optionFilterProp="children"
                onChange={handleCustomerSelect}
                filterOption={(input, option) => {
                  const party = parties.find((p) => p._id === option?.value);
                  return (
                    party?.name?.toLowerCase().includes(input.toLowerCase()) ||
                    party?.phone?.includes(input)
                  );
                }}
              >
                {parties?.map((party) => (
                  <Option
                    key={party._id}
                    value={party._id}
                    phoneNumber={party.phone}
                  >
                    {party?.name} - {party?.phone}
                  </Option>
                ))}
              </FloatingLabelSelect>
            </Form.Item>

            {/* Payments Section */}
            <div className="border rounded p-2 mb-2">
              <div className="flex justify-between items-center mb-2">
                <Typography.Text strong>Payments</Typography.Text>
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={handleAddPayment}
                  className="p-0"
                >
                  Add
                </Button>
              </div>

              {payments?.map((payment, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Select
                    value={payment.type}
                    onChange={(value) =>
                      handlePaymentChange(index, "type", value)
                    }
                    className="w-24"
                    size="small"
                  >
                    <Option value="Cash">Cash</Option>
                    <Option value="Cheque">Cheque</Option>
                  </Select>
                  {payment?.type === "Cheque" && (
                    <Input
                      placeholder="Ref No"
                      value={payment.refNo}
                      onChange={(e) =>
                        handlePaymentChange(index, "refNo", e.target.value)
                      }
                      className="w-24"
                      size="small"
                    />
                  )}
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={payment.amount}
                    onChange={(e) =>
                      handlePaymentChange(index, "amount", e.target.value)
                    }
                    className="flex-1"
                    size="small"
                    prefix="₹"
                  />
                  {payments.length > 1 && (
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemovePayment(index)}
                      danger
                      size="small"
                    />
                  )}
                </div>
              ))}
            </div>

            <Form.Item name="description" label="Description" className="mb-2">
              <Input.TextArea rows={3} placeholder="Add description" />
            </Form.Item>
            {/* 
            <Upload
              listType="picture-card"
              maxCount={5}
              multiple
              beforeUpload={() => false}
              className="mb-2"
            >
              <div>
                <CameraOutlined />
                <div className="mt-1">Upload</div>
              </div>
            </Upload> */}
          </div>

          {/* Right Column */}
          <div>
            <Form.Item name="receiptNo" label="Receipt No" className="mb-2">
              <Input placeholder="Enter Receipt No." />
            </Form.Item>

            <Form.Item name="date" label="Date" required className="mb-2">
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="received"
              label="Received"
              required
              className="mb-2"
            >
              <Input
                prefix="₹"
                type="number"
                placeholder="Enter amount"
                disabled={payments.length > 0}
                value={totalAmount}
              />
            </Form.Item>
          </div>
        </div>
        <ImageUploadSection setFileList={setFileList} fileList={fileList} />
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={payments.some(
              (p) => !p.amount || (p.type === "Cheque" && !p.refNo)
            )}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
