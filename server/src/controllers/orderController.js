const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new order (from cart)
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { deliveryZoneId, items } = req.body; // items: [{ productId, quantity }]
    const userId = req.user.id;

    // Get delivery zone price
    const zone = await prisma.deliveryZone.findUnique({ where: { id: deliveryZoneId } });
    if (!zone) return res.status(400).json({ message: 'Invalid delivery zone' });

    // Calculate totals and check stock
    let subtotal = 0;
    const orderItemsData = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      subtotal += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }
    const totalAmount = subtotal + zone.price;

    // Create order (payment pending)
    const order = await prisma.order.create({
      data: {
        userId,
        deliveryZoneId,
        totalAmount,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    // Reserve stock (decrease temporarily) – we'll commit after payment
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } }, deliveryZone: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: { items: { include: { product: true } }, deliveryZone: true },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};