const express = require('express');
const ldap_get_all = require('../library/ldap_get_all');
const router = express.Router();

router.get('/:dc',(request,response,next)=>{
  let cn = request.params.dc;
  response.send(""+dc);
}); 


module.exports = router;
