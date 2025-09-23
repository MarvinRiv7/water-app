import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/pages/LoginPage";
import ProtectedRoute from "./auth/components/ProtectedRoute";
import Dashboard from "./dashboard/Dashboard";
import ClientsPage from "./clients/pages/ClientsPage";
import Payments from "./payments/pages/Payments";
import AddClientPage from "./clients/pages/AddClientsPage";



function App() {
  return (

    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Clientes */}
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/add"
        element={
          <ProtectedRoute>
            <AddClientPage />
          </ProtectedRoute>
        }
      />

      {/* Pagos */}
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
      
  
  );
}

export default App;
