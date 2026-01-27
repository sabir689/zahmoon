import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaShoppingBag, FaCheckCircle, FaArrowLeft, FaUtensils } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { placeOrder } = useMenu();
  const navigate = useNavigate();
  
  const [isOrdered, setIsOrdered] = useState(false);
  const [tableNumber, setTableNumber] = useState(""); // Track table for the kitchen
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 60; 
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = async () => {
    if (!tableNumber) {
      alert("Please enter your Table Number so we can find you!");
      return;
    }

    setIsProcessing(true);

    // 1. Prepare structured data for Firestore
    const orderData = {
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: total,
      table: tableNumber,
      status: "pending", // Default status for Admin view
      timestamp: Date.now()
    };

    try {
      // 2. Push to Firebase via Context
      await placeOrder(orderData);

      // 3. UI Feedback
      setIsOrdered(true);
      
      // 4. Cleanup after success
      setTimeout(() => {
        clearCart();
        navigate("/"); 
      }, 4000);
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // SUCCESS STATE VIEW
  if (isOrdered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl shadow-orange-100 max-w-lg border border-orange-50"
        >
          <div className="w-28 h-28 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl">
            <FaCheckCircle />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 italic">Order Received!</h2>
          <p className="text-gray-500 font-bold mb-10 leading-relaxed uppercase text-xs tracking-widest">
            We are preparing your feast for <span className="text-orange-600">Table {tableNumber}</span>.<br/> 
            Redirecting you to the menu...
          </p>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="bg-green-500 h-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // EMPTY STATE VIEW
  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 px-6">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-6xl text-gray-300">
          <FaShoppingBag />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-800 italic uppercase">Empty Plate</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Your cart is feeling a bit lonely.</p>
        </div>
        <Link to="/" className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/" className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-orange-500 transition-colors border border-gray-50">
            <FaArrowLeft />
        </Link>
        <h1 className="text-4xl font-black text-gray-900 italic">Review <span className="text-orange-500">Order</span></h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: Item List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div 
                layout
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center gap-4 md:gap-6 bg-white p-4 pr-6 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-md transition-shadow"
              >
                <img src={item.image} className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-[1.8rem] shadow-sm" alt={item.name} />
                
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg md:text-xl leading-tight">{item.name}</h3>
                  <p className="text-orange-500 font-black text-sm mt-1">৳{item.price}</p>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  <button 
                    onClick={() => removeFromCart(item.name)} 
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <FaMinus size={10}/>
                  </button>
                  <span className="font-black text-gray-700 w-6 text-center text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)} 
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-green-500 shadow-sm transition-colors"
                  >
                    <FaPlus size={10}/>
                  </button>
                </div>

                <div className="hidden md:block text-right min-w-[100px]">
                  <p className="font-black text-gray-900 text-lg">৳{item.price * item.quantity}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* RIGHT: Table & Bill Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-6 sticky top-32">
            
            {/* Table Number Input */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4 text-orange-600">
                <FaUtensils size={14}/>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Where are you sitting?</h3>
              </div>
              <input 
                type="text"
                placeholder="Table Number (e.g. 05)"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none rounded-2xl px-6 py-4 font-black text-gray-800 transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Bill Summary */}
            <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200">
              <h3 className="text-xl font-black mb-8 uppercase tracking-tighter italic">Order Total</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-400 font-bold text-sm">
                  <span>Subtotal</span>
                  <span className="text-white">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold text-sm">
                  <span>Service Fee</span>
                  <span className="text-white">৳{deliveryFee}</span>
                </div>
                
                <div className="border-t border-gray-800 my-6 pt-6 flex justify-between items-center">
                  <span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Total to Pay</span>
                  <span className="text-4xl font-black text-orange-500 italic">৳{total}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className={`w-full py-5 rounded-2xl font-black mt-4 transition-all shadow-xl shadow-orange-900/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2 
                  ${isProcessing ? 'bg-gray-700 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white'}`}
              >
                {isProcessing ? "Sending..." : "Place Order"}
              </button>
              
              <p className="text-[9px] text-center text-gray-500 mt-6 font-black uppercase tracking-[0.2em]">
                Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;