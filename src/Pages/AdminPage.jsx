import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaSignOutAlt, FaClipboardList, FaCamera, FaEdit, FaTimes, FaCheckCircle, FaCalendarAlt, FaTable, FaSpinner } from "react-icons/fa";
import { useMenu } from "../context/MenuContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Ensure this is exported from your firebase.js

const AdminPage = () => {
  const { menu, addItem, deleteItem, orders, completeOrder, clearAllOrders } = useMenu();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState("menu");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [newItem, setNewItem] = useState({ 
    name: "", 
    price: "", 
    category: Object.keys(menu)[0] || "Beverages",
    image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=500"
  });

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewItem({ ...newItem, image: imageUrl });
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return alert("Fill all fields");
    
    setIsUploading(true);
    try {
      let finalImageUrl = newItem.image;

      // 1. Cloud Upload Logic
      const file = fileInputRef.current.files[0];
      if (file) {
        const storageRef = ref(storage, `menu/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Logic: If editing, delete the old document reference first
      if (isEditing) {
        await deleteItem(newItem.category, editId);
      }

      const itemData = {
        name: newItem.name,
        price: parseFloat(newItem.price),
        image: finalImageUrl,
        description: "Freshly prepared at ZahMon"
      };

      await addItem(newItem.category, itemData);
      resetForm();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item to cloud.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setNewItem({ 
        name: "", 
        price: "", 
        category: Object.keys(menu)[0] || "Beverages", 
        image: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=500" 
    });
    setIsEditing(false);
    setEditId(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (category, item) => {
    setIsEditing(true);
    setEditId(item.name);
    setNewItem({
      name: item.name,
      price: item.price,
      category: category,
      image: item.image
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 italic">
              ZahMon<span className="text-orange-600">Admin</span>
            </h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Cloud Management</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-200 p-1 rounded-2xl shadow-inner">
              <button 
                onClick={() => setActiveTab("menu")} 
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'menu' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
              >
                Menu
              </button>
              <button 
                onClick={() => setActiveTab("orders")} 
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all relative ${activeTab === 'orders' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
              >
                Orders
                {orders.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse font-black">
                        {orders.length}
                    </span>
                )}
              </button>
            </div>
            <button onClick={handleLogout} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-2xl border border-gray-100 shadow-sm transition-colors">
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          
          {/* --- TAB 1: MENU MANAGEMENT --- */}
          {activeTab === "menu" && (
            <>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                      {isEditing ? <><FaEdit className="text-blue-500"/> Edit Item</> : <><FaPlus className="text-orange-600"/> New Item</>}
                    </h3>
                    {isEditing && (
                      <button onClick={resetForm} className="text-gray-400 hover:text-red-500 text-sm font-bold flex items-center gap-1">
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={handleAddItem} className="space-y-5">
                    <div onClick={() => fileInputRef.current.click()} className="relative h-40 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer group">
                      <img src={newItem.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="preview" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-orange-600">
                        <FaCamera className="text-2xl mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Change Photo</span>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Category</label>
                        <select value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-gray-700 focus:ring-2 focus:ring-orange-100">
                          {Object.keys(menu).map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Dish Name</label>
                        <input type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-gray-900 placeholder-gray-300" placeholder="e.g. Garlic Ramen" />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Price (৳)</label>
                        <input type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 font-bold text-gray-900" />
                      </div>
                    </div>

                    <button 
                      disabled={isUploading}
                      className={`w-full py-5 rounded-2xl font-black uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${isEditing ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'} ${isUploading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                      {isUploading ? <><FaSpinner className="animate-spin" /> Uploading...</> : (isEditing ? "Save Changes" : "Confirm & Add")}
                    </button>
                  </form>
                </div>
              </motion.div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase text-[10px] font-black">
                      <tr>
                        <th className="px-8 py-5">Preview</th>
                        <th className="px-8 py-5">Product</th>
                        <th className="px-8 py-5">Price</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(menu).map(([category, items]) => (
                        items.map((item, idx) => (
                          <tr key={`${category}-${idx}`} className="border-b border-gray-50 hover:bg-orange-50/20 transition-colors">
                            <td className="px-8 py-4"><img src={item.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" /></td>
                            <td className="px-8 py-4">
                              <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                              <span className="text-[9px] font-black uppercase text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md mt-1 inline-block">{category}</span>
                            </td>
                            <td className="px-8 py-4 font-black text-gray-700">৳{item.price}</td>
                            <td className="px-8 py-4 text-right space-x-1">
                              <button onClick={() => startEdit(category, item)} className="p-3 text-blue-400 hover:bg-blue-50 rounded-xl transition-all"><FaEdit /></button>
                              <button onClick={() => deleteItem(category, item.name)} className="p-3 text-red-300 hover:bg-red-50 rounded-xl transition-all"><FaTrash /></button>
                            </td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* --- TAB 2: LIVE ORDERS --- */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-4 rounded-2xl text-orange-600 shadow-inner"><FaClipboardList size={20} /></div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Kitchen Queue</h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{orders.length} Active Orders</p>
                    </div>
                </div>
                {orders.length > 0 && (
                    <button onClick={clearAllOrders} className="text-red-500 text-xs font-black uppercase hover:bg-red-50 px-4 py-2 rounded-xl transition-all">Clear All History</button>
                )}
              </div>

              {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {orders.map((order) => (
                    <motion.div layout key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                      <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-all group-hover:rotate-12">
                        <FaTable size={100} />
                      </div>
                      
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase">Order #{order.id.toString().slice(-4)}</span>
                            {/* TABLE NUMBER BADGE */}
                            <span className="text-[10px] font-black bg-gray-900 text-white px-3 py-1 rounded-full uppercase flex items-center gap-1">
                                <FaTable size={8}/> Table {order.table || 'N/A'}
                            </span>
                          </div>
                          <p className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">{new Date(order.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <button 
                          onClick={() => completeOrder(order.id)} 
                          className="bg-green-500 text-white p-4 rounded-2xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-90"
                          title="Complete Order"
                        >
                          <FaCheckCircle size={20} />
                        </button>
                      </div>

                      <div className="space-y-3 mb-6">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-800 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                                <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                            </div>
                            <span className="text-gray-400 text-xs font-bold">৳{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                        <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Total Bill</span>
                        <span className="text-2xl font-black text-orange-600 italic">৳{order.total}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                    <FaClipboardList size={60} className="text-gray-100 mb-4" />
                  </motion.div>
                  <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No orders in the kitchen</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;