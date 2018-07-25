const express = require('express');
const ldap_get_all = require('../library/ldap_get_all');
const router = express.Router();

router.get('/',(request,response,next)=>{
  let filter = "(ObjectClass=*)"
  ldap_get_all.getAllRecords(filter).then((results)=>{
    console.log("검색성공!");
    response.render('other',{
      results : results
    })
  },(err)=>{
    console.log("검색실패",err);
    response.send("검색실패");
  }
)
});

router.get('/:cn',(request,response,next)=>{
  let cn = request.params.cn;
  response.send(""+cn);
}); 


module.exports = router;
