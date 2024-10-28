import React from "react";
import logo from "./logo.svg";
import "antd/dist/reset.css"; // Import Ant Design styles

import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Party from "./pages/party";
import Router from "./component/routes";
import { ConfigProvider } from "antd";
import { useSelector } from "react-redux";

function App() {
  const { theme: themeColor } = useSelector((state: any) => state.user);
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: themeColor,
          borderRadius: 2,

          // Alias Token
        },
      }}
    >
      <Router />
     
    </ConfigProvider>
  );
}

export default App;
