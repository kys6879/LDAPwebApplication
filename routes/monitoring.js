const express = require('express');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const passport = require('passport');

const conn = mysql.createConnection(dbconfig);
const router = express.Router();

router.get('/', (request, response, next) => {
    var sql = `select * from user`;
    conn.query(sql,(err,rows,fields)=>{
        if (err ) throw err
        response.render('monitor');  
    })
});

module.exports = router;
