import React from "react";
import {
  Card,
  Table,
  Typography,
  Space,
  Tabs,
  Progress,
  Tag,
  Statistic,
} from "antd";
import {
  InboxOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const InventoryDashboard = () => {
  const stockData = {
    stockValue: 0,
    cashInHand: 10900,
    bankAccounts: 0,
    loanAccounts: 0,
    lowStocks: [
      {
        item: "Sample Item",
        quantity: -10,
      },
    ],
  };

  const saleData = {
    orders: {
      count: 1,
      amount: 100,
    },
    delivery: {
      count: 1,
      amount: 100,
    },
  };

  const purchaseData = {
    orders: {
      count: 0,
      amount: 0,
    },
  };

  const StockInventoryTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <Title level={5}>Stock Value</Title>
          <Statistic value={stockData.stockValue} prefix="₹" precision={2} />
          <div className="mt-4">
            <Text className="text-red-500">Low Stocks</Text>
            {stockData.lowStocks.map((item, index) => (
              <div key={index} className="flex justify-between mt-2">
                <Text>{item.item}</Text>
                <Text type="danger">{item.quantity}</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card className="shadow-sm">
          <Title level={5}>Cash & Bank</Title>
          <div className="space-y-4">
            <div>
              <Text>Cash In Hand</Text>
              <Statistic
                value={stockData.cashInHand}
                prefix="₹"
                precision={2}
              />
            </div>
            <div>
              <Text>Bank Accounts</Text>
              <Statistic
                value={stockData.bankAccounts}
                prefix="₹"
                precision={2}
              />
            </div>
            <div>
              <Text>Loan Accounts</Text>
              <Statistic
                value={stockData.loanAccounts}
                prefix="₹"
                precision={2}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const SaleTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="shadow-sm">
        <Title level={5}>Sale Orders</Title>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Text>No. Of Open Orders</Text>
            <Text>{saleData.orders.count}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Open Sale Orders Amount</Text>
            <Text>{saleData.orders.amount}</Text>
          </div>
        </div>
      </Card>

      <Card className="shadow-sm">
        <Title level={5}>Delivery Challan</Title>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Text>No. Of Open Challans</Text>
            <Text>{saleData.delivery.count}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Delivery Challan Amount</Text>
            <Text>{saleData.delivery.amount}</Text>
          </div>
        </div>
      </Card>
    </div>
  );

  const PurchaseTab = () => (
    <Card className="shadow-sm">
      <Title level={5}>Purchase Orders</Title>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Text>No. Of Purchase Orders</Text>
          <Text>{purchaseData.orders.count}</Text>
        </div>
        <div className="flex justify-between">
          <Text>Purchase Orders Amount</Text>
          <Text>{purchaseData.orders.amount}</Text>
        </div>
      </div>
    </Card>
  );

  const items = [
    {
      key: "1",
      label: (
        <span>
          <InboxOutlined className="mr-2" />
          Stock Inventory
        </span>
      ),
      children: <StockInventoryTab />,
    },
    {
      key: "2",
      label: (
        <span>
          <ShoppingCartOutlined className="mr-2" />
          Sale
        </span>
      ),
      children: <SaleTab />,
    },
    {
      key: "3",
      label: (
        <span>
          <ShoppingOutlined className="mr-2" />
          Purchase
        </span>
      ),
      children: <PurchaseTab />,
    },
  ];

  return (
    <div className=" h-full w-full">
      <Card className="shadow-md h-full w-full">
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default InventoryDashboard;
