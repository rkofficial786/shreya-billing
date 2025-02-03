import React from 'react';
import { Radio } from 'antd';

interface PaymentTypeSelectorProps {
  paymentType: 'cash' | 'credit';
  setPaymentType: (type: 'cash' | 'credit') => void;
}

const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({
  paymentType,
  setPaymentType,
}) => {
  return (
    <Radio.Group
      value={paymentType}
      onChange={(e) => setPaymentType(e.target.value)}
      className="mb-4"
      size="large"
    >
      <Radio.Button value="cash">Cash</Radio.Button>
      <Radio.Button value="credit">Credit</Radio.Button>
    </Radio.Group>
  );
};

export default PaymentTypeSelector;