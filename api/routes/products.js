const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Berhasil ambil semua data'
  });
});

router.get('/:invoiceId', (req, res, next) => {
  const id = req.params.invoiceId
  res.status(200).json({
    message: 'Berhasil ambil data sesuai id',
    id
  });
});

router.post('/', (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price
  }
  res.status(201).json({
    message: 'Berhasil create data',
    createdProduct: product
  });
});

router.patch('/:invoiceId', (req, res, next) => {
  const id = req.params.invoiceId
  res.status(200).json({
    message: 'Berhasil update',
    id
  });
});

router.delete('/:invoiceId', (req, res, next) => {
  const id = req.params.invoiceId
  res.status(200).json({
    message: 'Berhasil delete',
    id
  });
});

module.exports = router