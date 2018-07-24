const ldapjs = require('ldapjs');
const Promise = require('bluebird');

const ldapOptions = {
    url: `ldap://172.17.0.2`,
    connectTimeout: 30000,
    reconnect: true
}

const pwdUser = "cn=admin,dc=example,dc=org";
const pwdUserPassword = "admin";
const adSuffix = "dc=example,dc=org"; // test.com

let changePassword = (uid,passwordOld,passwordNew) =>{
    return new Promise((resolve,reject)=>{
        const ldapClient = ldapjs.createClient(ldapOptions);

        ldapClient.bind(
            'cn='+uid+','+'ou=users,dc=example,dc=org',
            passwordOld,
            (err)=>{
                if(err) return reject(err);

                ldapClient.modify('cn='+uid+','+'ou=users,dc=example,dc=org',
                [
                    new ldapjs.Change({
                        operation: 'replace',
                        modification:{
                            userPassword : passwordNew
                        }
                    })
                ],
                (err)=>{
                    if(err) return reject(err);
                    return resolve(true);
                }
            )
            }
        )
    })
}

module.exports = {
    changePassword
};
