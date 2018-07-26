var express = require('express');
var dTree = require('../library/dTree/dtree');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('monitor');
});

module.exports = router;
