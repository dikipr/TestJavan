const express = require('express');
const router = express.Router();
const auth = require('./auth')
const user = require('./user')
const family = require('./family')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', auth)
router.use('/user', user)
router.use('/family', family)

module.exports = router;
