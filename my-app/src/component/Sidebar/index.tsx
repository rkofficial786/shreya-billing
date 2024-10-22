import React, { useState } from "react";
import {
  FaBars,
  FaHome,
  FaShoppingCart,
  FaClipboardList,
  FaCog,
  FaChartLine,
  FaUsers,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaBox,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setTheme } from "../../store/user";
import { ColorPicker } from "antd";
import ThemeManager from "../ThemeManager";
import ThemeSwitcherModal from "../ThemeSwitchModal";

interface SidebarItem {
  icon: React.ReactNode;
  text: string;
  path: string;
  subItems?: Array<{ text: string; path: string }>;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const dispatch = useDispatch<any>();
  const { theme } = useSelector((state: any) => state.user);
  const [previouslyExpandedItems, setPreviouslyExpandedItems] = useState<
    Record<string, boolean>
  >({});
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = (): void => {
    setIsOpen(true);
    setExpandedItems(previouslyExpandedItems);
  };

  const handleMouseLeave = (): void => {
    setIsOpen(false);
    setPreviouslyExpandedItems(expandedItems);
    setExpandedItems({});
  };

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  const toggleExpand = (key: string): void => {
    setExpandedItems((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      setPreviouslyExpandedItems(newState);
      return newState;
    });
  };
  console.log(previouslyExpandedItems, "expanderd items");

  const sidebarItems: SidebarItem[] = [
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
      icon: <FaShoppingCart size={20} />,
      text: "Entries",
      path: "/PurchaseOrderForm",
      subItems: [
        { text: "Create Quote Order", path: "/PurchaseOrderForm/create" },
        // { text: "Create Purchase Entry", path: "/PurchaseEntryForm/create" },
        // { text: "View Purchase Form", path: "/GetPurchaseOrderForm" },
        { text: "Lorry Entry", path: "/LorryEntry/create" },
        // { text: "Lorry To Transport", path: "/LorrySentToTransport/create" },
        // { text: "View Lorry Entry", path: "/GetLorryEntry" },

        // { text: "Get Products", path: "/GetPurchaseEntry" },
        { text: "Stock In Godown", path: "/StockInGodown/create" },
        { text: "Purchase Return", path: "/PurchaseReturn/create" },
      ],
    },
    // {
    //   icon: <FaClipboardList size={20} />,
    //   text: "Add Category",
    //   path: "/Addcategory",
    // },
    // {
    //   icon: <FaClipboardList size={20} />,
    //   text: "Verify Purchase Order",
    //   path: "/VerifyPurchaseOrder",
    // },
    // {
    //   icon: <FaChartLine size={20} />,
    //   text: "Analytics",
    //   path: "/analytics",
    // },
    // {
    //   icon: <FaUsers size={20} />,
    //   text: "Customers",
    //   path: "/customers",
    // },
    // {
    //   icon: <FaCog size={20} />,
    //   text: "Settings",
    //   path: "/settings",
    // },
    {
      icon: <FaSignOutAlt size={20} />,
      text: "Logout",
      path: "/logout",
    },
  ];

  return (
    <div
    
      className={`h-screen bg-white border-r-2 text-gray-800 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      
      <div className="flex items-center justify-between h-16 px-4 text-gray-800">
        {isOpen && (
          <span className="text-xl font-semibold text-white">Menu</span>
        )}
      </div>

      <nav className="mt-8 px-2">
        {sidebarItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            text={item.text}
            isOpen={isOpen}
            active={location.pathname === item.path}
            onClick={() =>
              item.subItems
                ? toggleExpand(item.text)
                : handleNavigation(item.path)
            }
            expanded={expandedItems[item.text]}
            hasSubItems={!!item.subItems}
          >
            {item.subItems && expandedItems[item.text] && (
              <div className="ml-6 mt-2">
                {item.subItems.map((subItem, subIndex) => (
                  <SidebarItem
                    key={subIndex}
                    text={subItem.text}
                    isOpen={isOpen}
                    active={location.pathname === subItem.path}
                    onClick={() => handleNavigation(subItem.path)}
                    subItem
                  />
                ))}
              </div>
            )}
          </SidebarItem>
        ))}
      </nav>

      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 w-64">
          <div className="flex items-center px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg">
            <img
              src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
            />
            <div className="ml-3 flex-grow">
              <h3 className="text-lg font-semibold text-white">John Doe</h3>
              <p className="text-sm text-primary-100">Administrator</p>
            </div>
            <div className="flex gap-2">
              
              {/* <button className="text-primary-100 hover:text-white transition-colors duration-200">
                <FaCog size={20} />
              </button> */}
              <ThemeSwitcherModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarItemProps {
  icon?: React.ReactNode;
  text: string;
  isOpen: boolean;
  active?: boolean;
  onClick: () => void;
  expanded?: boolean;
  hasSubItems?: boolean;
  children?: React.ReactNode;
  subItem?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  isOpen,
  active = false,
  onClick,
  expanded,
  hasSubItems,
  children,
  subItem = false,
}) => {
  return (
    <div>
      <div
        className={`
        flex items-center py-3 px-2 mb-1 rounded-md cursor-pointer
        transition-colors duration-200  font-medium
        ${
          active
            ? "bg-primary-50 text-primary-500 border-l-2 border-primary-500"
            : "text-gray-900 hover:bg-primary-50"
        }
        ${subItem ? "pl-6" : ""}
      `}
        onClick={onClick}
      >
        {!subItem && icon && (
          <div className={`${isOpen ? "mr-3" : "mx-auto"}`}>{icon}</div>
        )}
        {isOpen && (
          <span className="text-md flex-grow text-nowrap">{text}</span>
        )}
        {isOpen && hasSubItems && (
          <div className="ml-auto">
            {expanded ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default Sidebar;
