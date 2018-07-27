const express = require('express');
const ldap_search = require('../library/ldap_search');
const router = express.Router();

const adSuffix = "dc=example,dc=org"; // test.com

router.get('/',(request,response,next)=>{
  let filter = "(ObjectClass=*)";

  let options = {
    attributes: [
        "cn",
        "ou",
        "dc",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber"
    ],
    scope: "sub",
    filter: "(ObjectClass=*)"
};

  ldap_search.getEntryData(filter,options).then((results)=>{
    let entriesstr = JSON.stringify(results.entries);
    response.render('other',{
      results : results,
      entriesstr : entriesstr,
      adSuffix : adSuffix
    })
  },(err)=>{
    console.log("검색실패",err);
    response.send("검색실패");
  }
)
});

router.get('/:cn',(request,response,next)=>{
  let cn = request.params.cn;
  response.send(""+cn);
}); 


module.exports = router;
