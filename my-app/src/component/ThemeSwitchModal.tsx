import React, { useState } from "react";
import { Modal, ColorPicker } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { PaletteIcon } from "lucide-react";
import { setTheme } from "../store/user";
import ThemeManager from "./ThemeManager";

const ThemeSwitcherModal = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.user.theme);

  const handleColorChange = (color) => {
    dispatch(setTheme(color.toHexString()));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-primary-500 hover:text-primary-800 transition-colors duration-200"
      >
        <PaletteIcon className="text-primary-500" size={20} />
      </button>

      <Modal
        title="Customize Theme"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        className="max-w-md"
      >
        <div className="space-y-6 py-4">
          {/* Color Picker Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="w-full">
              <ThemeManager />
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Color Palette Preview
            </h3>
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="bg-primary-100 w-10 h-10 rounded-md shadow-sm"></div>
                <span className="text-xs text-gray-500 mt-1">100</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary-300 w-10 h-10 rounded-md shadow-sm"></div>
                <span className="text-xs text-gray-500 mt-1">300</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary-500 w-10 h-10 rounded-md shadow-sm"></div>
                <span className="text-xs text-gray-500 mt-1">500</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary-700 w-10 h-10 rounded-md shadow-sm"></div>
                <span className="text-xs text-gray-500 mt-1">700</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary-900 w-10 h-10 rounded-md shadow-sm"></div>
                <span className="text-xs text-gray-500 mt-1">900</span>
              </div>
            </div>
          </div>

          {/* Sample UI Elements */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Example Elements
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors">
                Primary Button
              </button>
              <div className="w-full bg-primary-50 border border-primary-200 text-primary-900 p-4 rounded-md">
                Content Panel Example
              </div>
              <div className="flex gap-2">
                <div className="bg-primary-100 text-primary-900 px-3 py-1 rounded-full text-sm">
                  Tag
                </div>
                <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ThemeSwitcherModal;
