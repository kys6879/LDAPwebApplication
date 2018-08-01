const express = require('express');
var mysql      = require('mysql');
var dbconfig   = require('../config/database');

var conn = mysql.createConnection(dbconfig);
const router = express.Router();

router.get('/',(request,response,next)=>{
    let sql = `SELECT * FROM user;`
    conn.query(sql,(err,rows)=>{
        if(err) throw err;
        response.send(""+ JSON.stringify(rows,null,2));
    });
}); 

module.exports = router;
