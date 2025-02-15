import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Table,
  Switch,
  Card,
  Tooltip,
  Dropdown,
  Modal,
  Form,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  WhatsAppOutlined,
  MessageOutlined,
  HistoryOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { usePartyModal } from "./usePartyModal";
import PartyInfoModal from "./PartyInfoModal";
import AddPartyModal from "./AddPartyModal";
import { useDispatch } from "react-redux";
import {
  createParty,
  getAllParties,
  updateParty,
  deleteParty,
  getPartyTransactionById,
} from "../../store/parties";
import toast from "react-hot-toast";
import { removeEmptyFields } from "../../helpers/helper";

const Party = () => {
  const [form] = Form.useForm();
  const [selectedParty, setSelectedParty] = useState(null);
  const { modalConfig, openModal, closeModal, setLoading } = usePartyModal();
  const dispatch = useDispatch<any>();
  const [isAddPartyModalOpen, setIsAddPartyModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [allParties, setAllParties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { confirm } = Modal;

  const callGetAllParty = async () => {
    try {
      const { payload } = await dispatch(getAllParties());

      if (payload.status == 200) {
        if (payload.data.success) {
          setAllParties(payload.data.parties);
          if (payload.data.parties.length > 0) {
            setSelectedParty(payload.data.parties[0]);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callGetAllParty();
  }, []);

  const handleAddParty = async (values) => {
    console.log("Incoming values:", values);

    try {
      // Create FormData object
      const formData = new FormData();
  
      // Add basic fields
      formData.append('name', values.name);
      formData.append('gstin', values.gstin);
      formData.append('phone', values.phone);
  
      // Add nested objects as JSON strings
      formData.append('gstAndAddress', JSON.stringify({
        gstType: values.gstAndAddress.gstType,
        state: values.gstAndAddress.state,
        email: values.gstAndAddress.email,
        billingAddress: values.gstAndAddress.billingAddress,
        shipping: values.gstAndAddress.shipping || []
      }));
  
      formData.append('creditAndBlance', JSON.stringify({
        openingBalance: values.creditAndBlance.openingBalance ? Number(values.creditAndBlance.openingBalance) : undefined,
        date: values.creditAndBlance.date ? new Date(values.creditAndBlance.date).toISOString() : undefined,
        limit: values.creditAndBlance.limit ? Number(values.creditAndBlance.limit) : null
      }));
  
      // Add additional fields
      const processedAdditionalFields = {};
      if (values.additionalFields) {
        Object.entries(values.additionalFields).forEach(([key, value]) => {
          if (key && value) {
            processedAdditionalFields[key] = value;
          }
        });
      }
      formData.append('additionalFields', JSON.stringify({
        fields: processedAdditionalFields,
        showInPrint: false
      }));
  
      // Handle attachments
      if (values.attachments && values.attachments.length > 0) {
        formData.append('attachments', JSON.stringify(
          values.attachments.map(attachment => ({
            key: attachment.key
          }))
        ));
  
        // Add files
        for (const attachment of values.attachments) {
          // Convert base64 to blob
          const base64Response = await fetch(attachment.file.base64);
          const blob = await base64Response.blob();
          
          // Create file from blob
          const file = new File([blob], attachment.file.name, { type: attachment.file.type });
          
          // Append file to formData with 'img' field name as expected by backend
          formData.append('img', file);
        }
      }
      if (editingParty) {
        // Handle edit
        const { payload } = await dispatch(
          updateParty({
            id: editingParty._id,
            data: formData,
          })
        );

        if (payload.data.success) {
          toast.success("Party updated successfully");
          setEditingParty(null);
          form.resetFields();
          callGetAllParty();
        } else {
          toast.error(payload.data.msg || "Failed to update party");
        }
      } else {
        // Handle create
        const { payload } = await dispatch(createParty(formData));

        if (payload.data.success) {
          toast.success("Party added successfully");
          form.resetFields();
          callGetAllParty();
        } else {
          toast.error(payload.data.msg || "Failed to create party");
        }
      }
      setIsAddPartyModalOpen(false);
    } catch (error) {
      console.error("Error handling party:", error);
      toast.error(
        error.message || "An error occurred while processing the request"
      );
    }
  };
  const handleEditParty = (party, e) => {
    console.log(party, "party");

    setEditingParty(party);
    setIsAddPartyModalOpen(true);
  };

  const handleDeleteParty = (party, e) => {
    // e.stopPropagation();
    confirm({
      title: "Are you sure you want to delete this party?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete ${party.name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          const { payload } = await dispatch(deleteParty(party._id));
          if (payload.data.success) {
            toast.success("Party deleted successfully");
            if (selectedParty?._id === party._id) {
              setSelectedParty(null);
            }
            callGetAllParty();
          } else {
            toast.error(payload.data.msg);
          }
        } catch (error) {
          console.error("Error deleting party:", error);
          toast.error("Failed to delete party");
        }
      },
    });
  };

  const callGetTransactionOfParty = async () => {
    try {
      const { payload } = await dispatch(
        getPartyTransactionById(selectedParty._id)
      );

      console.log(payload, "payload trasnaaction");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selectedParty, "selelctd party");

  useEffect(() => {
    callGetTransactionOfParty();
  }, [selectedParty]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const createPayload = (values) => {
        // Start with existing party data
        const existingData = {
          name: selectedParty.name,
          gstin: selectedParty.gstin,
          phone: selectedParty.phone,
          gstAndAddress: {
            gstType: selectedParty.gstAndAddress?.gstType,
            state: selectedParty.gstAndAddress?.state,
            email: selectedParty.gstAndAddress?.email,
            billingAddress: selectedParty.gstAndAddress?.billingAddress,
            shipping: selectedParty.gstAndAddress?.shipping,
          },
          creditAndBlance: {
            openingBalance: selectedParty.creditAndBlance?.openingBalance,
            date: selectedParty.creditAndBlance?.date,
            limit: selectedParty.creditAndBlance?.limit,
          },
          additionalFields: selectedParty.additionalFields,
        };

        // Update with new values
        const updatedData = {
          ...existingData,
          gstin: values.gstin || existingData.gstin,
          phone: values.phoneNumber || existingData.phone,
          gstAndAddress: {
            ...existingData.gstAndAddress,
            email: values.email || existingData.gstAndAddress?.email,
            billingAddress:
              values.addressLine1 || existingData.gstAndAddress?.billingAddress,
          },
          creditAndBlance: {
            ...existingData.creditAndBlance,
            limit: values.creditLimit
              ? Number(values.creditLimit)
              : existingData.creditAndBlance?.limit,
          },
        };

        // Clean up the payload to remove empty or undefined fields
        return removeEmptyFields(updatedData);
      };

      const { payload } = await dispatch(
        updateParty({
          id: selectedParty._id,
          data: createPayload(values),
        })
      );

      if (payload.data.success) {
        closeModal();
        callGetAllParty();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParties = allParties.filter((party) =>
    party.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBalance = (party) => {
    return party.creditAndBlance?.openingBalance || 0;
  };

  const getPartyMenuItems = (party) => ({
    items: [
      {
        key: "1",
        label: "Edit",
        onClick: (e) => handleEditParty(party, e),
      },
      {
        key: "2",
        label: "Delete",
        danger: true,
        onClick: (e) => handleDeleteParty(party, e),
      },
    ],
  });

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
      render: (total) => `₹ ${total?.toFixed(2) || "0.00"}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "BALANCE",
      dataIndex: "balance",
      key: "balance",
      render: (balance) => `₹ ${balance?.toFixed(2) || "0.00"}`,
      sorter: (a, b) => a.balance - b.balance,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white shadow-crisp overflow-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button type="text" icon={<SearchOutlined />} />
              <Input
                placeholder="Search parties..."
                className="flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="primary"
            onClick={() => {
              setEditingParty(null);
              setIsAddPartyModalOpen(true);
            }}
            className="w-full h-10 flex items-center justify-center gap-2 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <PlusOutlined className="text-lg transition-transform group-hover:rotate-90 duration-300" />
              <span className="tracking-wide">Add Party</span>
            </span>
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <span className="absolute inset-x-0 top-0 h-px bg-white/20" />
            <span className="absolute inset-x-0 bottom-0 h-px bg-black/20" />
          </Button>
        </div>
        <AddPartyModal
          form={form}
          visible={isAddPartyModalOpen}
          onClose={() => {
            setIsAddPartyModalOpen(false);
            setEditingParty(null);
            form.resetFields();
          }}
          onSubmit={handleAddParty}
          initialValues={editingParty}
        />

        <div className="overflow-y-auto">
          {filteredParties.map((party) => (
            <div
              key={party._id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedParty?._id === party._id ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedParty(party)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{party.name}</span>
                <div className="flex items-center gap-2">
                  <span
                    title={getBalance(party)}
                    className={`text-nowrap overflow-hidden ${
                      getBalance(party) >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹ {getBalance(party).toFixed(2) || 'N/A'}
                  </span>
                  <Dropdown
                    menu={getPartyMenuItems(party)}
                    trigger={["click"]}
                    placement="bottomRight"
                    // onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="text"
                      icon={<MoreOutlined />}
                      className="hover:bg-gray-100"
                    />
                  </Dropdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedParty && (
        <div className="flex-1 p-6 overflow-auto">
          <Card className="mb-6 shadow-crisp">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  {selectedParty.name}
                </h1>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Phone:</span>
                    {selectedParty.phone ? (
                      <span>{selectedParty.phone}</span>
                    ) : (
                      <Button
                        type="link"
                        onClick={() => openModal("phone", "Add Phone No.")}
                        className="p-0"
                      >
                        Add Phone No.
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Email:</span>
                    {selectedParty.gstAndAddress?.email ? (
                      <span>{selectedParty.gstAndAddress.email}</span>
                    ) : (
                      <Button
                        onClick={() => openModal("email", "Add Email ID")}
                        type="link"
                        className="p-0"
                      >
                        Add Email ID
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Credit Limit:</span>
                    {selectedParty.creditAndBlance?.limit ? (
                      <span>
                        ₹ {selectedParty.creditAndBlance.limit.toFixed(2)}
                      </span>
                    ) : (
                      <Button
                        onClick={() => openModal("credit", "Set Credit Limit")}
                        type="link"
                        className="p-0"
                      >
                        Set Credit Limit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-gray-500">Address:</span>
                  {selectedParty.gstAndAddress?.billingAddress ? (
                    <span>{selectedParty.gstAndAddress.billingAddress}</span>
                  ) : (
                    <Button
                      onClick={() => openModal("address", "Add Address")}
                      type="link"
                      className="p-0"
                    >
                      Add Address
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-gray-500">GSTIN:</span>
                  {selectedParty.gstin ? (
                    <span>{selectedParty.gstin}</span>
                  ) : (
                    <Button
                      onClick={() => openModal("gstin", "Add GSTIN")}
                      type="link"
                      className="p-0"
                    >
                      Add GSTIN
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-gray-500">Party Status:</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              {selectedParty.phone && (
                <Tooltip title="WhatsApp">
                  <Button
                    icon={<WhatsAppOutlined />}
                    shape="circle"
                    onClick={() =>
                      window.open(`https://wa.me/${selectedParty.phone}`)
                    }
                  />
                </Tooltip>
              )}
              {selectedParty.phone && (
                <Tooltip title="Message">
                  <Button
                    icon={<MessageOutlined />}
                    shape="circle"
                    onClick={() => window.open(`sms:${selectedParty.phone}`)}
                  />
                </Tooltip>
              )}
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

          <Card title="TRANSACTIONS" className="shadow-crisp min-h-[80vh]">
            <Table
              columns={columns}
              dataSource={[]} // Replace with actual transaction data when available
              pagination={{ pageSize: 10 }}
              className="w-full"
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Party;
