const express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
const router = express.Router();

/* GET home page. */
router.get('/',(req, res, next) => {
  let filter = "(ObjectClass=posixGroup)";
  let baseDn = `${config.adSuffix}`
  let options = {
    attributes: [
        "cn",
        "ObjectClass",
        "gidNumber"
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results)=>{
    console.log("검색성공!" + JSON.stringify(results.entries,null,2));
    res.render('index',{
      results : results,
      title : 'Express'
    });
  },(err)=>{
    console.log("검색실패",err);
    res.send("검색실패");
  });
});

module.exports = router;
