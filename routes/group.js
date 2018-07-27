var express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
var router = express.Router();

// 전체 그룹 보기 JSON
router.get('/', function(request, response, next) {
  let filter = `(ObjectClass=posixGroup)`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
        "cn",
        "uid",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber",
        "memberUid"
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results);
    response.json(results.entries);
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
});

// 특정 그룹 상세보기 JSON
router.get('/:cn',(request,response,next)=>{
  let cn = request.params.cn;
  let filter = `(&(ObjectClass=posixGroup)(cn=${cn}))`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
        "cn",
        "uid",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber",
        "memberUid"
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results);
    response.json(results.entries);
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 

// 특정 그룹 상세보기 WEB
router.get('/:cn/web',(request,response,next)=>{
  let cn = request.params.cn;
  let filter = `(&(ObjectClass=posixGroup)(cn=${cn}))`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
        "cn",
        "uid",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber",
        "memberUid"
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results);
    response.render('detail/group_detail',{
      entry : results.entries[0]
    })
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 
module.exports = router;
