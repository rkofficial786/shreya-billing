import React, { useState } from 'react';
import { Form, Button, Select, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FloatingLabelInputNumber, FloatingLabelSelect } from '../../../component/input';

const { Title } = Typography;

export const PricingSection = () => {
  const [showWholesalePrices, setShowWholesalePrices] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Title level={5}>Sale Price</Title>
        <div className="flex gap-4">
          <Form.Item name="salePrice" className="flex-1">
            <FloatingLabelInputNumber
              className="w-full"
              placeholder="Enter sale price"
              prefix="₹"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
          <Form.Item name="salePriceType" className="w-40">
            <FloatingLabelSelect
             
              options={[
                { value: "withoutTax", label: "Without Tax" },
                { value: "withTax", label: "With Tax" },
              ]}
            />
          </Form.Item>
        </div>

        <div className="flex gap-4">
          <Form.Item name="discount" className="flex-1">
            <FloatingLabelInputNumber className="w-full" label="Enter discount" />
          </Form.Item>
          <Form.Item name="discountType" className="w-40">
            <FloatingLabelSelect
              defaultValue="percentage"
              options={[
                { value: "percentage", label: "Percentage" },
                { value: "amount", label: "Amount" },
              ]}
            />
          </Form.Item>
        </div>

        {!showWholesalePrices && (
          <Button 
            type="link" 
            icon={<PlusOutlined />} 
            className="text-blue-500 p-0"
            onClick={() => setShowWholesalePrices(true)}
          >
            Add Wholesale Price
          </Button>
        )}

        {showWholesalePrices && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <Title level={5} className="mb-0">Wholesale Price</Title>
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                className="text-red-500"
                onClick={() => setShowWholesalePrices(false)}
              />
            </div>
            <div className="flex gap-4">
              <Form.Item name="wholesalePrice" className="flex-1">
                <FloatingLabelInputNumber
                  className="w-full"
                  placeholder="Wholesale Price"
                  prefix="₹"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                />
              </Form.Item>
              <Form.Item name="wholesalePriceType" className="w-40">
                <FloatingLabelSelect
                 
                  options={[
                    { value: "withoutTax", label: "Without Tax" },
                    { value: "withTax", label: "With Tax" },
                  ]}
                />
              </Form.Item>
            </div>
            <Form.Item name="minWholesaleQty">
              <FloatingLabelInputNumber
                className="w-full"
                placeholder="Minimum Wholesale Qty"
              />
            </Form.Item>
          </div>
        )}
      </div>

      <div>
        <Title level={5}>Purchase Price</Title>
        <div className="flex gap-4">
          <Form.Item name="purchasePrice" className="flex-1">
            <FloatingLabelInputNumber
              className="w-full"
              label="Enter purchase price"
              prefix="₹"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
          <Form.Item name="purchasePriceType" className="w-40">
            <FloatingLabelSelect
              
              options={[
                { value: "withoutTax", label: "Without Tax" },
                { value: "withTax", label: "With Tax" },
              ]}
            />
          </Form.Item>
        </div>
      </div>

      <div className="col-span-2">
        <Title level={5}>Taxes</Title>
        <Form.Item name="taxRate" className="w-full">
          <FloatingLabelSelect placeholder="Select tax rate">
            <Select.Option value="none">None</Select.Option>
            <Select.Option value="gst5">GST 5%</Select.Option>
            <Select.Option value="gst12">GST 12%</Select.Option>
            <Select.Option value="gst18">GST 18%</Select.Option>
            <Select.Option value="gst28">GST 28%</Select.Option>
          </FloatingLabelSelect>
        </Form.Item>
      </div>
    </div>
  );
};