var express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
const ldap_delete_entry = require('../library/ldap_delete_entry');
const ldap_add = require('../library/ldap_add');
var router = express.Router();

// 전체 그룹 보기 JSON
router.get('/', function(request, response, next) {
  let filter = `(ObjectClass=posixGroup)`;
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
    response.json(results.entries);
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  });
});

//       특정 그룹 추가 WEB
router.get('/add/web',(req,res,next)=>{
  let dn = req.query.dn;
  res.render('create/group_add',{
    dn : dn
  });
});

//       특정 그룹 추가
router.post('/add',(req,res,next)=>{
  let cn = req.body.cn;
  let gidNumber = req.body.gidNumber;
  let dn = req.body.groupdn;
  let groupdn = `cn=${cn},${dn}`;
  let entry = {
    cn : cn,
    gidNumber : gidNumber,
    objectClass : ["posixGroup","top"],
  };
  ldap_add.addEntry(groupdn , entry).then(()=>{
    console.log("그룹 추가 성공");
    res.redirect('/');
  },(err)=>{
    console.log("추가 실패 코드 : "+err);
    res.send("추가 실패 코드 : "+err);
  });
});

// 특정 그룹 상세보기 JSON
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
    response.json(results.entries);
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  })
}); 

// 특정 그룹 삭제
router.delete('/:cn',(request,response,next)=>{
  let cn = request.params.cn ;
  let filter = `(&(objectClass=posixGroup)(cn=${cn}))`
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
    });
  },(err)=>{
    response.send("삭제실패!"+err);
  });
}); 

// 특정 그룹 상세보기 WEB
router.get('/:cn/web',(request,response,next)=>{
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
