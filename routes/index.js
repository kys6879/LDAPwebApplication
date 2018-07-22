var express = require('express');
var ldap = require('../library/ldapSettings.js')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log(""+ldap.server);
});

module.exports = router;
