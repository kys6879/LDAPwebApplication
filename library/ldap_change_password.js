const ldapjs = require('ldapjs');
const config = require('../config/config');
const Promise = require('bluebird');

const ldapOptions = {
    url: config.server,
    connectTimeout: 30000,
    reconnect: true
}

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
