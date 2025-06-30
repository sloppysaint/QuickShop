import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="container">
      <h2>Our Products</h2>
      <div className="product-grid">
        {products.map(product => {
          const cartItem = cart.items.find(item => item.id === product.id);

          return (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={cartItem}
              onAddToCart={addToCart}
              onIncrease={() => updateQuantity(product.id, cartItem.quantity + 1)}
              onDecrease={() => {
                if (cartItem.quantity > 1) {
                  updateQuantity(product.id, cartItem.quantity - 1);
                } else {
                  removeFromCart(product.id);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
