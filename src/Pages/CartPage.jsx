import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/MenuContext"; // Import MenuContext
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaShoppingBag, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { placeOrder } = useMenu(); // Get placeOrder function
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 60; 
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    // 1. Prepare the order data
    const orderData = {
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: total,
    };

    // 2. Send to Admin via Context
    placeOrder(orderData);

    // 3. UI Feedback
    setIsOrdered(true);
    
    // 4. Cleanup
    setTimeout(() => {
      clearCart();
      navigate("/"); // Redirect to home after 3 seconds
    }, 3000);
  };

  // SUCCESS STATE VIEW
  if (isOrdered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
            <FaCheckCircle />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2 italic">Order Sent!</h2>
          <p className="text-gray-500 font-medium mb-8">Your food is being prepared in the kitchen. Redirecting you home...</p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
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
          <h2 className="text-3xl font-black text-gray-800 italic">Cart is Empty</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Add some deliciousness to start</p>
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
        <Link to="/" className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-orange-500 transition-colors">
            <FaArrowLeft />
        </Link>
        <h1 className="text-4xl font-black text-gray-900 italic">Your <span className="text-orange-500">Order</span></h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: Item List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div 
                layout
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-4 md:gap-6 bg-white p-4 pr-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-md transition-shadow"
              >
                <img src={item.image} className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-[1.5rem]" alt={item.name} />
                
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg md:text-xl">{item.name}</h3>
                  <p className="text-orange-500 font-black text-sm">৳{item.price}</p>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  <button 
                    onClick={() => removeFromCart(item.name)} 
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <FaMinus size={12}/>
                  </button>
                  <span className="font-black text-gray-700 w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)} 
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-green-500 shadow-sm transition-colors"
                  >
                    <FaPlus size={12}/>
                  </button>
                </div>

                <div className="hidden md:block text-right min-w-[100px]">
                  <p className="font-black text-gray-900 text-lg">৳{item.price * item.quantity}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* RIGHT: Bill Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] sticky top-32 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Bill Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Subtotal</span>
                <span className="text-gray-900">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Delivery Fee</span>
                <span className="text-gray-900">৳{deliveryFee}</span>
              </div>
              
              <div className="border-t-2 border-dashed border-gray-100 my-6 pt-6 flex justify-between items-center">
                <span className="font-black text-gray-400 uppercase text-xs">Total Amount</span>
                <span className="text-3xl font-black text-orange-600">৳{total}</span>
              </div>
            </div>

            <button 
              onClick={handleConfirmOrder}
              className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black mt-4 hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-gray-200 uppercase tracking-widest text-sm"
            >
              Place Order
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-black uppercase tracking-widest">
                Cash on Delivery Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;