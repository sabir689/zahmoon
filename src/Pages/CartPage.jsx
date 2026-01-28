import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useMenu } from "../context/MenuContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaShoppingBag, FaCheckCircle, FaArrowLeft, FaUtensils, FaPhoneAlt, FaClock, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { placeOrder } = useMenu();
  const navigate = useNavigate();
  
  const [isOrdered, setIsOrdered] = useState(false);
  const [location, setLocation] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New Payment States
  const [paymentMethod, setPaymentMethod] = useState("cash"); // 'cash' or 'bkash'
  const [trxID, setTrxID] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 60; 
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = async () => {
    // Validation
    if (!location || !phone) {
      alert("Please enter both your Location and Phone Number!");
      return;
    }

    if (phone.length < 11) {
      alert("Please enter a valid phone number (at least 11 digits).");
      return;
    }

    if (paymentMethod === "bkash" && !trxID) {
      alert("Please enter the bKash Transaction ID!");
      return;
    }

    setIsProcessing(true);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const orderData = {
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: total,
      table: location, 
      phone: phone,    
      paymentMethod: paymentMethod,
      trxID: paymentMethod === "bkash" ? trxID : "N/A",
      status: "pending",
      placedAt: formattedTime,
      timestamp: Date.now()
    };

    try {
      await placeOrder(orderData);
      setIsOrdered(true);
      
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FB] px-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl shadow-orange-100 max-w-lg border border-orange-50"
        >
          <div className="w-28 h-28 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-inner">
            <FaCheckCircle />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 italic tracking-tighter text-wrap">Order Sent!</h2>
          
          <div className="space-y-2 mb-10">
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
              Placing via <span className={paymentMethod === 'bkash' ? 'text-pink-600' : 'text-green-600'}>{paymentMethod.toUpperCase()}</span>
            </p>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed px-4">
              We'll call <span className="text-gray-900 font-black">{phone}</span> once we arrive at <span className="text-gray-900 font-black">{location}</span>.
            </p>
          </div>

          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="bg-green-500 h-full"
            />
          </div>
          <p className="mt-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">Redirecting to menu...</p>
        </motion.div>
      </div>
    );
  }

  // EMPTY STATE VIEW
  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 px-6">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-6xl text-gray-200">
          <FaShoppingBag />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter">Empty Plate</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Your cart is feeling a bit lonely.</p>
        </div>
        <Link to="/" className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 uppercase text-xs tracking-widest">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 font-sans">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/" className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-orange-500 transition-colors border border-gray-100">
            <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter">Review <span className="text-orange-500">Order</span></h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Ready for checkout</p>
        </div>
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
                exit={{ opacity: 0, x: -50 }}
                className="flex items-center gap-4 md:gap-6 bg-white p-4 pr-6 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-md transition-all"
              >
                <img src={item.image} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-[1.8rem] shadow-sm" alt={item.name} />
                
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg md:text-xl leading-tight tracking-tight">{item.name}</h3>
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

                <div className="hidden md:block text-right min-w-[80px]">
                  <p className="font-black text-gray-900 text-lg">৳{item.price * item.quantity}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* RIGHT: Delivery & Payment Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-6 sticky top-32">
            
            {/* Contact Details Inputs */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3 text-orange-600">
                  <FaUtensils size={12}/>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Delivery Address</h3>
                </div>
                <input 
                  type="text"
                  placeholder="e.g. Table 05 or Jaleshwaritola"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none rounded-2xl px-6 py-4 font-bold text-gray-800 transition-all placeholder:text-gray-300 text-sm shadow-inner"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3 text-orange-600">
                  <FaPhoneAlt size={12}/>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Phone Number</h3>
                </div>
                <input 
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none rounded-2xl px-6 py-4 font-bold text-gray-800 transition-all placeholder:text-gray-300 text-sm shadow-inner"
                />
              </div>

              {/* PAYMENT SELECTOR */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border flex flex-col items-center gap-2 ${paymentMethod === 'cash' ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100' : 'bg-white text-gray-400 border-gray-100'}`}
                  >
                    <FaMoneyBillWave size={16}/> Cash
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("bkash")}
                    className={`py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border flex flex-col items-center gap-2 ${paymentMethod === 'bkash' ? 'bg-[#E2136E] text-white border-[#E2136E] shadow-lg shadow-pink-100' : 'bg-white text-gray-400 border-gray-100'}`}
                  >
                    <FaMobileAlt size={16}/> bKash
                  </button>
                </div>
              </div>

              {/* bKASH DETAILS PANEL */}
              {paymentMethod === "bkash" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-pink-50 rounded-[2rem] p-5 border border-pink-100"
                >
                  <p className="text-[9px] font-black text-pink-600 uppercase tracking-widest mb-1 text-center">Send Money To (Personal)</p>
                  <p className="text-xl font-black text-gray-900 text-center mb-4 tabular-nums">017XXXXXXXX</p>
                  <input 
                    type="text"
                    placeholder="Enter Transaction ID"
                    value={trxID}
                    onChange={(e) => setTrxID(e.target.value)}
                    className="w-full bg-white border border-pink-200 focus:border-[#E2136E] outline-none rounded-xl px-4 py-3 font-bold text-gray-800 text-xs placeholder:text-gray-300"
                  />
                </motion.div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Total Bill</h3>
                <FaClock className="text-gray-600" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-400 font-bold text-sm">
                  <span>Subtotal</span>
                  <span className="text-white">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold text-sm">
                  <span>Delivery Fee</span>
                  <span className="text-white">৳{deliveryFee}</span>
                </div>
                
                <div className="border-t border-gray-800 my-6 pt-6 flex justify-between items-center">
                  <span className="font-black text-gray-500 uppercase text-[10px] tracking-[0.2em]">Payable</span>
                  <span className="text-4xl font-black text-orange-500 italic">৳{total}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className={`w-full py-5 rounded-2xl font-black mt-4 transition-all shadow-xl shadow-orange-900/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3 
                  ${isProcessing ? 'bg-gray-700 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white'}`}
              >
                {isProcessing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    Processing...
                  </>
                ) : "Place Order"}
              </button>
              
              <p className="text-[9px] text-center text-gray-500 mt-6 font-black uppercase tracking-[0.3em]">
                {paymentMethod === 'bkash' ? "Secure Mobile Payment" : "Verified Cash Transaction"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;