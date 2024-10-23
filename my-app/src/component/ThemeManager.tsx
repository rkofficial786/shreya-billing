import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { ColorPicker } from "antd";
import { setTheme } from "../store/user";

// Utility function to generate color variations
const generateColorPalette = (baseColor) => {
  // Convert hex to HSL for easier manipulation
  const hexToHSL = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const [h, s, l] = hexToHSL(baseColor);

  return {
    50: hslToHex(h, Math.max(s * 0.15, 10), 97),
    100: hslToHex(h, Math.max(s * 0.3, 20), 92),
    200: hslToHex(h, Math.max(s * 0.5, 30), 84),
    300: hslToHex(h, Math.max(s * 0.7, 40), 75),
    400: hslToHex(h, Math.max(s * 0.85, 50), 66),
    500: baseColor,
    600: hslToHex(h, s, Math.max(l * 0.85, 35)),
    700: hslToHex(h, s, Math.max(l * 0.7, 25)),
    800: hslToHex(h, s, Math.max(l * 0.55, 15)),
    900: hslToHex(h, s, Math.max(l * 0.4, 10)),
  };
};

const ThemeManager = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.user.theme);

  useEffect(() => {
    // Generate the color palette
    const palette = generateColorPalette(theme);

    // Update CSS variables
    const root = document.documentElement;
    Object.entries(palette).forEach(([shade, color]) => {
      root.style.setProperty(`--primary-${shade}`, color);
    });
  }, [theme]);

  const handleColorChange = (color) => {
    dispatch(setTheme(color.toHexString()));
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Theme Settings</h2>
      <div className="flex items-center gap-4">
        <ColorPicker value={theme} onChange={handleColorChange} />
      </div>
    </div>
  );
};

export default ThemeManager;
