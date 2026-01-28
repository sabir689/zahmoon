import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, FaTrash, FaSignOutAlt, FaClipboardList, FaLink, 
  FaEdit, FaCheckCircle, FaSpinner, FaSearch, FaPhoneAlt, 
  FaClock, FaMapMarkerAlt, FaMobileAlt, FaMoneyBillWave 
} from "react-icons/fa";
import { useMenu } from "../context/MenuContext";
import { db } from "../firebase"; 
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const AdminPage = () => {
  const { menu, addItem, deleteItem, orders, completeOrder } = useMenu();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("menu");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Category State
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [newItem, setNewItem] = useState({ 
    name: "", price: "", category: "", image: "" 
  });

  // Set default category when menu loads
  useEffect(() => {
    const categories = Object.keys(menu);
    if (categories.length > 0 && !filterCategory) {
      setFilterCategory(categories[0]);
      setNewItem(prev => ({ ...prev, category: categories[0] }));
    }
  }, [menu, filterCategory]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this specific order?")) return;
    try {
      await deleteDoc(doc(db, "orders", orderId));
    } catch (error) {
      alert("Failed to delete order.");
    }
  };

  const handleClearAllOrders = async () => {
    if (!window.confirm("ARE YOU SURE? This will delete all live orders permanently.")) return;
    setIsClearing(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const deletePromises = querySnapshot.docs.map((document) => 
        deleteDoc(doc(db, "orders", document.id))
      );
      await Promise.all(deletePromises);
    } catch (error) {
      alert("Failed to clear queue.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const finalCategory = isNewCategory ? customCategory : newItem.category;

    if (!newItem.name || !newItem.price || !newItem.image || !finalCategory) {
      return alert("Fill all fields, including the category name!");
    }

    setIsSaving(true);
    try {
      if (isEditing) await deleteItem(newItem.category, editId);
      
      await addItem(finalCategory, { 
        ...newItem, 
        price: parseFloat(newItem.price), 
        description: "Freshly prepared at ZahMon" 
      });
      
      setFilterCategory(finalCategory); // Switch view to the category just added/edited
      resetForm();
    } catch (error) { 
      alert("Error saving."); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const resetForm = () => {
    setNewItem({ 
        name: "", 
        price: "", 
        category: Object.keys(menu)[0] || "", 
        image: "" 
    });
    setCustomCategory("");
    setIsNewCategory(false);
    setIsEditing(false); 
    setEditId(null);
  };

  const startEdit = (category, item) => {
    setIsEditing(true); 
    setEditId(item.name);
    setIsNewCategory(false);
    setNewItem({ name: item.name, price: item.price, category, image: item.image });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter">
              ZahMon<span className="text-orange-600">Admin</span>
            </h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Kitchen Control Panel</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-200/50 p-1.5 rounded-2xl backdrop-blur-md border border-gray-200">
              <button 
                onClick={() => setActiveTab("menu")} 
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
              >
                Menu
              </button>
              <button 
                onClick={() => setActiveTab("orders")} 
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all relative ${activeTab === 'orders' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
              >
                Orders
                {orders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {orders.length}
                  </span>
                )}
              </button>
            </div>
            <button onClick={handleLogout} className="p-4 bg-white text-gray-400 hover:text-red-500 rounded-2xl shadow-sm transition-all active:scale-90 border border-gray-100">
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {activeTab === "menu" && (
            <>
              {/* --- LEFT: FORM PANEL --- */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3 mb-8">
                    {isEditing ? <FaEdit className="text-blue-500"/> : <FaPlus className="text-orange-600"/>}
                    {isEditing ? "Modify Item" : "Add Item"}
                  </h3>
                  
                  <form onSubmit={handleAddItem} className="space-y-6">
                    <div className="h-44 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden relative">
                      {newItem.image ? (
                        <img src={newItem.image} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                          <FaLink className="text-3xl mb-2 opacity-20" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Image Preview</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <input type="text" value={newItem.image} onChange={(e) => setNewItem({...newItem, image: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all border border-transparent" placeholder="Paste Image URL..." />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</span>
                          <button 
                            type="button" 
                            onClick={() => setIsNewCategory(!isNewCategory)}
                            className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline"
                          >
                            {isNewCategory ? "Use Existing" : "+ Create New"}
                          </button>
                        </div>
                        {isNewCategory ? (
                          <input 
                            type="text" 
                            value={customCategory} 
                            onChange={(e) => setCustomCategory(e.target.value)} 
                            className="w-full bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none placeholder:text-orange-300" 
                            placeholder="e.g. Desserts, Pizza..." 
                          />
                        ) : (
                          <select 
                            value={newItem.category} 
                            onChange={(e) => setNewItem({...newItem, category: e.target.value})} 
                            className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-bold text-sm text-gray-700 outline-none cursor-pointer border border-transparent"
                          >
                            {Object.keys(menu).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <input type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-bold text-sm outline-none border border-transparent" placeholder="Item Name" />
                        <input type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-bold text-sm outline-none border border-transparent" placeholder="Price ৳" />
                      </div>
                    </div>

                    <button disabled={isSaving} className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 ${isEditing ? 'bg-blue-500' : 'bg-orange-600'} text-white active:scale-95`}>
                      {isSaving ? <FaSpinner className="animate-spin" /> : (isEditing ? "Update Item" : "Publish to Menu")}
                    </button>
                    {isEditing && <button type="button" onClick={resetForm} className="w-full text-[10px] font-black uppercase text-gray-400 tracking-widest">Cancel Editing</button>}
                  </form>
                </div>
              </motion.div>

              {/* --- RIGHT: MENU GRID --- */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Sticky Header for Search & Categories */}
                <div className="sticky top-24 z-10 space-y-4 bg-[#F8F9FB]/90 backdrop-blur-md pb-4">
                  <div className="relative">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="text" 
                      placeholder={`Search in ${filterCategory}...`} 
                      className="w-full bg-white rounded-3xl py-5 pl-14 pr-6 shadow-sm border border-gray-100 outline-none font-bold" 
                      onChange={(e) => setSearchQuery(e.target.value.toLowerCase())} 
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
                    {Object.keys(menu).map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => {
                          setFilterCategory(cat);
                          setSearchQuery("");
                        }}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                          filterCategory === cat 
                          ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100" 
                          : "bg-white text-black border-gray-100 hover:border-orange-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-h-[400px]">
                  {Object.entries(menu).map(([category, items]) => {
                    if (category !== filterCategory) return null;

                    const filtered = items.filter(i => i.name.toLowerCase().includes(searchQuery));

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        key={category} 
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-black text-gray-900 italic tracking-tighter uppercase">{category}</h2>
                            <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">{filtered.length} Items</span>
                        </div>

                        {filtered.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filtered.map((item, idx) => (
                              <div key={idx} className="bg-white p-3 rounded-[2rem] border border-gray-50 shadow-sm flex items-center gap-4 group hover:border-orange-100 transition-all">
                                <img src={item.image} className="w-20 h-20 rounded-2xl object-cover bg-gray-50" alt="" />
                                <div className="flex-1">
                                  <h4 className="font-black text-gray-800 text-sm">{item.name}</h4>
                                  <p className="text-orange-600 font-black text-xs">৳{item.price}</p>
                                </div>
                                <div className="flex flex-col gap-1 pr-2">
                                  <button onClick={() => startEdit(category, item)} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><FaEdit size={14}/></button>
                                  <button onClick={() => deleteItem(category, item.name)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"><FaTrash size={14}/></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-100">
                             <p className="text-gray-400 font-bold text-sm italic">No items found in this category.</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* --- TAB 2: LIVE ORDERS --- */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-12 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 gap-4">
                <div className="flex items-center gap-5">
                  <div className="bg-gray-900 p-4 rounded-2xl text-white shadow-lg"><FaClipboardList size={24} /></div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter italic">Live Kitchen Queue</h2>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{orders.length} Pending Orders</p>
                  </div>
                </div>
                {orders.length > 0 && (
                  <button disabled={isClearing} onClick={handleClearAllOrders} className="text-gray-400 text-[9px] font-black uppercase bg-gray-50 px-8 py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-gray-100">
                    {isClearing ? "Purge..." : "Clear All Orders"}
                  </button>
                )}
              </div>

              {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.map((order) => (
                    <motion.div layout key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative group overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <span className="text-[9px] font-black bg-orange-600 text-white px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                <FaMapMarkerAlt size={8}/> {order.table}
                              </span>
                              <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                <FaClock size={8}/> {order.placedAt || "Just now"}
                              </span>
                            </div>
                            <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-gray-900 font-black text-xs hover:text-orange-600 transition-colors">
                              <FaPhoneAlt size={10} className="text-orange-500"/>
                              {order.phone || "No Phone"}
                            </a>
                          </div>
                          
                          <div className="flex gap-2">
                            <button onClick={() => handleDeleteOrder(order.id)} className="bg-red-50 text-red-400 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90" title="Delete Order"><FaTrash size={16} /></button>
                            <button onClick={() => completeOrder(order.id)} className="bg-green-500 text-white p-4 rounded-2xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-90" title="Complete Order"><FaCheckCircle size={18} /></button>
                          </div>
                        </div>

                        <div className="space-y-3 mb-8 min-h-[80px]">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-orange-600 font-black text-xs">{item.quantity}x</span>
                                <span className="font-bold text-gray-700">{item.name}</span>
                              </div>
                              <span className="text-gray-300 font-bold text-xs">৳{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-dashed border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-3xl font-black text-gray-900 italic">৳{order.total}</span>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.paymentMethod === 'bkash' ? 'bg-pink-50 text-pink-600' : 'bg-green-50 text-green-600'}`}>
                            {order.paymentMethod === 'bkash' ? <><FaMobileAlt size={10}/> bKash</> : <><FaMoneyBillWave size={10}/> Cash</>}
                          </div>
                        </div>

                        {order.paymentMethod === 'bkash' && (
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 group/trx">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Transaction ID</p>
                            <p className="text-xs font-mono font-bold text-pink-600 break-all select-all">
                              {order.trxID || "No TrxID Provided"}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center justify-center opacity-50">
                  <FaClipboardList className="text-gray-200 mb-6" size={60} />
                  <p className="text-gray-400 font-black uppercase text-xs tracking-[0.3em]">Kitchen Is Clear</p>
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