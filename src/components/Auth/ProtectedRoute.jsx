// src/components/Auth/ProtectedRoute.jsx

// What: Importing React and the necessary tools.
// Why: We need our `useAuth` hook to check the user's status and `Navigate` from react-router-dom to redirect them.
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

// What: A wrapper component that protects its children from unauthenticated access.
// Why: This allows us to protect any route in our application by simply wrapping it with this component.
const ProtectedRoute = ({ children }) => {
  // What: Get the authentication status from our context.
  // Why: This is the source of truth for whether a user is logged in.
  const { isAuthenticated, isAuthLoading } = useAuth();
  
  // What: Gets the current location/URL.
  // Why: So we can redirect the user back to the page they were trying to access after they log in.
  const location = useLocation();

  // What: If the context is still trying to verify the token, show a loading message.
  // Why: This prevents redirecting the user to the login page prematurely before we know for sure they're logged out.
  if (isAuthLoading) {
    return <div className="status-message">Authenticating...</div>;
  }

  // What: If the user is NOT authenticated...
  if (!isAuthenticated) {
    // Why: We use the Navigate component to redirect them to the /login page.
    // The `state` prop is used to pass along the original URL they were trying to visit.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // What: If the user IS authenticated...
  // Why: We render the children components that were passed into ProtectedRoute. This means we show them the page they are allowed to see.
  return children;
};

export default ProtectedRoute;