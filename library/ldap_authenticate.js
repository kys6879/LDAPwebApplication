const ldapjs = require('ldapjs');
const Promise = require('bluebird');

const ldapOptions = {
    url: `ldap://172.17.0.2`,
    connectTimeout: 30000,
    reconnect: true
}

const pwdUser = "cn=admin,dc=example,dc=org";
const pwdUserPassword = "admin";

let authenticate = (uid,password) => {
    return new Promise((resolve ,reject) => {
        const ldapClient = ldapjs.createClient(ldapOptions);
        ldapClient.bind(
            'cn='+uid+','+'ou=users,dc=example,dc=org',
            password,
            (err,res) => {
                if (err) return reject(err);
                ldapClient.unbind();
                return resolve(res);
            }
        )
    } )
}

module.exports = {
  authenticate
};
