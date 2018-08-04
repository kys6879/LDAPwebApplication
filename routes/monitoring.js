const express = require('express');
const mysql      = require('mysql');
const dbconfig   = require('../config/database');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const conn = mysql.createConnection(dbconfig);
const router = express.Router();

router.get('/',(request,response,next)=>{
    response.render('monitor');
}); 

router.post('/login',(request,response,next)=>{
    response.send('monitor');
}); 

module.exports = router;
