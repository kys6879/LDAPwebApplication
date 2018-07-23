const express = require('express');
const ldap_add_user = require('../library/ldap_add_user');
const ldap_authenticate = require('../library/ldap_authenticate');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('user');
});

router.post('/auth',function(req,response,nextt) {
  let uid = req.body.uid;
  let password = req.body.password;
  ldap_authenticate.authenticate(uid,password).then(()=>{
    console.log("인증성공");
    response.send("인증성공");
  },(err) =>{
    console.log("인증실패"+err);
    response.send("인증실패");
  });
});

router.post('/',function(req,res,next) {
  let uidNum = req.body.uidNum;
  let gn = req.body.gn;
  let sn = req.body.sn;
  let display = req.body.display;
  let password = req.body.password;

  ldap_add_user.addUser(uidNum,gn,sn,display,password).then(()=>{
    console.log("유저 추가 성공");
    res.send("유저 추가 성공");
  },(err) =>{
    console.log("추가 실패 코드 : "+err);
    res.send("추가 실패 코드 : "+err);
  });
});

module.exports = router;
