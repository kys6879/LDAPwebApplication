const express = require('express');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
const ldap_delete_entry = require('../library/ldap_delete_entry');
const ldap_add = require('../library/ldap_add');
const router = express.Router();

// 전체 조직 보기 JSON
router.get('/',(request,response,next)=>{
  let filter = `(ObjectClass=organizationalUnit)`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
      "ou",
      "ObjectClass",
      "businessCategory"
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
  });
}); 

//       특정 조직 추가 WEB
router.get('/add/web',(req,res,next)=>{
  let dn = req.query.dn;
  res.render('create/ou_add',{
    dn : dn
  });
});

//       특정 조직 추가
router.post('/add',(req,res,next)=>{
  let ouname = req.body.ouname; // 사용자가 정한 조직이름
  let koreanName = req.body.koreanName
  let oudn = "ou="+ouname+","+req.body.oudn;
  let entry = {
    ou : ouname,
    objectClass : ["organizationalUnit","top"],
    businessCategory : koreanName
  }
  console.log(`만들려는그룹이름${ouname} 추가할려면 dn주소 ${oudn}`);
  ldap_add.addEntry(oudn , entry).then(()=>{
    console.log("조직 추가 성공");
    res.redirect('/');
  },(err)=>{
    console.log("추가 실패 코드 : "+err);
    res.send("추가 실패 코드 : "+err);
  });
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
      "businessCategory"
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
  });
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
    });
  },(err)=>{
    response.send("삭제실패!"+err);
  });
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
      "businessCategory"
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results.entries[0].dn);
    response.render('detail/ou_detail',{
      entry : results.entries[0]
    });
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  });
}); 


module.exports = router;
