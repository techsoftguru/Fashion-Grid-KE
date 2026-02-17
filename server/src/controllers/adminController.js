const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all users (admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, deliveryZone: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { orderStatus },
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// @desc    Get sales analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({ _sum: { totalAmount: true } });
    const completedPayments = await prisma.order.count({ where: { paymentStatus: 'completed' } });
    // Add more as needed
    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      completedPayments,
    });
  } catch (err) {
    next(err);
  }
};