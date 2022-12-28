const express = require('express');
const router = express.Router();
const service = require('../services/family');
const { Route } = require('../utils/authorizations');
const { TYPES_LOGIN } = require('../library/statics');

router.get('/', (req, res, next) => {
  Route(req, res, next, TYPES_LOGIN.PRIVATE, service.all)
})
router.get('/:id', (req, res, next) => {
  Route(req, res, next, TYPES_LOGIN.PRIVATE, service.get)
})
router.post('/', (req, res, next) => {
  Route(req, res, next, TYPES_LOGIN.PRIVATE, service.create)
})
router.patch('/:id', (req, res, next) => {
  Route(req, res, next, TYPES_LOGIN.PRIVATE, service.update)
})
router.delete('/:id', (req, res, next) => {
  Route(req, res, next, TYPES_LOGIN.PRIVATE, service.get)
})
module.exports = router;