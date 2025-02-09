import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Obtém as variáveis de ambiente
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const appName = import.meta.env.VITE_APP_NAME;

if (!clientId) {
  console.error('Client ID não configurado. Verifique o arquivo .env');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App appName={appName} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
) 