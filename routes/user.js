const express = require('express');
const ldap = require('../library/ldap');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('user');
});

router.post('/',function(req,res,next) {
  let uidNum = req.body.uidNum;
  let gn = req.body.gn;
  let sn = req.body.sn;
  let display = req.body.display;
  let password = req.body.password;

  ldap.addUser(uidNum,gn,sn,display,password).then(()=>{
    console.log("유저 추가 성공");
    res.send("유저 추가 성공");
  },(err) =>{
    console.log("추가 실패 코드 : "+err);
    res.send("추가 실패 코드 : "+err);
  });
});

module.exports = router;

// addUser(1002,"Lee","junseo","ljunseo","1234").then( ()=>{
//   console.log("success!");
// } , (err) =>{
//   console.log("error!" + err);
// })

// let addUser = (userId,gn ,sn ,display,password) => {
//   return new Promise((resolve,reject) =>{
//       const ldapClient = ldapjs.createClient(ldapOptions);
//       ldapClient.bind(
//           pwdUser,pwdUserPassword,
//           (err) =>{
//               if (err){
//                   return reject(err);
//               }
//               let newUser = {
//                   uid : gn+sn,
//                   cn : gn+sn,
//                   givenName : gn,
//                   sn : sn,
//                   gidNumber : 501,
//                   uidNumber : userId,
//                   userPassword : password,
//                   homeDirectory : "/home/users/"+display,
//                   objectClass: ["person","posixAccount","inetOrgPerson"],
//               }
//               ldapClient.add(
//                   'cn='+gn+sn+','+'ou=users,dc=example,dc=org',
//                   newUser,
//                   (err,Response) => {
//                       if (err){
//                           return reject(err)
//                       }
//                       return resolve(Response);
//                   }
//               )
//           }
//       )
//   } )
// }
