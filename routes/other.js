const express = require('express');
const ldap = require('ldapjs');
const ldapSettings = require('../library/ldapSettings');
const assert = require('assert');
const router = express.Router();

// Create client and bind to AD
const client = ldap.createClient({
  url: `ldap://${ldapSettings.server}`
});

// Search AD for user
const searchOptions = {
scope: "sub",
// filter: '(cn=KimYoungseo )'
};
// LDAP Connection Settings
const server = "172.17.0.2"; // 192.168.1.1
const userPrincipalName = "cn=admin,dc=example,dc=org"; // Username
const password = "admin"; // User password
const adSuffix = "dc=example,dc=org"; // test.com

client.bind(userPrincipalName,password,err => {
  assert.ifError(err);
  console.log("bind");
});

router.get('/', function(req, res, next) {
  res.send('other');
});

router.get('/all',function(req,response,next) {
  let results = ""
  client.search(adSuffix,searchOptions,(err,res) => {
    assert.ifError(err);
    res.on('searchEntry', entry => {
      results += "<div style='margin-bottom: 5px'>"+entry.object.dn+"</div><br>";
    });
    res.on('error', err => {
        console.error('error: ' + err.message);
    });
    res.on('end', result => {
      response.render("other_all",{
        results : results
      });
    });
});
});

module.exports = router;
