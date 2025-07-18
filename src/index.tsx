import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";

// Obtenha as variáveis de ambiente
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const skipAuthString = process.env.REACT_APP_SKIP_AUTH || 'false';
const skipAuth = skipAuthString === 'true';

// Para debug
console.log('Env Debug - SKIP_AUTH:', skipAuthString);
console.log('Env Debug - ENV MODE:', process.env.NODE_ENV);
console.log('Env Debug - CLIENT_ID:', clientId ? (clientId.length > 0 && clientId !== 'your_google_client_id_here' ? 'Disponível' : 'Inválido') : 'Não definido');

// Wrapper component que lida com o Google OAuth
const AppWrapper = () => {
  // Se não tem client ID ou está em modo skip auth, renderiza sem Google OAuth
  // Verifica explicitamente se skipAuth é true ou se clientId é inválido/vazio
  if (skipAuth || !clientId || clientId === 'your_google_client_id_here' || clientId.trim() === '') {
    console.log('Renderizando sem GoogleOAuthProvider (skipAuth=true ou clientId inválido)');
    return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastContainer />
        <AuthProvider>
          <ThemeProvider>
            <WebSocketProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </WebSocketProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    );
  }

  console.log('Renderizando com GoogleOAuthProvider (clientId disponível)');
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastContainer />
        <AuthProvider>
          <ThemeProvider>
            <WebSocketProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </WebSocketProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

