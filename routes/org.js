const express = require('express');
const ldap_get_all = require('../library/ldap_get_all');
const router = express.Router();

router.get('/',(request,response,next)=>{
  response.send("org");
}); 

router.get('/:dc',(request,response,next)=>{
  let dc = request.params.dc;
  response.send(""+dc);
}); 

module.exports = router;
