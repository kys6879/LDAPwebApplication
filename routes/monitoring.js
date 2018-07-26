var express = require('express');
const ldap_get_all = require('../library/ldap_get_all');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let filter = "(ObjectClass=*)";
  ldap_get_all.getAllRecords(filter).then((results)=>{
    let entriesstr = JSON.stringify(results.entries);
    res.render('monitor',{
      results : results,
      entriesstr : entriesstr,
    })
  },(err)=>{
    console.log("검색실패",err);
    res.send("검색실패");
  }
  )
});


module.exports = router;
