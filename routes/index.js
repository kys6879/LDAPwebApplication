const express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
const router = express.Router();

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index',{
    title : 'Express',
    user : req.user
  });
});

module.exports = router;
