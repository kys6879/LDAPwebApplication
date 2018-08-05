const express = require('express');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const passport = require('passport');

const conn = mysql.createConnection(dbconfig);
const router = express.Router();

router.get('/', (request, response, next) => {
    response.render('monitor');
});

router.get('/success', (request, response, next) => {
    response.send("로그인성공");
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/monitor/success',
    failureRedirect: '/monitor',
    failureFlash: false
}));

module.exports = router;
