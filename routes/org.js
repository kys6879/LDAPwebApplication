const express = require('express');
const config = require('../config/config');
const ldap_get_org = require('../library/ldap_get_org');
const router = express.Router();

router.get('/',(request,response,next)=>{
  response.send("org");
}); 

// 특정 어드민 상세보기
router.get('/:dc',(request,response,next)=>{
  let dc = request.params.dc;
  let filter = "(ObjectClass=organization)";
  let baseDn = `${config.adSuffix}`
  ldap_get_org.getOrg(baseDn,filter).then((results) => {
    console.log("검색성공!" + results);
    response.render('org_detail',{
      entry : results.entries[0]
    })
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 

module.exports = router;
