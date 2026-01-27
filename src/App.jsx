import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 
import Home from "./Pages/Home";
import MenuTabs from "./components/MenuTabs";
import Navbar from "./components/Navbar";
import CartPage from "./Pages/CartPage";
import ContactPage from "./Pages/ContactPage";
import AdminPage from "./Pages/AdminPage";
import LoginPage from "./Pages/LoginPage";
import { MenuProvider } from "./Context/MenuContext";

/**
 * A simple wrapper to protect the Admin route.
 * It checks localStorage for the 'isAdmin' flag.
 */
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <MenuProvider>
      <CartProvider> 
      <Router>
        <Navbar /> 
        <div className="pt-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuTabs />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Route */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all: Redirect unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
    </MenuProvider>
  );
}

export default App;