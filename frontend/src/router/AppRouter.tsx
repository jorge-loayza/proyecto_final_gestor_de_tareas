import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { useAuth } from "../context/AuthContext";

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route
        element={
          isAuthenticated ? <Navigate replace to="/dashboard" /> : <Login />
        }
        path="/login"
      />
      <Route
        element={
          isAuthenticated ? <Dashboard /> : <Navigate replace to="/login" />
        }
        path="/dashboard"
      />
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
};

export default AppRouter;
