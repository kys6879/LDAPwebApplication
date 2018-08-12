const express = require('express');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const passport = require('passport');
const config = require('../config/config');
const ldap_search = require('../library/ldap_search');
const fs = require('fs');

const conn = mysql.createConnection(dbconfig);
const router = express.Router();

router.get('/', (request, response, next) => {
    let filter = `(|(&(cn=김영서)(objectClass=person))(&(gidNumber=508)(objectClass=posixGroup)))`
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
        ],
        scope: "sub",
        filter: filter
    };
    ldap_search.getEntryData(baseDn, options).then((results) => {
        console.log("검색성공!" + JSON.stringify(results.entries, null, 2));
        response.render('monitor', {
            entry: results.entries[0]
        });
    }, (err) => {
        console.log("검색실패", err);
        response.send("검색실패");
    });
});

module.exports = router;
