import React from "react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, addToCart, removeFromCart, cartCount } = useCart(); // Ensure removeFromCart is in your context

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 60; // Standard Bogra delivery fee
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-8xl text-gray-200">
           <FaShoppingBag />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        <Link to="/menu" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-10">Your <span className="text-orange-500">Order</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: Item List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                layout
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
              >
                <img src={item.image} className="w-24 h-24 object-cover rounded-xl" alt={item.name} />
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-orange-600 font-black">৳{item.price}</p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border">
                  <button onClick={() => removeFromCart(item.name)} className="text-gray-500 hover:text-red-500 transition"><FaMinus /></button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="text-gray-500 hover:text-orange-500 transition"><FaPlus /></button>
                </div>

                <div className="text-right min-w-[80px]">
                  <p className="font-black text-gray-800">৳{item.price * item.quantity}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* RIGHT: Bill Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] sticky top-28 shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 italic">Order Summary</h3>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-white">৳{deliveryFee}</span>
              </div>
              <div className="border-t border-gray-800 my-4 pt-4 flex justify-between text-xl">
                <span className="font-bold text-white">Total</span>
                <span className="font-black text-orange-500">৳{total}</span>
              </div>
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black mt-8 transition-all active:scale-95 shadow-lg shadow-orange-500/20">
              Confirm Order
            </button>
            <p className="text-[10px] text-center text-gray-500 mt-4 uppercase tracking-widest">
              Payment method: Cash on Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;