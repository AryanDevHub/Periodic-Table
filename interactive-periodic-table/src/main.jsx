// FILE: src/main.jsx (This is the final and correct version)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// WHAT: Imports the single, consolidated global stylesheet.
// WHY: This is the only global CSS file needed for the entire application.
import './styles/global.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  // WHAT: StrictMode is a React tool that highlights potential problems in an app.
  <React.StrictMode>
    {/* WHAT: BrowserRouter enables client-side routing for the whole app. */}
    <BrowserRouter>
      {/* WHAT: AuthProvider makes user data and login/logout functions available to all components. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);