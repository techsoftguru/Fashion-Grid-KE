const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cloudinary = require('../utils/cloudinary');

// @desc    Get all products with filtering & pagination
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const where = {};
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    const products = await prisma.product.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });
    const total = await prisma.product.count({ where });
    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a product (admin only)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({ message: 'Image required' });
    }
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), category, imageUrl, stock: parseInt(stock) },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = undefined;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }
    const data = { name, description, price: parseFloat(price), category, stock: parseInt(stock) };
    if (imageUrl) data.imageUrl = imageUrl;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
};