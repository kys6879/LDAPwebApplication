const express = require('express');
const ldap_search = require('../library/ldap_search');
const config = require('../config/config');
const router = express.Router();

// 전체 목록 보기 (JSON)
router.get('/',(request,response,next)=>{
  let filter = "(ObjectClass=*)";
  let baseDn = config.adSuffix;
  let options = {
    attributes: [
        "cn",
        "ou",
        "dc",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber"
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results)=>{
    response.json(results.entries);
  },(err)=>{
    console.log("검색실패",err);
    response.send("검색실패");
  }
)
});

// 전체 목록 보기 (웹)
router.get('/web',(request,response,next)=>{
  let filter = "(ObjectClass=*)";
  let baseDn = config.adSuffix;
  let options = {
    attributes: [
        "cn",
        "ou",
        "dc",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber"
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results)=>{
    let entriesstr = JSON.stringify(results.entries);
    response.render('other',{
      results : results,
      entriesstr : entriesstr,
      adSuffix : config.adSuffix
    })
  },(err)=>{
    console.log("검색실패",err);
    response.send("검색실패");
  }
)
});

module.exports = router;
