const express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
const router = express.Router();

// 전체 최상위 조직 보기  JSON
router.get('/',(request,response,next)=>{
  let filter = `(ObjectClass=organization)`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
      "dc",
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

// 특정 최상위 조직 상세보기 JSON
router.get('/:dc',(request,response,next)=>{
  let dc = request.params.dc;
  let filter = `(&(ObjectClass=organization)(dc=${dc}))`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
        "dc",
        "o",
        "ObjectClass",
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

// 특정 최상위 조직 상세보기 WEB
router.get('/:dc/web',(request,response,next)=>{
  let dc = request.params.dc;
  let filter = `(&(ObjectClass=organization)(dc=${dc}))`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
        "dc",
        "o",
        "ObjectClass",
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results);
    response.render('detail/org_detail',{
      entry : results.entries[0]
    })
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 

module.exports = router;
