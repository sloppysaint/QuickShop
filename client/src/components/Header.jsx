import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { getTotalItems } = useCart();

  return (
    <header className="header ">
      <div className="container">
        <Link to="/" className="logo">
          <h1>QuickShop</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-link cart-link">
            Cart ({getTotalItems()})
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;