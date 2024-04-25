import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import store from "@/redux/store.ts";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <div className="container mx-auto">
        <App />
      </div>
    </Provider>
  </React.StrictMode>,
);
