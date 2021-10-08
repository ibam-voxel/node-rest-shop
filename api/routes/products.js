const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/products');

router.get('/', (req, res, next) => {
  Product.find()
  .exec()
  .then(docs => {
    console.log(docs)
    // if (docs.length >= 0) {
    res.status(200).json(docs)
    // } else {
    //   res.status(400).json({
    //     message: 'No Valid Result'
    //   })
    // }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
});

router.get('/:invoiceId', (req, res, next) => {
  const id = req.params.invoiceId
  Product.findById(id)
  .exec()
  .then(doc => {
    console.log(doc)

    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(400).json({
        message: 'No valid entry found for provided ID'
      })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({error: err})
  })
});

router.post('/', (req, res, next) => {
  // store di mongoose
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Berhasil create data',
        createdProduct: result
      });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    });
});

router.put('/:invoiceId', async (req, res, next) => {
  const {
    params: { invoiceId },
    body
  } = req

  if (!body.name || !body.price || !invoiceId) {
    res.status(401).json({
      status: 401,
      message: 'ValidationError: _id, or required body properties is not defined'
    })

    return
  }

  const update = await Product.findByIdAndUpdate(
    { _id: invoiceId },
    body
  )

  console.log('update', update)

  if (!update) {
    res.status(501).json({
      status: 501,
      message: 'Edit Product Fail'
    })
    return
  }

  res.status(200).json({
    message: 'Product Success Updated',
    data: update
  });
});

router.delete('/:invoiceId', async (req, res, next) => {
  const id = req.params.invoiceId
  const result = await Product.findByIdAndDelete({ _id: id })

  if (!result) {
    res.status(501).json({
      status: 501,
      message: 'Delete Product Fail'
    })
  }

  res.status(200).json({
    status: 200,
    message: `Berhasil Delete ${id}`
  })
});

module.exports = router