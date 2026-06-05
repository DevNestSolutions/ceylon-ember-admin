import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Reservations } from "./pages/Reservations";
import { Menu } from "./pages/Menu";
import { Toaster } from "sonner";

// Internal app wrapper to access useAuth hook
const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070708]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <span className="text-xs uppercase tracking-widest text-gold/60 font-medium">
            Loading System...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === "dashboard" && <Dashboard setCurrentPage={setCurrentPage} />}
      {currentPage === "reservations" && <Reservations />}
      {currentPage === "menu" && <Menu />}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="bottom-right" theme="dark" />
    </AuthProvider>
  );
}

export default App;
