const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Orders = require('../controllers/orders');

router.get('/', checkAuth, Orders.getAll);

router.get('/:orderId', checkAuth, Orders.getById);

router.post('/', checkAuth, Orders.create);

router.put('/:orderId', checkAuth, Orders.update);

router.delete('/:orderId', checkAuth, Orders.delete);

module.exports = router