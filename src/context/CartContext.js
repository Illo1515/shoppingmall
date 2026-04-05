"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기에 로컬 스토리지에서 장바구니 데이터를 불러옵니다.
  useEffect(() => {
    const savedCart = localStorage.getItem("toss-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart Loading Error:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 장바구니 상태가 변할 때마다 로컬 스토리지에 저장합니다.
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("toss-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // 장바구니에 아이템 추가
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // 이미 있으면 수량만 증가
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // 없으면 새로 추가
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // 장바구니에서 아이템 제거
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 아이템 수량 조절
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // 장바구니 비우기
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
