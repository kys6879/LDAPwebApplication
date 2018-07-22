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

router.get('/', function(req, res, next) {
  res.send('other');
});

router.get('/all',function(req,res,next) {
  client.bind(userPrincipalName,password,err => {
    assert.ifError(err);
    
    client.search(adSuffix,searchOptions,(err,res) => {
      assert.ifError(err);
  
      res.on('searchEntry', entry => {
          console.log(entry.object.dn);
      });
      res.on('searchReference', referral => {
        console.log('referral: ' + referral.uris.join());
      });
      res.on('error', err => {
          console.error('error: ' + err.message);
      });
      res.on('end', result => {
        // console.log(result);
      });
  });
});
});

// Wrap up
client.unbind( err => {
  assert.ifError(err);
});


module.exports = router;
