import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getAllParties } from "../../../store/parties";
import { getAllItemsBySearch, getAllItems } from "../../../store/items";
import { createPos } from "../../../store/sale/pos";

import ProductSearch from "./ProductSearch";
import SelectedProducts from "./SelectedProducts";
import CustomerDetails from "./CustomerDetails";
import PaymentDetails from "./PaymentDetails";
import { Button, Card } from "antd";
import toast from "react-hot-toast";
import BillPdf from "./Bill";

const POS = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const dispatch = useDispatch<any>();
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const { parties } = useSelector((state: any) => state.party);

  console.log(parties, "parties");
  useEffect(() => {
    const callGetAllParty = async () => {
      await dispatch(getAllParties());
    };
    callGetAllParty();
  }, []);

  const callGetAllItems = async (value) => {
    const { payload } = await dispatch(getAllItemsBySearch(value));
    if (payload.data.success) {
      const items = payload.data.items;
      const data = items.map((item, index) => ({
        key: index + 1,
        id: item._id,
        code: item.itemCode,
        name: item.name,
        tax: item?.taxes,
        unit: item.unit.baseUnit,
        price: item.salePrice.salePrice,
        stock: item.stock.openingQty,
        quantity: 1,
      }));
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    callGetAllItems(value);
  };

  const addProduct = (product) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setSearchResults([]);
    setSearchText("");
  };

  const handleCustomerSelect = (customerId) => {
    const customer = parties.find((c) => c._id === customerId);
    setSelectedCustomer(customer);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amountReceived) {
      toast.error("Please Enter Amount Received");
      return;
    }
    console.log(selectedCustomer, "customerid");
    const payloadApi = {
      customer: selectedCustomer.id,
      items: selectedProducts.map((item) => ({
        itemCode: item.code,
        itemName: item.name,
        qty: item.quantity,
        unit: item.unit,
        pricePerUnit: item.price,
        discount: item.discount || 0,
        taxApplied: (item?.price * item?.quantity * (item?.tax / 100))?.toFixed(2),
        total: selectedProducts
          .reduce(
            (sum, item) =>
              sum +
              item.price * item.quantity +
              item.price * item.quantity * (item.tax / 100) -
              (item.discount || 0),
            0
          )
          .toFixed(2),
      })),
      paymentMode: paymentMode,
      amountReceived: amountReceived,
    };

    try {
      const { payload } = await dispatch(createPos(payloadApi));
      if (payload.data.success) {
        setSaved(true);
        setShowPdfModal(true);
      }
    } catch (error) {
      console.error("Error creating POS:", error);
    }
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  const updateDiscount = (productId, discount) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product.id === productId ? { ...product, discount } : product
      )
    );
  };
  const handleClear = () => {
    setSaved(false);
    setAmountReceived("");
    setSelectedCustomer(null);
    setSelectedProducts([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <ProductSearch
          searchText={searchText}
          handleSearch={handleSearch}
          searchResults={searchResults}
          addProduct={addProduct}
          parties={parties}
          handleCustomerSelect={handleCustomerSelect}
          saved={saved}
          handleClear={handleClear}
        />
        <SelectedProducts
          selectedProducts={selectedProducts}
          updateQuantity={updateQuantity}
          updateDiscount={updateDiscount}
        />
      </div>

      <Card className="w-[400px] m-4 flex flex-col  justify-between h-screen relative">
        <CustomerDetails selectedCustomer={selectedCustomer} />
        <PaymentDetails
          selectedProducts={selectedProducts}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          amountReceived={amountReceived}
          setAmountReceived={setAmountReceived}
          handleSubmit={handleSubmit}
        />
      </Card>

      {showPdfModal && (
        <BillPdf
          customer={{
            name: selectedCustomer.name,
            phone: selectedCustomer.phone,
            email: selectedCustomer.gstAndAddress.email,
          }}
          items={selectedProducts}
          total={selectedProducts
            .reduce(
              (sum, item) =>
                sum +
                item.price * item.quantity +
                item.price * item.quantity * (item.tax / 100) -
                (item.discount || 0),
              0
            )
            .toFixed(2)}
          visible={showPdfModal}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};

export default POS;
