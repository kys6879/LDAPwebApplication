var express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('group');
});

// 특정 그룹 상세보기
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
    response.render('detail/group_detail',{
      entry : results.entries[0]
    })
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 

module.exports = router;
