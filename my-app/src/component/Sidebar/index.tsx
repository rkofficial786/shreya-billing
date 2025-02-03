import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaShoppingBag,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronDown,
  FaChevronRight,
  FaMoneyBill,
} from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import { FaStamp } from "react-icons/fa";
import { Tooltip, Avatar, Badge, Popconfirm, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeSwitcherModal from "../ThemeSwitchModal";
import ThemeManager from "../ThemeManager";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      icon: <FaHome size={20} />,
      text: "Dashboard",
      path: "/",
    },
    {
      icon: <FaUser size={20} />,
      text: "Party",
      path: "/party",
    },
    {
      icon: <FaShoppingBag size={20} />,
      text: "Items",
      path: "/items",
    },
    {
      icon: <AiFillShop size={20} />,
      text: "Inventory",
      path: "/inventory",
    },
    {
      icon: <FaMoneyBill size={20} />,
      text: "POS",
      path: "/sale/pos",
    },
    {
      icon: <FaStamp size={20} />,
      text: "Sale",
      path: "/sale",
      subItems: [
        { text: "Sale Invoices", path: "/sale/invoices" },
        { text: "Quotation", path: "/sale/quotation" },
        { text: "Payment Invoice", path: "/sale/payment-invoice" },
        { text: "Sale Order", path: "/sale/order" },
        { text: "Deliver Challan", path: "/sale/delivery-challan" },
        { text: "Sale Return/CR", path: "/sale/credit-note" },
        // { text: "POS", path: "/sale/pos" },
      ],
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleExpand = (key) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigation = (path, item = null) => {
    if (item?.subItems) {
      toggleExpand(item.text);
    } else {
      navigate(path);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-between  max-h-[100vh] overflow-y-auto overflow-x-hidden border-r transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
      style={{
        background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
      }}
    >
      <div>
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-white hover:bg-gray-50 border shadow-md rounded-full p-1.5 transition-colors z-10"
        >
          <FaChevronLeft
            size={16}
            className={`text-gray-600 transition-transform duration-300 ${
              isOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b bg-white/50 backdrop-blur-sm">
          {isOpen ? (
            <>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <div className="mr-2">
                <ThemeSwitcherModal />
              </div>
            </>
          ) : (
            <span className="text-xl font-bold text-primary-500 mx-auto">
              {user.name.slice(0, 1)}
            </span>
          )}
        </div>

        <div className="absolute -top-28 opacity-0">
          <ThemeManager />
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3">
          {sidebarItems.map((item, index) => (
            <div key={index} className="mb-2">
              <Tooltip
                title={!isOpen ? item.text : ""}
                placement="right"
                mouseEnterDelay={0.5}
              >
                <button
                  title={item.text}
                  onClick={() => handleNavigation(item.path, item)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all
                  ${isOpen ? "justify-start" : "justify-center"}
                  ${
                    isActive(item.path)
                      ? "bg-primary-50 text-primary-500 shadow-sm border-l-4 border-primary-500"
                      : "text-gray-600 hover:bg-primary-50 hover:text-primary-500"
                  }
                  group relative
                `}
                >
                  <span
                    className={`flex items-center ${
                      !isOpen && "justify-center"
                    } w-full`}
                  >
                    {item.icon}
                    {isOpen && (
                      <span className="ml-3 font-medium whitespace-nowrap">
                        {item.text}
                      </span>
                    )}
                    {isOpen && item.subItems && (
                      <span className="ml-auto">
                        {expandedItems[item.text] ? (
                          <FaChevronDown size={12} />
                        ) : (
                          <FaChevronRight size={12} />
                        )}
                      </span>
                    )}
                  </span>
                </button>
              </Tooltip>

              {/* Submenu */}
              {isOpen && item.subItems && expandedItems[item.text] && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <Tooltip
                      key={subIndex}
                      title={!isOpen ? subItem.text : ""}
                      placement="right"
                    >
                      <button
                        onClick={() => handleNavigation(subItem.path)}
                        className={`w-full flex items-center px-4 py-2.5 rounded-md
                        ${
                          isActive(subItem.path)
                            ? "bg-primary-50 text-primary-500"
                            : "text-gray-600 hover:bg-primary-50 hover:text-primary-500"
                        }
                        transition-colors text-sm group
                      `}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full
                        ${
                          isActive(subItem.path)
                            ? "bg-primary-500"
                            : "bg-gray-400 group-hover:bg-primary-500"
                        }
                        transition-colors
                      `}
                        />
                        <span className="ml-3">{subItem.text}</span>
                      </button>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 px-3">
            <Popconfirm
              title="Logout"
              description="Are you sure you want to logout?"
              onConfirm={async () => {
                try {
                  dispatch(logout());
                  navigate("/");
                } catch (error) {
                  message.error("Logout failed");
                }
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                className: "bg-red-500 hover:!bg-red-600",
              }}
            >
              <button
                className={`w-full border-none flex items-center px-1 py-3 rounded-lg transition-all
       ${isOpen ? "justify-start" : "justify-center"}
       text-red-500 hover:bg-red-50 border 
     `}
              >
                <FaSignOutAlt size={20} />
                {isOpen && <span className="ml-3 font-medium">Logout</span>}
              </button>
            </Popconfirm>
          </div>
        </nav>
      </div>
      {/* User Profile */}
      {isOpen && (
        <div className="bg-white rounded-lg p-4 shadow-lg border border-primary-100 hover:border-primary-300 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Badge dot status="success" offset={[-4, 36]}>
                <Avatar
                  size={45}
                  src="/api/placeholder/40/40"
                  className="!bg-primary-500 !text-lg font-semibold"
                >
                  {user?.name?.slice(0, 1)?.toUpperCase()}
                </Avatar>
              </Badge>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-800 !mb-0">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.role}</p>
              </div>
            </div>
            <Popconfirm
              title="Logout"
              description="Are you sure you want to logout?"
              onConfirm={async () => {
                try {
                  dispatch(logout());
                  navigate("/");
                } catch (error) {
                  message.error("Logout failed");
                }
              }}
              okText="Yes"
              cancelText="No"
              placement="topRight"
              okButtonProps={{
                className: "bg-red-500 hover:!bg-red-600",
              }}
            >
              <LogoutOutlined className="text-lg text-primary-500 hover:text-primary-700 transition-colors cursor-pointer" />
            </Popconfirm>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
