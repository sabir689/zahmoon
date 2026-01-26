import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";


const Navbar = () => {
  const { cartCount } = useCart();
  

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-orange-600 italic">
          ZahMon<span className="text-gray-900 not-italic">Cafe</span>
        </Link>

        {/* Links & Cart */}
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-orange-600 font-bold text-sm transition-colors">Home</Link>
            <Link to="/menu" className="text-gray-600 hover:text-orange-600 font-bold text-sm transition-colors">Menu</Link>
            <Link to="/contact" className="text-gray-600 hover:text-orange-600 font-bold text-sm transition-colors">Contact</Link>
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative group p-2">
            <FaShoppingBag className="text-2xl text-gray-800 group-hover:text-orange-600 transition-colors" />
            
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>
     
    </nav>
  );
};

export default Navbar;