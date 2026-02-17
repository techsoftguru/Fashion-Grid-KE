const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateToken, stkPush } = require('../utils/mpesa');

// @desc    Initiate M-Pesa STK Push
// @route   POST /api/mpesa/stkpush
exports.stkPush = async (req, res, next) => {
  try {
    const { phone, amount, orderId } = req.body;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Order already paid or processing' });
    }

    // Format phone: 254... (remove 0 or +254)
    const formattedPhone = phone.replace(/^0+/, '254').replace(/^\+/, '');
    const response = await stkPush(formattedPhone, amount, orderId);
    // response: { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription, CustomerMessage }
    if (response.ResponseCode === '0') {
      // Optionally store CheckoutRequestID in order for later reference
      await prisma.order.update({
        where: { id: orderId },
        data: { mpesaReceipt: response.CheckoutRequestID }, // temporarily store CheckoutRequestID
      });
      res.json({ message: 'STK Push sent successfully', CheckoutRequestID: response.CheckoutRequestID });
    } else {
      res.status(400).json({ message: response.ResponseDescription });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    M-Pesa Callback URL
// @route   POST /api/mpesa/callback
exports.mpesaCallback = async (req, res, next) => {
  try {
    // Log the entire callback
    await prisma.mpesaLog.create({ data: { data: req.body } });

    const { Body } = req.body;
    if (Body.stkCallback.ResultCode === 0) {
      // Successful payment
      const { CheckoutRequestID, CallbackMetadata } = Body.stkCallback;
      // Extract MpesaReceiptNumber from metadata
      const receipt = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const amount = CallbackMetadata.Item.find(item => item.Name === 'Amount')?.Value;
      const phone = CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber')?.Value;

      // Find order by CheckoutRequestID (stored earlier)
      const order = await prisma.order.findFirst({ where: { mpesaReceipt: CheckoutRequestID } });
      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'completed',
            mpesaReceipt: receipt,
          },
        });
      }
    } else {
      // Payment failed – maybe revert stock? But we already decreased stock; could increase back or mark order as failed.
      const { CheckoutRequestID, ResultDesc } = Body.stkCallback;
      const order = await prisma.order.findFirst({ where: { mpesaReceipt: CheckoutRequestID } });
      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'failed' },
        });
        // Optionally restore stock
        const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
        for (const item of items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (err) {
    next(err);
  }
};