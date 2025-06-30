import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError('');

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent
      const { data } = await axios.post('http://localhost:5000/api/create-payment-intent', {
        amount: getTotalPrice(),
        items: cart.items,
        customerEmail: email
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: email
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Payment successful
        await axios.post('http://localhost:5000/api/confirm-payment', {
          paymentIntentId: result.paymentIntent.id,
          customerEmail: email,
          items: cart.items
        });

        clearCart();
        navigate('/success');
      }
    } catch (error) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.items.map(item => (
            <div key={item.id} className="order-item">
              <span>{item.title} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Card Details</label>
            <div className="card-element">
              <CardElement />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={!stripe || processing}
            className="btn btn-primary payment-btn"
          >
            {processing ? 'Processing...' : `Pay $${getTotalPrice().toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;