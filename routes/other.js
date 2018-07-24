const express = require('express');
const ldap_get_all = require('../library/ldap_get_all');
const router = express.Router();

router.get('/',(req,res,next)=>{
  res.send('other');
});

router.get('/all',(request,response,next)=>{
  ldap_get_all.getAllRecords().then((results)=>{
    console.log("검색성공!");
    response.send("결과 :"+ results.entries+"<br>"+"필터 :"+results.filterOption);
  },(err)=>{
    console.log("검색실패",err);
    response.send("검색실패");
  }
)
});

module.exports = router;
