var express = require('express');
var router = express.Router();
// var authRouter = require('./auth');
var uploadRouter = require('./upload');

/* GET home page. */
router.get('/', function (req, res, next) {
  const title = req.user ? 'Profile' : 'Authentication';
  const user = req.user || null;
  res.render('pages/index', { title, layout: 'layouts/main', user });
});

module.exports = { indexRouter: router, uploadRouter };
