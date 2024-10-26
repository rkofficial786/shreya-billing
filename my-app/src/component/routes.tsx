import { HashRouter, Route, Routes } from "react-router-dom";
import Party from "../pages/party";
import Home from "../pages/Home";
import Items from "../pages/items";
import AddItemPage from "../pages/items/add-item";
import SaleInvoices from "../pages/sale/saleInvoices";
import AddSale from "../pages/sale/saleInvoices/addSale";
import Quotation from "../pages/sale/quotation";

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          {/* All child routes will render inside Layout's Outlet */}

          <Route path="/party" element={<Party />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/add-item" element={<AddItemPage />} />
          <Route path="/sale/invoices" element={<SaleInvoices />} />
          <Route path="/sale/invoices/add-sale" element={<AddSale />} />
          <Route path="/sale/quotation" element={<Quotation />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Router;
