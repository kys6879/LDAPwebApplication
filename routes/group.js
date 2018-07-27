var express = require('express');
const config = require('../config/config');
const ldap_get_group = require('../library/ldap_get_group');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('group');
});

// 특정 그룹 상세보기
router.get('/:cn',(request,response,next)=>{
  let cn = request.params.cn;
  let filter = "(ObjectClass=posixGroup)";
  let baseDn = `cn=${cn},ou=groups,${config.adSuffix}`
  ldap_get_group.getGroup(baseDn,filter).then((results) => {
    console.log("검색성공!" + results);
    response.render('group_detail',{
      entry : results.entries[0]
    })
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })

  
}); 

module.exports = router;
