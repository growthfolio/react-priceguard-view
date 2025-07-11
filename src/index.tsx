import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
if (!clientId) {
  console.error("Google Client ID is missing. Check .env file.");
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <ToastContainer />
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

