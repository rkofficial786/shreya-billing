import React, { useState } from "react";
import { Input, Button, Table, Switch, Card, Tooltip } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  WhatsAppOutlined,
  MessageOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { usePartyModal } from "./usePartyModal";
import PartyInfoModal from "./PartyInfoModal";
import AddPartyModal from "./AddPartyModal";

// Dummy data for parties
const dummyParties = [
  { id: 1, name: "Rupraj", balance: 100.0 },
  { id: 2, name: "John Doe", balance: 250.5 },
  { id: 3, name: "Alice Smith", balance: -150.75 },
];

// Dummy data for transactions
const dummyTransactions = [
  {
    key: "1",
    type: "Sale",
    number: 1,
    date: "20/10/2024",
    total: 1000.0,
    balance: 100.0,
  },
  {
    key: "2",
    type: "Purchase",
    number: 2,
    date: "19/10/2024",
    total: 500.0,
    balance: 200.0,
  },
];

const Party = () => {
  const [selectedParty, setSelectedParty] = useState(dummyParties[0]);
  const { modalConfig, openModal, closeModal, setLoading } = usePartyModal();

  const [isAddPartyModalOpen, setIsAddPartyModalOpen] = useState(false);

  const handleAddParty = async (values) => {
    try {
      // Make your API call here
      console.log("Submitting party data:", values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Update your party list here after successful API call
    } catch (error) {
      console.error("Error adding party:", error);
      throw error;
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Make API call here
      console.log("Submitting values:", values);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "NUMBER",
      dataIndex: "number",
      key: "number",
      sorter: (a, b) => a.number - b.number,
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      render: (total) => `₹ ${total.toFixed(2)}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "balance",
      render: (balance) => `₹ ${balance.toFixed(2)}`,
      sorter: (a, b) => a.balance - b.balance,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-crisp">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button type="text" icon={<SearchOutlined />} />
              <Input placeholder="Search parties..." className="flex-1" />
            </div>
          </div>
          <Button
            type="primary"
            
            onClick={() => setIsAddPartyModalOpen(true)}
            className="w-full h-10 flex items-center justify-center gap-2 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <PlusOutlined className="text-lg transition-transform group-hover:rotate-90 duration-300" />
              <span className="tracking-wide">Add Party</span>
            </span>

            {/* Hover effect overlay */}
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

            {/* Subtle gradient background */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Top highlight */}
            <span className="absolute inset-x-0 top-0 h-px bg-white/20" />

            {/* Bottom shadow */}
            <span className="absolute inset-x-0 bottom-0 h-px bg-black/20" />
          </Button>
        </div>
        <AddPartyModal
          visible={isAddPartyModalOpen}
          onClose={() => setIsAddPartyModalOpen(false)}
          onSubmit={handleAddParty}
        />

        {/* Party List */}
        <div className="overflow-y-auto">
          {dummyParties.map((party) => (
            <div
              key={party.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedParty.id === party.id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedParty(party)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{party.name}</span>
                <span
                  className={`${
                    party.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹ {party.balance.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Party Details Header */}
        <Card className="mb-6 shadow-crisp">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-4">{selectedParty.name}</h1>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Phone:</span>
                  <Button
                    type="link"
                    onClick={() => openModal("phone", "Add Phone No.")}
                    className="p-0"
                  >
                    Add Phone No.
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Email:</span>
                  <Button
                    onClick={() => openModal("email", "Add Email ID")}
                    type="link"
                    className="p-0"
                  >
                    Add Email ID
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">No Credit Limit Set:</span>
                  <Button
                    onClick={() => openModal("credit", "Set Credit Limit")}
                    type="link"
                    className="p-0"
                  >
                    Set Credit Limit
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-end space-x-2">
                <span className="text-gray-500">Address:</span>
                <Button
                  onClick={() => openModal("address", "Add Address")}
                  type="link"
                  className="p-0"
                >
                  Add Address
                </Button>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-gray-500">GSTIN:</span>
                <Button
                  onClick={() => openModal("gstin", "Add GSTIN")}
                  type="link"
                  className="p-0"
                >
                  Add GSTIN
                </Button>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-gray-500">Party Status:</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Tooltip title="WhatsApp">
              <Button icon={<WhatsAppOutlined />} shape="circle" />
            </Tooltip>
            <Tooltip title="Message">
              <Button icon={<MessageOutlined />} shape="circle" />
            </Tooltip>
            <Tooltip title="History">
              <Button icon={<HistoryOutlined />} shape="circle" />
            </Tooltip>
          </div>
        </Card>

        <PartyInfoModal
          {...modalConfig}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />

        {/* Transactions Table */}
        <Card title="TRANSACTIONS" className="shadow-crisp min-h-[80vh]">
          <Table
            columns={columns}
            dataSource={dummyTransactions}
            pagination={{ pageSize: 10 }}
            className="w-full"
          />
        </Card>
      </div>
    </div>
  );
};

export default Party;
