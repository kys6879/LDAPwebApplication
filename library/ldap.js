const ldap = require('ldapjs');
const ldapSettings = require('./ldapSettings.js');
const assert = require('assert');

// Create client and bind to AD
const client = ldap.createClient({
    url: `ldap://${ldapSettings.server}`
});

// Search AD for user
const searchOptions = {
  scope: "sub",
  // filter: '(cn=KimYoungseo )'
};

client.bind(userPrincipalName,password,err => {
    assert.ifError(err);
    
    client.search(adSuffix,searchOptions,(err,res) => {
      assert.ifError(err);
  
      res.on('searchEntry', entry => {
          console.log("searchEntry 이벤트");
          console.log(entry.object.dn);
      });
      res.on('searchReference', referral => {
        console.log("searchReference 이벤트");
        console.log('referral: ' + referral.uris.join());
      });
      res.on('error', err => {
        console.log("error 이벤트");
          console.error('error: ' + err.message);
      });
      res.on('end', result => {
        console.log("end 이벤트");
        // console.log(result);
      });
  });
});

// Wrap up
client.unbind( err => {
    assert.ifError(err);
});
