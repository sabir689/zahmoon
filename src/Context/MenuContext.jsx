import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import initialMenuData from "../data/menuData";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  // --- STATES ---
  const [menu, setMenu] = useState(initialMenuData.menu);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. SYNC MENU FROM FIREBASE ---
  useEffect(() => {
    // Reference to the single document where our menu is stored
    const menuDocRef = doc(db, "config", "menu");
    
    const unsubscribe = onSnapshot(menuDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setMenu(docSnap.data());
      } else {
        // If the database is empty (first time setup), 
        // upload the local menuData.js to Firebase
        setDoc(menuDocRef, initialMenuData.menu);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. SYNC ORDERS FROM FIREBASE ---
  useEffect(() => {
    // Reference to the 'orders' collection, sorted by newest first
    const ordersQuery = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      const ordersArray = [];
      querySnapshot.forEach((doc) => {
        ordersArray.push({ ...doc.data(), id: doc.id });
      });
      setOrders(ordersArray);
    });

    return () => unsubscribe();
  }, []);

  // --- MENU ACTIONS ---
  const addItem = async (category, newItem) => {
    const updatedMenu = {
      ...menu,
      [category]: [...(menu[category] || []), { ...newItem, id: Date.now() }]
    };
    
    try {
      // Overwrite the menu document in Firebase with the new list
      await setDoc(doc(db, "config", "menu"), updatedMenu);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteItem = async (category, itemName) => {
    const updatedMenu = {
      ...menu,
      [category]: menu[category].filter(item => item.name !== itemName)
    };
    
    try {
      await setDoc(doc(db, "config", "menu"), updatedMenu);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // --- ORDER ACTIONS ---
  const placeOrder = async (orderData) => {
    try {
      // Create a new document in the 'orders' collection
      await addDoc(collection(db, "orders"), {
        ...orderData,
        timestamp: Date.now(), // Uses numeric timestamp for sorting
        status: "pending"
      });
    } catch (error) {
      console.error("Error placing order:", error);
      throw error; // Pass error back to CartPage
    }
  };

  const completeOrder = async (orderId) => {
    try {
      // Delete the specific order document from Firebase
      await deleteDoc(doc(db, "orders", orderId));
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const clearAllOrders = async () => {
    if (window.confirm("This will permanently delete ALL orders. Proceed?")) {
      // To keep it simple, we loop and delete or suggest deleting one by one
      alert("Please delete orders individually for safety in this version.");
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
        clearAllOrders,
        loading 
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);