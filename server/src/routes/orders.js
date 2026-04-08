const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, requireRole } = require('../middleware/auth');

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order by ID
router.get('/order/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order to paid
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (for seller/admin)
router.put('/:id/status', protect, requireRole('admin', 'seller', 'farmer'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Check if user is the admin or the seller of at least one item
      // Allow if admin or if user is seller of first item
      const isSeller = order.orderItems.some((item) => item.seller.toString() === req.user._id.toString());
      if (!isSeller && req.user.role !== 'admin') {
         return res.status(401).json({ message: 'Not authorized' });
      }

      order.status = req.body.status;
      if (req.body.status === 'Delivered') {
         order.isDelivered = true;
         order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders for a seller
router.get('/sellerorders', protect, requireRole('admin', 'seller', 'farmer'), async (req, res) => {
  try {
    // Find orders where at least one orderItem has the seller's id
    const orders = await Order.find({ 'orderItems.seller': req.user._id }).populate('user', 'id name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PDFDocument = require('pdfkit');

// Generate Invoice
router.get('/:id/invoice', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check auth
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      const isSeller = order.orderItems.some(i => i.seller.toString() === req.user._id.toString());
      if (!isSeller) return res.status(401).json({ message: 'Not authorized' });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('TrackaFarm Marketplace', { align: 'center' }).moveDown();
    doc.fontSize(14).text(`Invoice for Order #${order._id}`).moveDown();
    
    doc.fontSize(12).text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${order.user.name}`);
    doc.text(`Email: ${order.user.email}`);
    doc.moveDown();

    doc.text('Shipping Address:');
    doc.text(`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`);
    doc.moveDown();

    doc.text('Order Items:', { underline: true }).moveDown();
    order.orderItems.forEach(item => {
       doc.text(`${item.name} - ${item.qty} x $${item.price} = $${(item.qty * item.price).toFixed(2)}`);
    });
    doc.moveDown();

    doc.text('-----------------------------------');
    const itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    doc.text(`Subtotal: $${itemsPrice.toFixed(2)}`);
    doc.text(`Shipping: $${order.shippingPrice.toFixed(2)}`);
    doc.text(`Tax (GST): $${order.taxPrice.toFixed(2)}`);
    doc.text(`Total: $${order.totalPrice.toFixed(2)}`, { bold: true });
    doc.moveDown();

    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Payment Status: ${order.isPaid ? 'Paid' : 'Pending'}`);
    if (order.isPaid) doc.text(`Paid At: ${new Date(order.paidAt).toLocaleDateString()}`);

    doc.end();

  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: err.message });
  }
});

module.exports = router;
