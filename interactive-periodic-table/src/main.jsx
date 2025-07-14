// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';

// What: Importing our new AuthProvider.
// Why: We need to wrap our App with it to provide the authentication context.
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {
      /*
        What: Wrapping the entire App inside AuthProvider.
        Why: This makes the authentication state (user, login, logout)
        available to every single component inside App, no matter how deeply nested.
      */
      }
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);