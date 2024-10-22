import { HashRouter, Route, Routes } from "react-router-dom";
import Party from "../pages/party";
import Home from "../pages/Home";

function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          {/* All child routes will render inside Layout's Outlet */}

          <Route path="party" element={<Party />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default Router;
