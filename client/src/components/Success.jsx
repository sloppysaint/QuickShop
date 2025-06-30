import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="container">
      <div className="success-page">
        <h2>Payment Successful!</h2>
        <p>Thank you for your purchase. You should receive a confirmation email shortly.</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Success;