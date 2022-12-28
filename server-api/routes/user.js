const express = require('express');
const router = express.Router();
const service = require('../services/user');
const { Route } = require('../utils/authorizations');
const { TYPES_LOGIN } = require('../library/statics');

router.get('/', (req, res, next) => {
  Route(req, res, next, TYPES_LOGIN.PRIVATE, service.all)
})
router.get('/:id', (req, res, next) => {
  Route(req, res, next, TYPES_LOGIN.PRIVATE, service.get)
})
router.post('/register', service?.register)
module.exports = router;