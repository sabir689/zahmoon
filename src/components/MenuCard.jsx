import React from "react";
import { motion } from "framer-motion";
import { FaPlus, FaFire, FaShoppingBasket } from "react-icons/fa";
import { useCart } from "../Context/CartContext"; // Import the hook

const MenuCard = ({ item }) => {
  const { name, price, image, items, isSpicy, isPopular } = item;
  const { addToCart } = useCart(); // Use the context

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 cursor-pointer  border border-gray-100"
    >
      {/* 1. BADGES */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isPopular && (
          <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <FaFire className="text-[12px]" /> POPULAR
          </span>
        )}
        {isSpicy && (
          <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
             🌶️ SPICY
          </span>
        )}
      </div>

      {/* 2. IMAGE SECTION */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Dark Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button 
            onClick={(e) => {
                e.stopPropagation(); 
                addToCart(item);
            }}
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="bg-orange-500 text-white p-4 rounded-full shadow-xl z-30"
          >
            <FaPlus />
          </motion.button>
        </div>

        <div className="absolute bottom-4 right-4 backdrop-blur-md bg-white/80 text-gray-900 font-black px-4 py-2 rounded-2xl shadow-lg border border-white/20">
          ৳{price}
        </div>
      </div>

      {/* 3. CONTENT SECTION */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
          <div className="w-8 h-1 bg-orange-500 rounded-full mt-2 transition-all duration-500 group-hover:w-full" />
        </div>

        {items && (
          <div className="mt-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Includes:</p>
            <div className="flex flex-wrap gap-2">
              {items.map((food, index) => (
                <span key={index} className="text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-100 px-3 py-1 rounded-lg">
                  {food}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 4. CART ACTION BUTTON */}
        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Freshly Prepared</span>
            <button 
              onClick={() => addToCart(item)}
              className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-orange-600 hover:text-white transition-all active:scale-95"
            >
              <FaShoppingBasket /> Add to Cart
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;