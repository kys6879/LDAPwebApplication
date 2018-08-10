const express = require('express');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const  fs  = require ( 'file-system' ); 
const router = express.Router();

const conn = mysql.createConnection(dbconfig);

router.get('/export/web',(request, response, next) => {
  response.render('option/export');
});

router.post('/export',(req, response, next) => {
  let alldata = req.body.entries;
  let kind = req.body.kind;

  console.log("body 값 : " + alldata);
  console.log("kind 값 : " + kind);
      fs.writeFile(`./data/${kind}.json`, alldata, encoding="utf-8",(err) => {
        if(err){
            response.send("Failed" + err);
        }
    });
    response.send({
      result : true
    });
}); 

router.post('/export/db',(req, response, next) => {
  let sql = "truncate user;";
  let users = req.body.users;
  users = JSON.parse(users);
  console.log(`${users}`);
  for(let i=0; i<users.length ; i++){
    sql += `INSERT INTO user (user_cn,user_dn,user_gid,user_position,user_depart,user_display,user_number,user_password) 
    VALUES
    ("${users[i].cn}","${users[i].dn}",
    "${users[i].gidNumber}","${users[i].businessCategory[0]}",
    "${users[i].businessCategory[1]}","${users[i].uid}",
    "${users[i].uidNumber}","${users[i].userPassword}");`
  }
  console.log(sql);
  conn.query(sql,(err,rows,fields)=>{
    if (err) throw err
    else{
      console.log("성공!");
    }
  })
  response.send({
    result : true
  });
}); 



module.exports = router;
