//       모듈 불러오기
const express = require('express');
const passport = require('passport');
const ldap_search = require('../library/ldap_search');
const ldap_authenticate = require('../library/ldap_authenticate');
const ldap_change_password = require('../library/ldap_change_password');
const ldap_delete_entry = require('../library/ldap_delete_entry');
const ldap_add = require('../library/ldap_add');
const config = require('../config/config');
const router = express.Router();


//       전체 유저 보기 (JSON)
router.get('/', (request, response, next) => {
  let filter = "(ObjectClass=inetOrgPerson)";
  let baseDn = `${config.adSuffix}`
  let options = {
    attributes: [
      "cn",
      "sn",
      "uid",
      "ObjectClass",
      "gidNumber",
      "givenName",
      "homeDirectory",
      "uidNumber",
      "businessCategory",
      "userPassword"
    ],
    scope: "sub",
    filter: filter
  };
  ldap_search.getEntryData(baseDn, options).then((results) => {
    console.log("검색성공!");
    console.log(`${JSON.stringify(results.entries,null,2)}`);
    response.json(results.entries);
  }, (err) => {
    console.log("검색실패", err);
    response.send("검색실패");
  });
});

//       특정 유저 추가 WEB
router.get('/add/web', (req, res, next) => {
  let filter = "(|(ObjectClass=organizationalUnit)(ObjectClass=posixGroup))";
  let dn = req.query.dn;
  let baseDn = `ou=department,${config.adSuffix}`
  let options = {
    attributes: [
      "cn",
      "ObjectClass",
      "businessCategory"
    ],
    scope: "one",
    filter: filter
  };
  console.log(`/add/web DN : ${dn}`);
  ldap_search.getEntryData(baseDn, options).then((results) => {
    console.log("검색성공!" + results.entries[0]);
    res.render('create/user_add', {
      results: results,
      dn: dn
    });
  }, (err) => {
    console.log("검색실패", err);
    res.send("검색실패");
  });
});

//       특정 유저 추가
router.post('/add', (req, res, next) => {
  let ouName = req.body.ou;

  let newUser = {
    givenName: req.body.gn,
    sn: req.body.sn,
    uid: req.body.displayName,
    gidNumber: req.body.gidNumber,
    uidNumber: req.body.un,
    userPassword: req.body.password,
    cn: req.body.gn + req.body.sn,
    businessCategory: [req.body.position,req.body.depart],
    homeDirectory: "/home/users/" + req.body.displayName,
    objectClass: ["person", "posixAccount", "inetOrgPerson"],
  };

  let userDn = `cn=${newUser.cn},ou=${ouName},ou=department,${config.adSuffix}`;
  console.log(`/add userDn : ${userDn}`);
  ldap_add.addEntry(userDn, newUser).then(() => {
    console.log("유저 추가 성공");
    res.redirect('/');
  }, (err) => {
    console.log("추가 실패 코드 : " + err);
    res.send("추가 실패 코드 : " + err);
  });
});

router.get('/passport/success', (request, response, next) => {
  response.send("<script>alert('로그인성공!'); location.href=`/`; </script>");
});

router.get('/passport/fail', (request, response, next) => {
  response.send("<script>alert('로그인실패!..'); location.href=`/`; </script>");
});

router.get('/logout', (request, response, next) => {
  request.logout();
  response.send("<script>alert('로그아웃 되었습니다.'); location.href=`/`; </script>");
});

router.post('/bind', passport.authenticate('local', {
  successRedirect: '/user/passport/success',
  failureRedirect: '/user/passport/fail',
  failureFlash: false
}));

//       특정 유저 비밀번호 변경
router.put('/password', (req, res, next) => {
  let uid = req.body.uid;
  let passwordOld = req.body.passwordOld;
  let passwordNew = req.body.passwordNew;

  ldap_change_password.changePassword(uid, passwordOld, passwordNew).then(() => {
    console.log("변경성공");
    res.send("변경성공");
  }, (err) => {
    console.log("변경실패" + err);
    res.send("변경실패");
  });
});

// 로그인 한 유저의 프로필 보기 WEB
router.get('/myprofile/web', (request, response, next) => {
  let cn = request.query.cn;
  let filter = `(&(objectClass=person)(cn=${cn}))`;
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
      "cn",
      "uid",
      "ObjectClass",
      "gidNumber",
      "businessCategory",
    ],
    scope: "sub",
    filter: filter
  };
  ldap_search.getEntryData(baseDn, options).then((results) => {
    console.log(`검색성공!!! : ${JSON.stringify(results.entries, null, 2)}`);
    response.render('user/myprofile',{
      result : results.entries[0]
    });
  }, (err) => {
    console.log("검색실패", err);
    response.send("검색실패");
  });
  
});

// 특정 유저 상세보기 JSON
router.get('/:cn', (request, response, next) => {
  let cn = request.params.cn;
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
      "uidNumber",
      "businessCategory",
    ],
    scope: "sub",
    filter: filter
  };
  ldap_search.getEntryData(baseDn, options).then((results) => {
    console.log(`검색성공!!! : ${JSON.stringify(results.entries, null, 2)}`);
    response.json(results.entries);
  }, (err) => {
    console.log("검색실패", err);
    response.send("검색실패");
  });
});

// 특정 유저 삭제
router.delete('/:cn', (request, response, next) => {
  let cn = request.params.cn;
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
  ldap_search.getEntryData(baseDn, options).then((results) => {
    console.log("검색성공!" + results.entries);
    ldap_delete_entry.deleteEntry(results.entries[0].dn).then(() => {
      console.log("삭제 성공!");
      response.send({
        result: true
      });
    });
  }, (err) => {
    response.send("삭제실패!" + err);
  });
});

// 특정 유저 상세보기 WEB
router.get('/:cn/web', (request, response, next) => {
  let cn = request.params.cn;
  let gidNumber = request.query.gidNumber;
  let filter = `(|(&(cn=${cn})(objectClass=person))(&(gidNumber=${gidNumber})(objectClass=posixGroup)))` 
  // group = 직책 . user 에 대한정보와 user 의 잭첵에 대한 정보를 search 함.
  let baseDn = `${config.adSuffix}`;
  let options = {
    attributes: [
      "cn",
      "uid",
      "ObjectClass",
      "gidNumber",
      "uidNumber",
      "businessCategory"
    ],
    scope: "sub",
    filter: filter
  };
  ldap_search.getEntryData(baseDn, options).then((results) => {
    console.log("검색성공!" + JSON.stringify(results.entries, null, 2));
    // response.send("<pre>"+JSON.stringify( results.entries,null,2)+"</pre>"); 

    response.render('detail/user_detail', {
      entry: results.entries
    });
  }, (err) => {
    console.log("검색실패", err);
    response.send("검색실패");
  });
});




module.exports = router;
