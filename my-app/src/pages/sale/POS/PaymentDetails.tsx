import React from "react";
import { Card, Typography, Space, InputNumber, Select, Button, Divider } from "antd";

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
  // Calculate totals
  const subTotal = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // (record.price * record.quantity * (record.tax / 100))
  const totalTax = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity * (item.tax / 100),
    0
  );
  
  const totalDiscount = selectedProducts.reduce(
    (sum, item) => sum + (item.discount || 0),
    0
  );
  
  const grandTotal = subTotal + totalTax - totalDiscount;
  
  // Calculate returnable amount only for cash payments
  const returnableAmount = paymentMode === 'cash' && amountReceived 
    ? amountReceived - grandTotal 
    : 0;

  return (
    <div className="mt-4 border-t pt-4 self-end absolute bottom-[100px] w-[90%]">
      <Title level={4}>Payment Details</Title>
      <Space direction="vertical" className="w-full">
        <Select
          value={paymentMode}
          onChange={(value) => setPaymentMode(value)}
          placeholder="Payment Mode"
          className="w-full"
          size="large"
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
          size="large"
          min={0}
          style={{ width: '100%' }}
        />

        {paymentMode === 'cash' && amountReceived > 0 && (
          <div className="w-full bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <Text className="text-gray-600">Return Amount:</Text>
              <Text className={`text-lg font-medium ${returnableAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹ {Math.abs(returnableAmount).toFixed(2)}
                {returnableAmount < 0 && ' (Due)'}
              </Text>
            </div>
          </div>
        )}
      </Space>

      <Divider className="my-4" />

      <div className="space-y-3">
        <div className="flex justify-between items-center text-gray-600">
          <Text>Sub Total:</Text>
          <Text>₹ {subTotal.toFixed(2)}</Text>
        </div>
        
        <div className="flex justify-between items-center text-gray-600">
          <Text>Total Tax:</Text>
          <Text>₹ {totalTax.toFixed(2)}</Text>
        </div>
        
        <div className="flex justify-between items-center text-gray-600">
          <Text>Total Discount:</Text>
          <Text>₹ {totalDiscount.toFixed(2)}</Text>
        </div>
        
        <Divider className="my-2" />
        
        <div className="flex justify-between items-center">
          <Text strong className="text-lg">Grand Total:</Text>
          <Text strong className="text-lg">₹ {grandTotal.toFixed(2)}</Text>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        type="primary"
        className="w-full mt-6"
        size="large"
      >
        Save & Generate Bill
      </Button>
    </div>
  );
};

export default PaymentDetails;