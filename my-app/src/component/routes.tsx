import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Party from "../pages/party";
import Home from "../pages/Home";
import Items from "../pages/items";
import AddItemPage from "../pages/items/add-item";
import SaleInvoices from "../pages/sale/saleInvoices";
import AddSale from "../pages/sale/saleInvoices/addSale";
import Estimates from "../pages/sale/estimates";
import SaleOrder from "../pages/sale/saleOrder";
import DeliveryChallan from "../pages/sale/deliverChllan";
import AddSaleOrder from "../pages/sale/saleOrder/addSaleOrder";
import AddChallan from "../pages/sale/deliverChllan/addDeliveryChallan";
import AddQuotation from "../pages/sale/estimates/addQuotation";
import CreditNote from "../pages/sale/creditNote";
import AddCreditNote from "../pages/sale/creditNote/addCreditNote";
import PaymentInVoice from "../pages/sale/payymentIn";
import Dashboard from "../pages/dashboard";
import Pos from "../pages/sale/POS";
import Inventory from "../pages/inventory";
import { useSelector } from "react-redux";
import Login from "../pages/auth";
import { ProtectedRoute } from "../utils/privateRoute";

function Router() {
  const { token } = useSelector((state: any) => state.auth);
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {" "}
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path="/party" element={<Party />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<Items />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/items/add-item" element={<AddItemPage />} />
          <Route path="/sale/invoices" element={<SaleInvoices />} />
          <Route path="/sale/invoices/add-sale" element={<AddSale />} />
          <Route path="/sale/quotation" element={<Estimates />} />
          <Route path="/sale/quotation/add" element={<AddQuotation />} />
          <Route path="/sale/order" element={<SaleOrder />} />
          <Route path="/sale/credit-note" element={<CreditNote />} />
          <Route path="/sale/payment-invoice" element={<PaymentInVoice />} />
          <Route path="/sale/credit-note/add" element={<AddCreditNote />} />

          <Route path="/sale/order/add" element={<AddSaleOrder />} />
          <Route path="/sale/delivery-challan" element={<DeliveryChallan />} />
          <Route path="/sale/delivery-challan/add" element={<AddChallan />} />
          <Route path="/sale/pos" element={<Pos />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Router;
