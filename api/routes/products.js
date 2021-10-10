const express = require('express');
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

const Product = require('../controllers/products');

router.get('/', checkAuth, Product.getAll);

router.get('/:invoiceId', checkAuth, Product.getById);

router.post('/', checkAuth, upload.single('productImage'), Product.create);

router.put('/:invoiceId', checkAuth, Product.update);

router.delete('/:invoiceId', checkAuth, Product.delete);

module.exports = router