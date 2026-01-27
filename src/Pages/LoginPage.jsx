import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // For now, we'll use a hardcoded password. 
    // In a real app, you'd check this against a database.
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      alert("Wrong password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 italic">
            ZahMon<span className="text-orange-600">Staff</span>
          </h2>
          <p className="text-gray-500 font-medium">Authorized personnel only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="password" 
            placeholder="Enter Admin Password"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all">
            Unlock Dashboard
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;