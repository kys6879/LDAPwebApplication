const express = require('express');
const ldap_get_all = require('../library/ldap_get_all');
const router = express.Router();

const adSuffix = "dc=example,dc=org"; // test.com

router.get('/',(request,response,next)=>{
  let filter = "(ObjectClass=*)"
  ldap_get_all.getAllRecords(filter).then((results)=>{
    let entriesstr = JSON.stringify(results.entries);
    response.render('other',{
      results : results,
      entriesstr : entriesstr,
      adSuffix : adSuffix
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
