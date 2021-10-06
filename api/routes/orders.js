const express = require('express')
const router = express.router()


router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Berhasil ambil semua data order'
  })
})

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId
  res.status(200).json({
    message: 'Berhasil ambil data order sesuai id',
    id
  })
})

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'Berhasil create data order'
  })
})

router.patch('/:orderId', (req, res, next) => {
  const id = req.params.orderId
  res.status(200).json({
    message: 'Berhasil update order data sesuai id',
    id
  })
})

router.delete('/:orderId', (req, res, next) => {
  const id = req.params.orderId
  res.status(200).json({
    message: 'Berhasil delete order sesuai id',
    id
  })
})