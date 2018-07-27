const express = require('express');
const config = require('../config/config');
const ldap_get_admin = require('../library/ldap_get_admin');
const router = express.Router();

// 전체 어드민 보기 JSON
router.get('/', function(request, response, next) {
  let cn = request.params.cn;
  let filter = `(ObjectClass=organizationalRole)`;
  let baseDn = `${config.adSuffix}`
  ldap_get_admin.getAdmin(baseDn,filter).then((results) => {
    console.log("검색성공!" + results);
    response.json(results.entries);
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
});

// 특정 어드민 상세보기 JSON
router.get('/:cn',(request,response,next)=>{
  let cn = request.params.cn;
  let filter = `(&(ObjectClass=organizationalRole)(cn=${cn}))`;
  let baseDn = `${config.adSuffix}`
  ldap_get_admin.getAdmin(baseDn,filter).then((results) => {
    console.log("검색성공!" + results);
    response.json(results.entries);
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 

// 특정 어드민 상세보기 WEB
router.get('/:cn/web',(request,response,next)=>{
  let cn = request.params.cn;
  let filter = `(&(ObjectClass=organizationalRole)(cn=${cn}))`;
  let baseDn = `${config.adSuffix}`
  ldap_get_admin.getAdmin(baseDn,filter).then((results) => {
    console.log("검색성공!" + results);
    response.render('detail/admin_detail',{
      entry : results.entries[0]
    })
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 


module.exports = router;
