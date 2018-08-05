//       모듈 불러오기
const express = require('express');
const ldap_search = require('../library/ldap_search');
const ldap_authenticate = require('../library/ldap_authenticate');
const ldap_change_password = require('../library/ldap_change_password');
const ldap_delete_entry = require('../library/ldap_delete_entry');
const ldap_add = require('../library/ldap_add');
const config = require('../config/config');
const router = express.Router();

//       전체 유저 보기 (JSON)
router.get('/',(request,response,next)=>{
  let filter = "(ObjectClass=inetOrgPerson)";
  let baseDn = `${config.adSuffix}`
  let options = {
    attributes: [
        "cn",
        "sn",
        "uid",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber",
        "givenName",
        "homeDirectory",
        "uidNumber"
    ],
    scope: "sub",
    filter: filter
};
ldap_search.getEntryData(baseDn,options).then((results)=>{
    console.log("검색성공!");
    response.json(results.entries);
  },(err)=>{
    console.log("검색실패",err);
    response.send("검색실패");
  });
});

//       특정 유저 추가 WEB
router.get('/add/web',(req,res,next)=>{
  let filter = "(ObjectClass=posixGroup)";
  let dn = req.query.dn;
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
console.log(`/add/web DN : ${dn}`);
  ldap_search.getEntryData(baseDn,options).then((results)=>{
    console.log("검색성공!" + results.entries[0]);
    res.render('create/user_add',{
      results : results,
      dn : dn
    });
  },(err)=>{
    console.log("검색실패",err);
    res.send("검색실패");
  });
});

//       특정 유저 추가
router.post('/add',(req,res,next)=>{
  let groupName = req.body.groupName;
  let groupData = req.body.groupData;

  groupData = JSON.parse(groupData);

  for(let i=0; i<3; i++){
    if(req.body.gidNumber == groupData[i].gnumber){
      groupName = groupData[i].gname;
    }
  }

  let newUser = {
    givenName : req.body.gn,
    sn : req.body.sn,
    uid : req.body.displayName,
    gidNumber : req.body.gidNumber,
    uidNumber : req.body.un,
    userPassword : req.body.password,
    cn : req.body.gn+req.body.sn,
    homeDirectory : "/home/users/"+req.body.displayName,
    objectClass: ["person","posixAccount","inetOrgPerson"],
};

let userDn = `cn=${newUser.cn},ou=${groupName},${config.adSuffix}`;
  console.log(`/add userDn : ${userDn}`);
  ldap_add.addEntry(userDn , newUser).then(()=>{
    console.log("유저 추가 성공");
    res.redirect('/');
  },(err)=>{
    console.log("추가 실패 코드 : "+err);
    res.send("추가 실패 코드 : "+err);
  });
});

//       특정 유저 인증
router.post('/bind',(req,res,next)=>{

  let cn = req.body.username;
  let password = req.body.password;
  let ou = req.body.ou;

  ldap_authenticate.authenticate(cn,password,ou).then(()=>{
    console.log("인증성공");
    res.send("<script>alert('인증성공'); history.back();</script>");
  },(err) =>{
    console.log("인증실패 에러코드 : "+err);
    res.send("인증실패");
  });
});

//       특정 유저 비밀번호 변경
router.put('/password',(req,res,next)=>{
  let uid = req.body.uid;
  let passwordOld = req.body.passwordOld;
  let passwordNew = req.body.passwordNew;

  ldap_change_password.changePassword(uid,passwordOld,passwordNew).then(()=>{
    console.log("변경성공");
    res.send("변경성공");
  },(err)=>{
    console.log("변경실패"+err);
    res.send("변경실패");    
  });
});

// 특정 유저 상세보기 JSON
router.get('/:cn',(request,response,next)=>{
  let cn = request.params.cn ;
  let filter = `(&(objectClass=person)(cn=${cn}))`
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
        "cn",
        "sn",
        "uid",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber",
        "givenName",
        "homeDirectory",
        "uidNumber"
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

// 특정 유저 삭제
router.delete('/:cn',(request,response,next)=>{
  let cn = request.params.cn ;
  let filter = `(&(objectClass=inetOrgPerson)(cn=${cn}))`
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

// 특정 유저 상세보기 WEB
router.get('/:cn/web',(request,response,next)=>{
  let cn = request.params.cn ;
  let filter = `(&(objectClass=person)(cn=${cn}))`
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
        "cn",
        "sn",
        "uid",
        "ObjectClass",
        "createTimestamp",
        "modifyTimestamp",
        "pwdPolicySubentry",
        "gidNumber",
        "givenName",
        "homeDirectory",
        "uidNumber"
    ],
    scope: "sub",
    filter: filter
};
  ldap_search.getEntryData(baseDn,options).then((results) => {
    console.log("검색성공!" + results);
    response.render('detail/user_detail',{
      entry : results.entries[0]
    });
  }, (err)=>{
      console.log("검색실패",err);
      response.send("검색실패");
  });
}); 



module.exports = router;
