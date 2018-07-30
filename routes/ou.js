var express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
const ldap_delete_entry = require('../library/ldap_delete_entry');
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
// 특정 그룹 삭제
router.delete('/:ou',(request,response,next)=>{
  let ou = request.params.ou ;
  let filter = `(&(objectClass=organizationalUnit)(ou=${ou}))`
  let baseDn = `${config.adSuffix}`
  let options = {
    attributes: [
        "cn",
        "ObjectClass",
    ],
    scope: "sub",
    filter: filter
};  
  ldap_search.getEntryData(baseDn,options).then((results)=>{
    console.log("검색성공!" + results.entries);
    ldap_delete_entry.deleteEntry(results.entries[0].dn).then(()=>{
      console.log("삭제 성공!");
      response.send({
        result : true
      });
    })
  },(err)=>{
    response.send("삭제실패!"+err);
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
