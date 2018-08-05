const express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
const router = express.Router();

/* GET home page. */
router.get('/',(req, res, next) => {
  let filter = "(ObjectClass=organizationalUnit)";
  let baseDn = `ou=department,${config.adSuffix}`
  let options = {
    attributes: [
        "ou",
        "ObjectClass",
        "businessCategory"
    ],
    scope: "one",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results)=>{
    console.log(`총 결과 : ${results.entryLength} 개`);
    console.log("검색성공!" + JSON.stringify(results.entries,null,2));
    res.render('index',{
      results : results,
      title : 'Express',
      user : req.user
    });
  },(err)=>{
    console.log("검색실패",err);
    res.send("검색실패");
  });
});

module.exports = router;
