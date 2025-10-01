import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/pages/LoginPage";
import Dashboard from "./dashboard/Dashboard";
import ClientsPage from "./clients/pages/ClientsPage";
import Payments from "./payments/pages/Payments";
import AddClientPage from "./clients/pages/AddClientsPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} toastOptions={{duration: 3000}} />
    <Routes>
      {/* Login público */}
      <Route path="/login" element={<Login />} />

      {/* Grupo protegido */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/add" element={<AddClientPage />} />
        <Route path="/payments" element={<Payments />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
      
    </Routes>
    </>
  );
}

export default App;
