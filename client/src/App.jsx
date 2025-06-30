import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Success from './components/Success';
import Header from './components/Header';
import { CartProvider } from './context/CartContext';
import axios from 'axios';
import './App.css';

const App = () => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/config');
        setStripePromise(loadStripe(response.data.publishableKey));
      } catch (error) {
        console.error('Error loading Stripe config:', error);
      }
    };

    fetchStripeConfig();
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route 
                path="/checkout" 
                element={
                  stripePromise ? (
                    <Elements stripe={stripePromise}>
                      <Checkout />
                    </Elements>
                  ) : (
                    <div>Loading...</div>
                  )
                } 
              />
              <Route path="/success" element={<Success />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;