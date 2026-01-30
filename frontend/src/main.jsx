import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { CampContextProvider } from "./context/CampContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <CampContextProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </CampContextProvider>
    </AuthContextProvider>
  </BrowserRouter>,
);
