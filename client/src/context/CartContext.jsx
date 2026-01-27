import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('rbt_cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('rbt_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const qtyToAdd = product.quantity || 1;

    setCartItems((prevItems) => {
      const variantSignature = product.rawVariantId 
        ? `var-${product.rawVariantId}` 
        : JSON.stringify(product.selectedVariants || {});
      
      const existingItemIndex = prevItems.findIndex((item) => {
        const itemSignature = item.rawVariantId 
          ? `var-${item.rawVariantId}` 
          : JSON.stringify(item.selectedVariants || {});
        return item.id === product.id && itemSignature === variantSignature;
      });

      if (existingItemIndex > -1) {
        // --- PERBAIKAN BUG DOUBLE INPUT DISINI ---
        // JANGAN lakukan: newItems[existingItemIndex].quantity += qtyToAdd; (Ini Mutasi!)
        
        // LAKUKAN INI: Copy array, lalu GANTI item dengan object baru
        const newItems = [...prevItems];
        const itemToUpdate = newItems[existingItemIndex];
        
        const currentQty = itemToUpdate.quantity;
        const maxStock = itemToUpdate.stock || 999;
        
        let finalQty = currentQty + qtyToAdd;
        if (finalQty > maxStock) finalQty = maxStock;

        // Replace dengan object baru agar state lama aman
        newItems[existingItemIndex] = {
          ...itemToUpdate,
          quantity: finalQty
        };
        
        return newItems;
      }
      
      return [...prevItems, { 
        ...product, 
        quantity: qtyToAdd,
        cartId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` 
      }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cartId === cartId) {
          let newQty = item.quantity;
          const maxStock = item.stock || 999;

          if (type === 'plus') {
            if (newQty < maxStock) newQty += 1;
          } else if (type === 'minus') {
            if (newQty > 1) newQty -= 1;
          }
          
          // Return object baru, bukan mutasi item lama
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);