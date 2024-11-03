import React from "react";
import { Card, Statistic } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const StatisticCard = ({
  title,
  value,
  prefix = "₹",
  icon,
  bgColor,
  textColor,
  borderColor,
}) => (
  <Card
    className={`hover:shadow-lg transition-all duration-300 ${bgColor} border-l-4 ${borderColor}`}
  >
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <span className={`font-medium ${textColor}`}>{title}</span>
          </div>
          <div className={`text-2xl font-semibold ${textColor}`}>
            {prefix}
            {value.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const SalesStatistics = ({ salesInvoices = [] }) => {
  // Calculate total statistics
  const calculateStatistics = () => {
    return salesInvoices.reduce(
      (acc, invoice) => ({
        paidAmount: acc.paidAmount + invoice.received,
        unpaidAmount: acc.unpaidAmount + invoice.balanceDue,
        totalAmount: acc.totalAmount + invoice.amount,
      }),
      {
        paidAmount: 0,
        unpaidAmount: 0,
        totalAmount: 0,
      }
    );
  };

  const stats = calculateStatistics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-4xl">
      {/* Paid Amount Card */}
      <StatisticCard
        title="Paid Amount"
        value={stats.paidAmount}
        icon={<WalletOutlined className="w-6 h-6 text-primary-600" />}
        bgColor="bg-primary-50"
        textColor="text-primary-600"
        borderColor="border-primary-500"
      />

      {/* Unpaid Amount Card */}
      <StatisticCard
        title="Unpaid Amount"
        value={stats.unpaidAmount}
        icon={<ExclamationCircleOutlined className="w-6 h-6 text-blue-600" />}
        bgColor="bg-blue-50"
        textColor="text-blue-600"
        borderColor="border-blue-500"
      />

      {/* Total Amount Card */}
      <StatisticCard
        title="Total Amount"
        value={stats.totalAmount}
        icon={<DollarOutlined className="w-6 h-6 text-orange-600" />}
        bgColor="bg-orange-50"
        textColor="text-orange-600"
        borderColor="border-orange-500"
      />
    </div>
  );
};

export default SalesStatistics;
