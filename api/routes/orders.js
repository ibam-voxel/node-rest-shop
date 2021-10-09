const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/products');

router.get('/', async (req, res, next) => {
  const orders = await Order.find()

  if (!orders) {
    res.status(500).json({
      message: 'Error tidak diketahui',
      status: 500
    });
  }

  const result = {
    count: orders.length,
    data: orders.map(f => {
      return {
        _id: f._id,
        product_id: f.product_id,
        quantity: f.quantity
      }
    })
  }

  res.status(200).json({
    message: 'Berhasil ambil semua data order',
    ...result
  });
});

router.get('/:orderId', async (req, res, next) => {
  const id = req.params.orderId
  let order, product
  try {
    order = await Order.findById(id)
  } catch (error) {
    order = null
  }

  if (!order) {
    return res.status(404).json({
      status: 404,
      message: 'Order not Found'
    });
  }

  try {
    product = await Product.findById({
      _id: order.product_id
    })
  } catch (error) {
    product = null
  }

  if (!product) {
    return res.status(404).json({
      status: 404,
      message: 'product not Found'
    });
  }

  res.status(200).json({
    message: 'Berhasil ambil data order sesuai id',
    data: {
      _id: order._id,
      product_id: order.product_id,
      quantity: order.quantity,
      Product: product
    }
  });
});

router.post('/', async (req, res, next) => {
  let product = null
  let order = null

  try {
    product = await Product.findById({
      _id: req.body.product_id
    });
  } catch (error) {
    product = null
  }

  if (!product) {
    return res.status(404).json({
      status: 404,
      message: 'Product not Found'
    });
  }

  try {
    order = await new Order({
      _id: new mongoose.Types.ObjectId(),
      product_id: req.body.product_id,
      quantity: req.body.quantity
    }).save()
  } catch (error) {
    order = null
  }
  console.log('order', order)

  if (!order) {
    return res.status(500).json({
      status: 500,
      message: 'Gagal Buat Order'
    });
  }

  res.status(200).json({
    status: 200,
    message: 'Berhasil Buat Data',
    data: {
      _id: order._id,
      product_id: order.product_id,
      Product: product,
      quantity: order.quantity
    }
  });
});

router.put('/:orderId', async (req, res, next) => {
  const {
    params: { orderId },
    body
  } = req

  console.log('body', body)

  if (!body.product_id || !orderId) {
    res.status(401).json({
      status: 401,
      message: 'ValidationError: _id, or required body properties is not defined'
    })

    return
  }

  let product, update

  try {
    product = await Product.findById(body.product_id)
  } catch (error) {
    product = null
  }

  if (!product) {
    res.status(401).json({
      status: 401,
      message: 'ValidationError: product id is not found'
    })

    return
  }

  try {
    update = await Order.findByIdAndUpdate(
      {_id: orderId},
      body
    )
  } catch (error) {
    update = null
  }

  if (!update) {
    res.status(501).json({
      status: 501,
      message: 'Edit Order Id  Fail'
    })
    return
  }

  res.status(200).json({
    message: 'Berhasil update order data sesuai id',
    data: {
      _id: update._id,
      product_id: update.product_id,
      quantity: body.quantity
    }
  });
});

router.delete('/:orderId', async (req, res, next) => {
  const id = req.params.orderId
  let result
  try {
    result = await Order.findByIdAndDelete({ _id: id })
  } catch (error) {
    result = null
  }

  if (!result) {
    res.status(501).json({
      status: 501,
      message: 'Delete Order Fail'
    })

    return
  }

  res.status(200).json({
    status: 200,
    message: `Berhasil Delete ${id}`,
    request: {
      type: 'POST',
      url: 'http://localhost:5000/order/',
      body: {
        product_id: 'String',
        quantity: 'Number'
      }
    }
  })
});

module.exports = router