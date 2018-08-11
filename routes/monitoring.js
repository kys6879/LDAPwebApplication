const express = require('express');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const passport = require('passport');
const fs = require('fs');

const conn = mysql.createConnection(dbconfig);
const router = express.Router();

router.get('/', (request, response, next) => {
    var d = fs.readFileSync('test.text');
    console.log(`${d}`);
});

module.exports = router;
