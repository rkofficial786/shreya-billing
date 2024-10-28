import React from "react";
import { Row, Col, Typography } from "antd";
import {
  WalletOutlined,
  BankOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  CreditCardOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { StatCard } from "./StatCard";
import { SalesChart } from "./SalesChart";
import InventoryDashboard from "./InventoryTable";


const { Title } = Typography;

const Dashboard = () => {
  const salesData = [
    { name: "1 Oct", value: 200 },
    { name: "7 Oct", value: 400 },
    { name: "14 Oct", value: 600 },
    { name: "21 Oct", value: 800 },
    { name: "28 Oct", value: 1000 },
    { name: "31 Oct", value: 1000 },
  ];

  const inventoryData = [
    {
      key: "1",
      item: "Sample Item",
      stock: -10,
      status: "Low Stock",
      alert: "critical",
      progress: 0,
    },
    {
      key: "2",
      item: "Product A",
      stock: 45,
      status: "In Stock",
      alert: "success",
      progress: 75,
    },
    {
      key: "3",
      item: "Product B",
      stock: 5,
      status: "Running Low",
      alert: "warning",
      progress: 15,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={4} style={{ marginBottom: "24px" }}>
        Dashboard Overview
      </Title>

      {/* Top Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Sale (Oct)"
            value={1000}
            trend={12}
            progress={75}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Cash In Hand"
            value={10900}
            icon={WalletOutlined}
            color="#52c41a"
            progress={100}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Bank Balance"
            value={0}
            icon={BankOutlined}
            progress={0}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Payments"
            value={9900}
            trend={-5}
            color="#faad14"
            progress={45}
          />
        </Col>
      </Row>

      {/* Charts and Tables Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <SalesChart data={salesData} />
        </Col>
        <Col xs={24} lg={8}>
          <InventoryDashboard />
        </Col>
      </Row>

      {/* Bottom Stats Row */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Sale Orders"
            value={1}
            icon={ShoppingCartOutlined}
            color="#1890ff"
            subText="Open Sale Orders: 1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Delivery Challan"
            value={1}
            icon={CarOutlined}
            color="#722ed1"
            subText="Pending Deliveries: 1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Loan Accounts"
            value={0}
            icon={CreditCardOutlined}
            color="#13c2c2"
            subText="Total Credit: ₹0.00"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Open Orders"
            value={100}
            icon={DollarOutlined}
            color="#eb2f96"
            subText="Amount: ₹100.00"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
