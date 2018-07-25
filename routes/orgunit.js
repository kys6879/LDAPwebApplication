var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:ou', function(req, res, next) {
  let ou = req.params.ou;
  res.send(""+ou);
});

module.exports = router;
