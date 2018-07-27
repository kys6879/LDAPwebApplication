const express = require('express');
const ldap_get_all = require('../library/ldap_get_all');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('admin page ');
});

router.get('/:cn', function(req, res, next) {
  let cn = req.params.cn;
  res.send(`${cn}`);
});


module.exports = router;
