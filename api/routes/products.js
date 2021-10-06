const express = require('express')
const router = express.router()


router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Berhasil ambil semua data'
  })
})

router.get('/:invoiceId', (req, res, next) => {
  const id = req.params.invoiceId
  res.status(200).json({
    message: 'Berhasil ambil data sesuai id',
    id
  })
})

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'Berhasil create data'
  })
})

router.patch('/:invoiceId', (req, res, next) => {
  const id = req.params.invoiceId
  res.status(200).json({
    message: 'Berhasil update',
    id
  })
})

router.delete('/:invoiceId', (req, res, next) => {
  const id = req.params.invoiceId
  res.status(200).json({
    message: 'Berhasil delete',
    id
  })
})