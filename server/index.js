const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickshop');

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  paymentIntentId: String,
  amount: Number,
  currency: String,
  status: String,
  customerEmail: String,
  items: [
    {
      id: String,
      title: String,
      price: Number,
      quantity: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Mock Products Data
const products = [
  {
    id: '1',
    title: 'Wireless Headphones',
    price: 99.99,
    imageURL: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: '2',
    title: 'Smart Watch',
    price: 199.99,
    imageURL: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Feature-rich smartwatch with health monitoring'
  },
  {
    id: '3',
    title: 'Laptop Stand',
    price: 49.99,
    imageURL: 'https://i.etsystatic.com/36084915/r/il/b8ddf5/6793182154/il_570xN.6793182154_7olh.jpg',
    description: 'Ergonomic aluminum laptop stand for better posture'
  },
  {
    id: '4',
    title: 'Bluetooth Speaker',
    price: 79.99,
    imageURL: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    description: 'Portable Bluetooth speaker with excellent sound quality'
  },
  {
    id: '5',
    title: 'Smartphone Case',
    price: 24.99,
    imageURL: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop',
    description: 'Durable protective case for your smartphone'
  },
  {
    id: '6',
    title: 'USB-C Cable',
    price: 14.99,
    imageURL: 'https://mm.digikey.com/Volume0/opasdata/d220001/medias/images/841/MFG_USBC-USB-XXF.jpg',
    description: 'Fast charging USB-C cable, 6ft length, portable to many mobile devices'
  }
];

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', items, customerEmail } = req.body;

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerEmail,
        items: JSON.stringify(items)
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, customerEmail, items } = req.body;

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Log transaction
      const transaction = new Transaction({
        paymentIntentId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        customerEmail,
        items
      });

      await transaction.save();

      // Send confirmation email
      const itemsList = items.map(item => 
        `${item.title} - Quantity: ${item.quantity} - $${item.price}`
      ).join('\n');

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: 'Order Confirmation - QuickShop',
        text: `
Thank you for your purchase!

Order Details:
${itemsList}

Total: $${(paymentIntent.amount / 100).toFixed(2)}

Your order has been confirmed and will be processed shortly.

Thank you for shopping with QuickShop!
        `
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: 'Payment confirmed and email sent!' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});