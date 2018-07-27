var express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
var router = express.Router();

// 특정 조직 상세보기
router.get('/:ou',(request,response,next)=>{
  let ou = request.params.ou;
  let filter = "(ObjectClass=organizationalUnit)";
  let baseDn = `ou=${ou},${config.adSuffix}`;
  let options = {
    attributes: [
      "ou",
      "ObjectClass",
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results);
    response.render('detail/ou_detail',{
      entry : results.entries[0]
    })
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 


module.exports = router;
