import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import instance from '../api/axios'; // Pastikan menggunakan instance axios yang benar
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const navigate = useNavigate();

  // 1. FETCH CART (Hanya jika Login & Role = Customer)
  useEffect(() => {
    if (user && user.role === 'CUSTOMER') {
      fetchCart();
    } else {
      setCartItems([]); // Kosongkan jika logout atau Admin
    }
  }, [user]);

  const fetchCart = async () => {
    setLoadingCart(true);
    try {
      const token = localStorage.getItem("access_token");
      const { data } = await instance.get('/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sesuaikan jika data backend berbentuk { items: [] } atau langsung array []
      setCartItems(data.items || data); 
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoadingCart(false);
    }
  };

  // --- ACTIONS ---

  const addToCart = async (product) => {
    // Validasi dasar (untuk keamanan tambahan di luar UI logic)
    if (!user || user.role !== 'CUSTOMER') return { success: false, reason: "RESTRICTED" };

    const qtyToAdd = product.quantity || 1;
    const prevCart = [...cartItems];

    // Logic Hitung Quantity Baru
    const variantSignature = product.rawVariantId 
      ? `var-${product.rawVariantId}` 
      : JSON.stringify(product.selectedVariants || {});

    const existingItem = prevCart.find((item) => {
      const itemSig = item.rawVariantId 
        ? `var-${item.rawVariantId}` 
        : JSON.stringify(item.selectedVariants || {});
      return item.id === product.id && itemSig === variantSignature;
    });

    const currentQty = existingItem ? existingItem.quantity : 0;
    const maxStock = existingItem ? (existingItem.stock || 999) : (product.stock || 999);
    const finalQty = Math.min(currentQty + qtyToAdd, maxStock);

    // Optimistic Update
    setCartItems((prevItems) => {
      if (existingItem) {
        return prevItems.map(item => 
          (item.id === product.id && (item.rawVariantId === product.rawVariantId))
          ? { ...item, quantity: finalQty }
          : item
        );
      } else {
        return [...prevItems, { 
           ...product, 
           quantity: finalQty,
           cartId: `temp-${Date.now()}` 
        }];
      }
    });

    try {
      const token = localStorage.getItem("access_token");
      await instance.post('/cart/item', {
        id: product.id,
        quantity: finalQty,
        selectedVariants: product.selectedVariants,
        rawVariantId: product.rawVariantId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      setCartItems(prevCart); // Rollback jika error
      return { success: false, message: err.response?.data?.message || "Failed to add to cart" };
    }
  };

  const removeFromCart = async (cartId) => {
    if (!user || user.role !== 'CUSTOMER') return;

    const itemToRemove = cartItems.find(item => item.cartId === cartId);
    if (!itemToRemove) return;

    const prevCart = [...cartItems];
    setCartItems(prev => prev.filter(i => i.cartId !== cartId));

    try {
      const token = localStorage.getItem("access_token");
      await instance.delete('/cart/item', {
        headers: { Authorization: `Bearer ${token}` },
        data: { 
            productId: itemToRemove.id, 
            rawVariantId: itemToRemove.rawVariantId 
        }
      });
    } catch (err) {
      console.error(err);
      setCartItems(prevCart); // Rollback
    }
  };

  const updateQuantity = async (cartId, type) => {
    if (!user || user.role !== 'CUSTOMER') return;
    
    const targetItem = cartItems.find(i => i.cartId === cartId);
    if (!targetItem) return;

    let newQty = targetItem.quantity;
    if (type === 'plus') {
        if (newQty < (targetItem.stock || 999)) newQty++;
    } else {
        if (newQty > 1) newQty--;
    }

    if (newQty === targetItem.quantity) return;

    const prevCart = [...cartItems];
    setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: newQty } : item));

    try {
        const token = localStorage.getItem("access_token");
        await instance.post('/cart/item', {
            id: targetItem.id,
            quantity: newQty,
            selectedVariants: targetItem.selectedVariants,
            rawVariantId: targetItem.rawVariantId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (err) { 
        console.error(err); 
        setCartItems(prevCart);
    }
  };

  const clearCart = async () => {
    const prevCart = [...cartItems];
    setCartItems([]);
    if (user && user.role === 'CUSTOMER') {
        try { 
            const token = localStorage.getItem("access_token");
            await instance.delete('/cart', {
                headers: { Authorization: `Bearer ${token}` }
            }); 
        } catch (e) {
            setCartItems(prevCart);
        }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, loadingCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);