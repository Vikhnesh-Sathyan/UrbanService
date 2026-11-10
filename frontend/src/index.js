
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";
import { ToastProvider } from "./Context/ToastContext";
import Toast from "./Components/common/toast/Toast";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <ToastProvider>
      <App />
      <Toast />
    </ToastProvider>
  </React.StrictMode>
);
