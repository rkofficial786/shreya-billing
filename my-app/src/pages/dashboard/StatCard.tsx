import React from 'react';
import { Card, Statistic, Progress, Typography, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const StatCard = ({ 
  title, 
  value, 
  prefix = "₹", 
  suffix, 
  trend, 
  icon: Icon, 
  color = '#1890ff',
  progress,
  subText 
}:any) => {
  const cardStyle = {
    height: '100%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  };

  return (
    <Card style={cardStyle}>
      <Statistic
        title={<Text strong>{title}</Text>}
        value={value}
        precision={2}
        prefix={prefix}
        valueStyle={color ? { color } : undefined}
        suffix={
          suffix || (trend ? (
            <Text type={trend > 0 ? 'success' : 'warning'} style={{ fontSize: '14px', marginLeft: '8px' }}>
              {trend > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(trend)}%
            </Text>
          ) : Icon && <Icon />)
        }
      />
      {progress !== undefined && (
        <Progress 
          percent={progress} 
          showInfo={false} 
          strokeColor={color}
          status={progress === 0 ? 'exception' : 'active'}
        />
      )}
      {subText && (
        <>
          <Divider style={{ margin: '12px 0' }} />
          <Text type="secondary">{subText}</Text>
        </>
      )}
    </Card>
  );
};