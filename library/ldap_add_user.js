const ldapjs = require('ldapjs');
const Promise = require('bluebird');
const config = require('../config/config')

const ldapOptions = {
    url: config.server,
    connectTimeout: 30000,
    reconnect: true
}

let addUser = (gn,sn,displayName,gidNum,uidNum,password) => {
    return new Promise((resolve,reject) =>{
        const ldapClient = ldapjs.createClient(ldapOptions);
        ldapClient.bind(
            config.pwdUser,config.pwdUserPassword,
            (err) =>{
                if (err){
                    return reject(err);
                }
                let newUser = {
                    givenName : gn,
                    sn : sn,
                    uid : displayName,
                    gidNumber : gidNum,
                    uidNumber : uidNum,
                    userPassword : password,
                    cn : gn+sn,
                    homeDirectory : "/home/users/"+displayName,
                    objectClass: ["person","posixAccount","inetOrgPerson"],
                }
                let userDn = 'cn='+gn+sn+','+'ou=users,dc=example,dc=org';
                ldapClient.add(
                    userDn,
                    newUser,
                    (err,Response) => {
                        if (err){
                            return reject(err)
                        }
                        return resolve(Response);
                    }
                )
            }
        )
    } )
}

module.exports = {
    addUser
};
