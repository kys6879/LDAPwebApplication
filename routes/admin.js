const express = require('express');
const config = require('../config/config');
const ldap_get_admin = require('../library/ldap_get_admin');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('admin page ');
});

// 특정 어드민 상세보기
router.get('/:cn',(request,response,next)=>{
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
