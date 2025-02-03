import React from "react";
import { Typography, Divider } from "antd";

const { Title, Text } = Typography;

interface CustomerDetailsProps {
  selectedCustomer: any;
  paymentType: 'cash' | 'credit';
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ 
  selectedCustomer, 
  paymentType 
}) => {
  if (!selectedCustomer) {
    return (
      <div className="text-center text-gray-500">No customer selected</div>
    );
  }

  if (paymentType === 'cash') {
    return (
      <div>
        <Title level={4} className="mb-4">
          Customer Details
        </Title>
        <div className="space-y-3">
          <div className="flex flex-col">
            <Text type="secondary" className="text-xs">
              Customer Name
            </Text>
            <Text strong className="text-base">
              {selectedCustomer.name}
            </Text>
          </div>

          <div>
            <Text type="secondary" className="text-xs">
              Phone
            </Text>
            <div className="text-sm">{selectedCustomer.phone}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Title level={4} className="mb-4">
        Customer Details
      </Title>
      <div className="space-y-3">
        <div className="flex flex-col">
          <Text type="secondary" className="text-xs">
            Customer Name
          </Text>
          <Text strong className="text-base">
            {selectedCustomer.name}
          </Text>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text type="secondary" className="text-xs">
              Phone
            </Text>
            <div className="text-sm">{selectedCustomer.phone}</div>
          </div>
          <div>
            <Text type="secondary" className="text-xs">
              GST No
            </Text>
            <div className="text-sm">{selectedCustomer.gstin}</div>
          </div>
        </div>

        <div>
          <Text type="secondary" className="text-xs">
            Email Address
          </Text>
          <div className="text-sm">
            {selectedCustomer.gstAndAddress?.email}
          </div>
        </div>

        <div>
          <Text type="secondary" className="text-xs">
            Billing Address
          </Text>
          <div className="text-sm">
            {selectedCustomer.gstAndAddress?.address}
          </div>
        </div>

        <Divider className="my-3" />

        <div className="grid grid-cols-2 gap-4">
          {selectedCustomer.creditAndBlance?.limit && (
            <div>
              <Text type="secondary" className="text-xs">
                Credit Limit
              </Text>
              <div className="text-sm font-medium">
                ₹{selectedCustomer.creditAndBlance.limit.toLocaleString()}
              </div>
            </div>
          )}
          <div>
            <Text type="secondary" className="text-xs">
              Opening Balance
            </Text>
            <div className="text-sm font-medium">
              ₹{selectedCustomer.creditAndBlance?.openingBalance?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;