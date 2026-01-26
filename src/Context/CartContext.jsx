import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. Add item or increase quantity
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.name === item.name);
      if (existingItem) {
        return prevCart.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // 2. Decrease quantity or remove if quantity is 1
  const removeFromCart = (itemName) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.name === itemName);
      if (existingItem?.quantity === 1) {
        return prevCart.filter((i) => i.name !== itemName);
      }
      return prevCart.map((i) =>
        i.name === itemName ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  // 3. Completely remove an item regardless of quantity
  const deleteFromCart = (itemName) => {
    setCart((prevCart) => prevCart.filter((i) => i.name !== itemName));
  };

  // 4. Clear everything (Use this after "Confirm Order")
  const clearCart = () => setCart([]);

  // Total items count for the Navbar badge
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        deleteFromCart, 
        clearCart, 
        cartCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);