import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { FaBars } from "react-icons/fa";
import Sidebar from "../../component/Sidebar";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`transition-all duration-300 ease-in-out `}>
        <Sidebar />
      </div>
      <div className="flex-grow overflow-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
