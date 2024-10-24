import React from 'react';
import { Card, Statistic } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  WalletOutlined, 
  ExclamationCircleOutlined, 
  DollarOutlined 
} from '@ant-design/icons';

const StatisticCard = ({ 
  title, 
  value, 
  prefix = "₹", 
  precision = 2, 
  trend = null, 
  trendValue = 0,
  icon,
  bgColor, 
  textColor,
  borderColor,
  description
}) => (
  <Card 
    className={`hover:shadow-lg transition-all duration-300 ${bgColor} border-l-4 ${borderColor}`}
    bodyStyle={{ padding: '20px' }}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className={`font-medium ${textColor}`}>{title}</span>
        </div>
        <Statistic
          value={value}
          prefix={prefix}
          precision={precision}
          className={textColor}
        />
        {/* {trend !== null && (
          <div className={`flex items-center mt-2 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )}
            <span className="ml-1">{trendValue}% from last month</span>
          </div>
        )}
        {description && (
          <p className={`mt-2 text-sm opacity-75 ${textColor}`}>
            {description}
          </p>
        )} */}
      </div>
    </div>
  </Card>
);

const SalesStatistics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 max-w-4xl">
      {/* Paid Amount Card */}
      <StatisticCard
        title="Paid Amount"
        value={900}
        trend="up"
        trendValue={15}
        icon={<WalletOutlined className="text-2xl text-emerald-600" />}
        bgColor="bg-primary-100"
        textColor="text-emerald-600"
        borderColor="border-primary-500"
        description="Total payments received this month"
      />

      {/* Unpaid Amount Card */}
      <StatisticCard
        title="Unpaid Amount"
        value={100}
        trend="down"
        trendValue={5}
        icon={<ExclamationCircleOutlined className="text-2xl text-blue-600" />}
        bgColor="bg-blue-50"
        textColor="text-blue-600"
        borderColor="border-blue-500"
        description="Outstanding payments to be collected"
      />

      {/* Total Amount Card */}
      <StatisticCard
        title="Total Amount"
        value={1000}
        trend="up"
        trendValue={10}
        icon={<DollarOutlined className="text-2xl text-orange-600" />}
        bgColor="bg-orange-50"
        textColor="text-orange-600"
        borderColor="border-orange-500"
        description="Total transaction value this period"
      />
    </div>
  );
};

export default SalesStatistics;