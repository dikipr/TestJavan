const express = require('express');
const router = express.Router();
const service = require('../services/auth')

router.post('/login', service.login);
module.exports = router;