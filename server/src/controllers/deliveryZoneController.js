const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all delivery zones
exports.getZones = async (req, res, next) => {
  try {
    const zones = await prisma.deliveryZone.findMany();
    res.json(zones);
  } catch (err) {
    next(err);
  }
};

// @desc    Create zone (admin)
exports.createZone = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const zone = await prisma.deliveryZone.create({ data: { name, price: parseFloat(price) } });
    res.status(201).json(zone);
  } catch (err) {
    next(err);
  }
};

// @desc    Update zone (admin)
exports.updateZone = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    const zone = await prisma.deliveryZone.update({
      where: { id: parseInt(req.params.id) },
      data: { name, price: parseFloat(price) },
    });
    res.json(zone);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete zone (admin)
exports.deleteZone = async (req, res, next) => {
  try {
    await prisma.deliveryZone.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Zone deleted' });
  } catch (err) {
    next(err);
  }
};