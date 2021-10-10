const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
    console.log('cb', cb)
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  console.log(file)
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Message file invalid'), false);
  } 
}

// untuk folder upload
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

const Product = require('../models/products');

router.get('/', checkAuth, async (req, res, next) => {
  const response = await Product.find().select('name price _id productImage').exec()

  if (!response) {
    return res.status(404).json({
      status: 404,
      message: 'Data not Found'
    })
  }

  const result = {
    count: response.length,
    products: response.map(v => {
      return {
        name: v.name,
        price: v.price,
        _id: v._id,
        productImage: v.productImage,
        request: {
          type: 'GET',
          url: 'http://localhost:5000/products/' + v._id
        }
      }
    })
  }

  return res.status(200).json(result)
});

router.get('/:invoiceId', checkAuth, (req, res, next) => {
  const id = req.params.invoiceId
  Product.findById(id)
  .select('name price _id productImage')
  .exec()
  .then(doc => {
    console.log(doc)

    if (doc) {
      res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          desciption: 'Get All Products',
          url: 'http://localhost:5000/products/'
        }
      });
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

router.post('/', checkAuth, upload.single('productImage'), (req, res) => {
  console.log('req.file',req.file)
  // store di mongoose
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });

  product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Berhasil create data',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/products/' + result._id
          }
        },
      });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: err})
    });
});

router.put('/:invoiceId', checkAuth, async (req, res, next) => {
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

  if (!update) {
    res.status(501).json({
      status: 501,
      message: 'Edit Product Fail'
    })
    return
  }

  res.status(200).json({
    message: 'Product Success Updated',
    data: {
      _id: update._id,
      name: update.name,
      price: update.price
    },
    request: {
      type: 'GET',
      url: 'http://localhost:5000/products/' + update._id
    }
  });
});

router.delete('/:invoiceId', checkAuth, async (req, res, next) => {
  const id = req.params.invoiceId
  const result = await Product.findByIdAndDelete({ _id: id })

  if (!result) {
    res.status(501).json({
      status: 501,
      message: 'Delete Product Fail'
    })
    return
  }

  res.status(200).json({
    status: 200,
    message: `Berhasil Delete ${id}`,
    request: {
      type: 'POST',
      url: 'http://localhost:5000/products/',
      body: {
        name: 'String',
        price: 'Number'
      }
    }
  })
});

module.exports = router