import React from "react";
import { Card, Typography, Space, InputNumber, Select, Button } from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

const PaymentDetails = ({
  selectedProducts,
  paymentMode,
  setPaymentMode,
  amountReceived,
  setAmountReceived,
  handleSubmit,
  
}) => {
  return (
   
      <div className="mt-4 border-t pt-4 self-end absolute bottom-[100px] w-[90%]">
        <Title level={4}>Payment Details</Title>
        <Space direction="vertical" className="w-full">
          <Select
            value={paymentMode}
            onChange={(value) => setPaymentMode(value)}
            placeholder="Payment Mode"
            className="w-full"
          >
            <Option value="cash">Cash</Option>
            <Option value="card">Card</Option>
            <Option value="upi">UPI</Option>
          </Select>
          <InputNumber
            value={amountReceived}
            onChange={(value) => setAmountReceived(value)}
            placeholder="Amount Received"
            className="w-full"
            prefix="₹"
          />
        </Space>

        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <Text>Sub Total:</Text>
            <Text>
              ₹
              {selectedProducts
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </Text>
          </div>
          <div className="flex justify-between mb-2">
            <Text>Total Tax:</Text>
            <Text>
              ₹
              {selectedProducts
                .reduce(
                  (sum, item) => sum + item.price * item.quantity * 0.18,
                  0
                )
                .toFixed(2)}
            </Text>
          </div>
          <div className="flex justify-between mb-2">
            <Text>Total Discount:</Text>
            <Text>
              ₹
              {selectedProducts
                .reduce((sum, item) => sum + (item.discount || 0), 0)
                .toFixed(2)}
            </Text>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <Text strong>Grand Total:</Text>
            <Text strong>
              ₹
              {selectedProducts
                .reduce(
                  (sum, item) =>
                    sum +
                    item.price * item.quantity +
                    item.price * item.quantity * 0.18 -
                    (item.discount || 0),
                  0
                )
                .toFixed(2)}
            </Text>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          type="primary"
          className="w-full mt-4"
          size="large"
        >
          Save & Generate Bill
        </Button>
      </div>
   
  );
};

export default PaymentDetails;