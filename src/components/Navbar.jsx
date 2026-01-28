import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag, FaBars, FaTimes, FaInstagram, FaFacebook, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // 1. "Admin" is removed from here to hide it from the UI
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Contact", path: "/contact" },
  ];

  // 2. Long Press Logic
  const handlePressStart = () => {
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      setIsHolding(false);
      navigate("/admin"); // Redirects after 2.5 seconds
    }, 2500);
  };

  const handlePressEnd = () => {
    setIsHolding(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 py-4 sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-orange-600 text-2xl p-2 active:scale-90 transition-transform"
        >
          <FaBars />
        </button>

        {/* Logo with Long Press Trigger */}
        <motion.div
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          animate={isHolding ? { scale: 0.92, filter: "brightness(1.2)" } : { scale: 1, filter: "brightness(1)" }}
          className="cursor-pointer select-none"
        >
          <Link to="/" className="text-2xl font-black text-orange-600 italic tracking-tighter pointer-events-none">
            ZahMon<span className="text-gray-900 not-italic">Cafe</span>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-orange-600 font-bold text-sm transition-all hover:-translate-y-0.5"
              >
                {link.name}
              </Link>
            ))}
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

      {/* Unique Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />

            <motion.div
              initial={{ x: "-100%", borderTopRightRadius: "100px", borderBottomRightRadius: "100px" }}
              animate={{ x: 0, borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-screen w-[65%] md:w-[50%] bg-white z-[70] shadow-xl p-8 md:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-black text-orange-600 italic underline">ZahMon</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-3xl text-orange-600 p-2 active:rotate-90 transition-transform"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex flex-col">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="relative flex items-center justify-between w-full group py-4 px-2 overflow-hidden"
                    >
                      <span className="text-xl font-black text-orange-700 group-hover:text-orange-600 transition-colors z-10">
                        {link.name}
                      </span>
                      <div className="flex items-center z-10">
                        <FaArrowRight className="text-orange-500 text-xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                      <div className="absolute inset-0 bg-orange-50 -z-0 rounded-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <div className="flex space-x-6 mb-8 text-2xl text-orange-600">
                  <FaInstagram className="hover:text-gray-900 cursor-pointer transition-colors" />
                  <FaFacebook className="hover:text-gray-900 cursor-pointer transition-colors" />
                  <FaWhatsapp className="hover:text-gray-900 cursor-pointer transition-colors" />
                </div>

                <div className="p-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl shadow-lg shadow-orange-200">
                  <Link
                    to="/menu"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-white text-orange-600 text-center py-4 rounded-[calc(1rem-1px)] font-black uppercase tracking-tighter active:bg-orange-600 active:text-white transition-all"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;