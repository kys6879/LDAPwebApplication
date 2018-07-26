//       모듈 불러오기
const express = require('express');
const ldap_add_user = require('../library/ldap_add_user');
const ldap_get_all = require('../library/ldap_get_all');
const ldap_authenticate = require('../library/ldap_authenticate');
const ldap_change_password = require('../library/ldap_change_password');
const router = express.Router();

//       전체 유저 검색
router.get('/',(request,response,next)=>{
  let filter = "(ObjectClass=person)"
  ldap_get_all.getAllRecords(filter).then((results)=>{
    console.log("검색성공!");
    response.render('user',{
      results : results
    })
  },(err)=>{
    console.log("검색실패",err);
    response.send("검색실패");
  }
)
});

//       특정 유저 추가
router.get('/add',(req,res,next)=>{
  let filter = "(ObjectClass=posixGroup)"
  ldap_get_all.getAllRecords(filter).then((results)=>{
    console.log("검색성공!" + results);
    res.render('user_add',{
      results : results
    })
  },(err)=>{
    console.log("검색실패",err);
    res.send("검색실패");
  }
)  
})

router.post('/add',(req,res,next)=>{
  let gn = req.body.gn;
  let sn = req.body.sn;
  let displayName = req.body.displayName;
  let gidNum = req.body.gidNumber;
  let uidNum = req.body.uidNumber;
  let password = req.body.password;
  
  ldap_add_user.addUser(gn,sn,displayName,gidNum,uidNum,password).then(()=>{
    console.log("유저 추가 성공");
    res.redirect('/');
  },(err) =>{
    console.log("추가 실패 코드 : "+err);
    res.send("추가 실패 코드 : "+err);
  });
})

//       특정 유저 인증
router.post('/auth',(req,res,next)=>{
  let uid = req.body.uid;
  let password = req.body.password;
  ldap_authenticate.authenticate(uid,password).then(()=>{
    console.log("인증성공");
    res.send("인증성공");
  },(err) =>{
    console.log("인증실패"+err);
    res.send("인증실패");
  });
})

//       특정 유저 비밀번호 변경
router.put('/password',(req,res,next)=>{
  var uid = req.body.uid;
  var passwordOld = req.body.passwordOld;
  var passwordNew = req.body.passwordNew;

  ldap_change_password.changePassword(uid,passwordOld,passwordNew).then(()=>{
    console.log("변경성공");
    res.send("변경성공");
  },(err)=>{
    console.log("변경실패"+err);
    res.send("변경실패");    
  } )
})

router.get('/:cn',(request,response,next)=>{
  let cn = request.params.cn;
  response.send(""+cn);
}); 

module.exports = router;
