import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 
import Home from "./Pages/Home";
import MenuTabs from "./components/MenuTabs";
import Navbar from "./components/Navbar";
import CartPage from "./Pages/CartPage";


function App() {
  return (
    
      <CartProvider> 
      <Router>
        <Navbar /> 
        <div className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuTabs />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
    
  );
}

export default App;