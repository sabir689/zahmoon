import React, { createContext, useContext, useState, useEffect } from "react";
import initialMenuData from "../data/menuData";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  // --- MENU STATE ---
  const [menu, setMenu] = useState(() => {
    const savedMenu = localStorage.getItem("zahmon_menu");
    return savedMenu ? JSON.parse(savedMenu) : initialMenuData.menu;
  });

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("zahmon_orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Sync Menu to LocalStorage
  useEffect(() => {
    localStorage.setItem("zahmon_menu", JSON.stringify(menu));
  }, [menu]);

  // Sync Orders to LocalStorage
  useEffect(() => {
    localStorage.setItem("zahmon_orders", JSON.stringify(orders));
  }, [orders]);

  // --- MENU ACTIONS ---
  const addItem = (category, newItem) => {
    setMenu(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), { ...newItem, id: Date.now() }]
    }));
  };

  const deleteItem = (category, itemName) => {
    setMenu(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.name !== itemName)
    }));
  };

  // --- ORDER ACTIONS ---
  const placeOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: "pending"
    };
    setOrders(prev => [newOrder, ...prev]); // New orders appear at the top
  };

  const completeOrder = (orderId) => {
    // Option 1: Delete the order (Mark as Done)
    setOrders(prev => prev.filter(order => order.id !== orderId));
    
    // Option 2 (Advanced): You could update status to 'completed' instead
    // setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: 'completed'} : o));
  };

  const clearAllOrders = () => {
    if(window.confirm("Clear all order history?")) {
      setOrders([]);
    }
  };

  return (
    <MenuContext.Provider 
      value={{ 
        menu, 
        addItem, 
        deleteItem, 
        orders, 
        placeOrder, 
        completeOrder,
        clearAllOrders 
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);