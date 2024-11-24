import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllItems } from "../../store/items";
import { Table, Input, Button, Space, Tooltip, Card, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import TransactionHeader from "../../component/TransactionHeader";

const Inventory = () => {
  const dispatch = useDispatch<any>();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const callGetAllItems = async () => {
    try {
      setLoading(true);
      const { payload } = await dispatch(getAllItems());
      if (payload.data.success) {
        setItems(payload.data.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callGetAllItems();
  }, []);

  const getFilteredItems = () => {
    return items.filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.itemCode.includes(searchText) ||
      item.hsn.toString().includes(searchText)
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <span className="font-medium">{text}</span>,
      width: '15%',
    },
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
      width: '10%',
      sorter: (a, b) => a.itemCode.localeCompare(b.itemCode),
    },
    {
      title: 'HSN',
      dataIndex: 'hsn',
      key: 'hsn',
      width: '10%',
      sorter: (a, b) => a.hsn - b.hsn,
    },
    {
      title: 'Unit',
      dataIndex: ['unit', 'baseUnit'],
      key: 'unit',
      width: '8%',
      filters: [
        { text: 'Box', value: 'Box' },
        { text: 'Unit', value: 'Unit' },
      ],
      onFilter: (value, record) => record.unit.baseUnit === value,
    },
    {
      title: 'Sale Price',
      key: 'salePrice',
      dataIndex: 'salePrice',
      width: '12%',
      sorter: (a, b) => a?.salePrice?.salePrice - b?.salePrice?.salePrice,
      render: (salePrice) => (
        <div>
          <div className="text-base font-medium">
            ₹{salePrice?.salePrice}
          </div>
          {salePrice?.discountPrice > 0 && (
            <div className="text-sm text-green-600">
              {salePrice?.discountPrice}% off
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Purchase Price',
      dataIndex: ['purchasePrice', 'purchasePrice'],
      key: 'purchasePrice',
      width: '12%',
      sorter: (a, b) => a?.purchasePrice?.purchasePrice - b?.purchasePrice?.purchasePrice,
      render: (price) => `₹${price}`,
    },
    {
      title: 'Stock',
      key: 'stock',
      dataIndex: 'stock',
      width: '12%',
      sorter: (a, b) => a?.stock?.openingQty - b?.stock?.openingQty,
      render: (stock) => (
        <Tooltip title={`Location: ${stock?.location}`}>
          <div>
            <div className="font-medium">{stock?.openingQty}</div>
            <div className="text-sm">
              Min: {stock?.minimumStock}
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Tax',
      dataIndex: 'taxes',
      key: 'taxes',
      width: '8%',
      sorter: (a, b) => a.taxes - b.taxes,
      render: (tax) => `${tax}%`,
    },
    {
      title: 'Status',
      key: 'status',
      width: '12%',
      render: (_, record) => {
        const stock = record?.stock?.openingQty;
        const minStock = record?.stock?.minimumStock;
        let status = {
          color: 'success',
          text: 'In Stock'
        };
        
        if (stock <= minStock) {
          status = {
            color: 'error',
            text: 'Low Stock'
          };
        } else if (stock <= minStock * 1.5) {
          status = {
            color: 'warning',
            text: 'Medium Stock'
          };
        }
        
        return <Tag color={status?.color}>{status.text}</Tag>;
      },
      filters: [
        { text: 'In Stock', value: 'in_stock' },
        { text: 'Medium Stock', value: 'medium_stock' },
        { text: 'Low Stock', value: 'low_stock' },
      ],
      onFilter: (value, record) => {
        const stock = record?.stock?.openingQty;
        const minStock = record?.stock?.minimumStock;
        
        switch(value) {
          case 'low_stock':
            return stock <= minStock;
          case 'medium_stock':
            return stock > minStock && stock <= minStock * 1.5;
          case 'in_stock':
            return stock > minStock * 1.5;
          default:
            return true;
        }
      },
    },
  ];

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
        <TransactionHeader title="Inventory Management" />
        
          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search items..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button 
              type="primary"
              icon={<ReloadOutlined />}
              onClick={callGetAllItems}
            >
              Refresh
            </Button>
          </Space>
        </div>
        
        <Table
          columns={columns}
          dataSource={getFilteredItems()}
          rowKey="_id"
          loading={loading}
          pagination={{
            total: getFilteredItems().length,
            pageSize: 10,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 1300 }}
        />
      </div>
    </Card>
  );
};

export default Inventory;