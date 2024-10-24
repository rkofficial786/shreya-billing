import React, { useState, useRef } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Table, 
  Button, 
  Card,
  InputNumber,
  Space,
  Divider,
  Switch,
  Upload,
  message,
  Radio
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  FileImageOutlined, 
  FileTextOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { FloatingLabelInput, FloatingLabelSelect, FloatingLabelTextArea } from '../../../../component/input';

const { Option } = Select;

const AddSale = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [docList, setDocList] = useState([]);
  const uploadRef = useRef();
  const docRef = useRef();

  const initialData = {
    invoiceNumber: '2',
    invoiceDate: '2024-10-25',
    paymentType: 'Cash',
    roundOff: -0.3,
    received: 258630,
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'ITEM',
      dataIndex: 'item',
      render: (_, record) => (
        <FloatingLabelInput 
          label="Enter item name"
          value={record.item}
          onChange={(e) => handleItemChange(record.key, 'item', e.target.value)}
        />
      ),
    },
    {
      title: 'QTY',
      dataIndex: 'quantity',
      width: 100,
      render: (_, record) => (
        <InputNumber
          min={1}
          className='py-2'
          value={record.quantity}
          onChange={(value) => handleItemChange(record.key, 'quantity', value)}
        />
      ),
    },
    {
      title: 'UNIT',
      dataIndex: 'unit',
      width: 120,
      render: (_, record) => (
        <FloatingLabelSelect 
          value={record.unit}
          onChange={(value) => handleItemChange(record.key, 'unit', value)}
        >
          <Option value="Bag">Bag</Option>
          <Option value="Btl">Btl</Option>
          <Option value="NONE">NONE</Option>
        </FloatingLabelSelect>
      ),
    },
    {
      title: 'PRICE/UNIT',
      dataIndex: 'price',
      width: 200,
      render: (_, record) => (
        <div className="flex items-start gap-2">
        <InputNumber
          className="w-32 py-2"
          value={record.price}
          onChange={(value) => handleItemChange(record.key, 'price', value)}
        />
        <Radio.Group 
          value={record.priceType} 
          onChange={(e) => handleItemChange(record.key, 'priceType', e.target.value)}
          size="small"
          className="flex flex-col gap-1"
        >
          <Radio value="withTax" className="text-xs">With Tax</Radio>
          <Radio value="withoutTax" className="text-xs">Without Tax</Radio>
        </Radio.Group>
      </div>
      ),
    },
    {
      title: 'TAX',
      dataIndex: 'tax',
      width: 200,
      render: (_, record) => (
        <div className="space-y-2">
          <FloatingLabelSelect
            className="w-full"
            value={record.tax}
            onChange={(value) => handleItemChange(record.key, 'tax', value)}
          >
            <Option value="NONE">NONE</Option>
            <Option value="IGST@0.25%">IGST@0.25%</Option>
            <Option value="IGST@5%">IGST@5%</Option>
            <Option value="IGST@12%">IGST@12%</Option>
            <Option value="IGST@18%">IGST@18%</Option>
          </FloatingLabelSelect>
          {record.tax !== 'NONE' && (
            <div className="text-xs text-gray-500">
              Tax Amount: ₹{calculateTaxAmount(record).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      width: 120,
      render: (_, record) => (
        <div>
          <div className="font-medium">₹{calculateFinalAmount(record).toFixed(2)}</div>
          {record.tax !== 'NONE' && record.priceType === 'withoutTax' && (
            <div className="text-xs text-gray-500">
              Base: ₹{(record.quantity * record.price).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '',
      width: 50,
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(record.key)}
        />
      ),
    },
  ];

  const getTaxRate = (taxString) => {
    if (taxString === 'NONE') return 0;
    const percentage = parseFloat(taxString.match(/\d+(\.\d+)?/)[0]);
    return percentage / 100;
  };

  const calculateTaxAmount = (record) => {
    const baseAmount = record.quantity * record.price;
    const taxRate = getTaxRate(record.tax);

    if (record.priceType === 'withTax') {
      return (baseAmount * taxRate) / (1 + taxRate);
    } else {
      return baseAmount * taxRate;
    }
  };

  const calculateFinalAmount = (record) => {
    const baseAmount = record.quantity * record.price;
    const taxRate = getTaxRate(record.tax);

    if (record.priceType === 'withTax') {
      return baseAmount; // Price already includes tax
    } else {
      return baseAmount * (1 + taxRate);
    }
  };

  const handleAddRow = () => {
    const newKey = items.length + 1;
    setItems([...items, {
      key: newKey,
      item: '',
      quantity: 0,
      unit: 'NONE',
      price: 0,
      priceType: 'withoutTax',
      tax: 'NONE',
    }]);
  };

  const handleDeleteRow = (key) => {
    setItems(items.filter(item => item.key !== key));
  };

  const handleItemChange = (key, field, value) => {
    setItems(items.map(item => 
      item.key === key ? { ...item, [field]: value } : item
    ));
  };

  const handleImageUpload = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleDocumentUpload = {
    beforeUpload: (file) => {
      setDocList([...docList, file]);
      return false;
    },
    fileList: docList,
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + calculateFinalAmount(curr), 0);
  };

  return (
    <div className=" mx-auto p-2">
      
      <Card className="shadow-lg">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialData}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="Search by Name/Phone">
              <FloatingLabelSelect
                showSearch
                placeholder="Select customer"
                optionFilterProp="children"
              >
                <Option value="customer1">Customer 1</Option>
                <Option value="customer2">Customer 2</Option>
              </FloatingLabelSelect>
            </Form.Item>

            <Form.Item label="Phone No.">
              <FloatingLabelInput placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item label="Invoice Number">
              <FloatingLabelInput disabled value={initialData.invoiceNumber} />
            </Form.Item>

            <Form.Item label="Invoice Date">
              <DatePicker className="w-full py-3" />
            </Form.Item>

            <Form.Item label="State of Supply">
              <FloatingLabelSelect placeholder="Select state">
                <Option value="state1">State 1</Option>
                <Option value="state2">State 2</Option>
              </FloatingLabelSelect>
            </Form.Item>
          </div>
          <Divider />
          <Table
            columns={columns}
            dataSource={items}
            pagination={false}
            className="my-4"
          />

          <Button 
            type="dashed" 
            onClick={handleAddRow} 
            className="my-4"
            icon={<PlusOutlined />}
          >
            Add Row
          </Button>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Form.Item label="Payment Type">
                <FloatingLabelSelect defaultValue="Cash">
                  <Option value="Cash">Cash</Option>
                  <Option value="Credit">Credit</Option>
                </FloatingLabelSelect>
              </Form.Item>

              <Form.Item label="Description">
                <FloatingLabelTextArea rows={4} />
              </Form.Item>

              <Space direction="vertical" className="w-full">
                <Upload {...handleImageUpload} className="w-full">
                  <Button icon={<FileImageOutlined />} className="w-full">
                    Add Image
                  </Button>
                </Upload>
                <Upload {...handleDocumentUpload} className="w-full">
                  <Button icon={<FileTextOutlined />} className="w-full">
                    Add Document
                  </Button>
                </Upload>
              </Space>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Round Off</span>
                <Space>
                  <Switch defaultChecked />
                  <span>{initialData.roundOff}</span>
                </Space>
              </div>

              <div className="flex justify-between items-center">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Received</span>
                <Space>
                  <Switch defaultChecked />
                  <span>₹{initialData.received}</span>
                </Space>
              </div>

              <div className="flex justify-between items-center font-bold">
                <span>Balance</span>
                <span>
                  ₹{(initialData.received - calculateTotal()).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="default">Generate e-Invoice</Button>
            <Button type="primary" >Save</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddSale;