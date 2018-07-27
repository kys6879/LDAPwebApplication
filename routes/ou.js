var express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
var router = express.Router();

// 전체 조직 보기 JSON
router.get('/',(request,response,next)=>{
  let filter = `(ObjectClass=organizationalUnit)`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
      "ou",
      "ObjectClass",
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!");
    response.json(results.entries);
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 

// 특정 조직 상세보기 JSON
router.get('/:ou',(request,response,next)=>{
  let ou = request.params.ou;
  let filter = `(&(ObjectClass=organizationalUnit)(ou=${ou}))`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
      "ou",
      "ObjectClass",
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results.entries[0].dn);
    response.json(results.entries);
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 

// 특정 조직 상세보기 WEB
router.get('/:ou/web',(request,response,next)=>{
  let ou = request.params.ou;
  let filter = `(&(ObjectClass=organizationalUnit)(ou=${ou}))`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
      "ou",
      "ObjectClass",
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results.entries[0].dn);
    response.render('detail/ou_detail',{
      entry : results.entries[0]
    })
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 


module.exports = router;
