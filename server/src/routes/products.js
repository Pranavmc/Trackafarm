const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, requireRole } = require('../middleware/auth');

// Get all products (with search/filter/pagination)
router.get('/', async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const { keyword, category, minPrice, maxPrice } = req.query;

    const keywordFilter = keyword ? {
      name: { $regex: keyword, $options: 'i' },
    } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = (minPrice || maxPrice) ? {
      price: {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      }
    } : {};

    const count = await Product.countDocuments({ ...keywordFilter, ...categoryFilter, ...priceFilter });
    const products = await Product.find({ ...keywordFilter, ...categoryFilter, ...priceFilter })
      .populate('seller', 'name email farmName')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get seller products
router.get('/seller', protect, requireRole('admin', 'seller', 'farmer'), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email farmName');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product
router.post('/', protect, requireRole('admin', 'seller', 'farmer'), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name || 'Sample name',
      price: req.body.price || 0,
      seller: req.user._id,
      image: req.body.image || 'https://via.placeholder.com/300',
      brand: req.body.brand || 'Sample brand',
      category: req.body.category || 'Agriculture',
      subcategory: req.body.subcategory || 'Seeds',
      countInStock: req.body.countInStock || 0,
      numReviews: 0,
      description: req.body.description || 'Sample description',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/:id', protect, requireRole('admin', 'seller', 'farmer'), async (req, res) => {
  try {
    const { name, price, description, image, brand, category, subcategory, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Only admin or the creator can edit
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to edit this product' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', protect, requireRole('admin', 'seller', 'farmer'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
