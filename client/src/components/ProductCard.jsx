import React from 'react';

const ProductCard = ({
  product,
  cartItem,
  onAddToCart,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="product-card">
      <img
        src={product.imageURL}
        alt={product.title}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          {cartItem ? (
            <div className="product-qty-controls">
              <button
                className="product-qty-btn"
                onClick={onDecrease}
                aria-label="Decrease quantity"
              >
                –
              </button>
              <span className="product-qty">{cartItem.quantity}</span>
              <button
                className="product-qty-btn"
                onClick={onIncrease}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
