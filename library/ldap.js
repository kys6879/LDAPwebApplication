const ldapjs = require('ldapjs');
const Promise = require('bluebird');

const ldapOptions = {
    url: `ldap://172.17.0.2`,
    connectTimeout: 30000,
    reconnect: true
}

const pwdUser = "cn=admin,dc=example,dc=org";
const pwdUserPassword = "admin";

let addUser = (userIdNum,gn ,sn ,display,password) => {
    return new Promise((resolve,reject) =>{
        const ldapClient = ldapjs.createClient(ldapOptions);
        ldapClient.bind(
            pwdUser,pwdUserPassword,
            (err) =>{
                if (err){
                    return reject(err);
                }
                let newUser = {
                    uid : gn+sn,
                    cn : gn+sn,
                    givenName : gn,
                    sn : sn,
                    gidNumber : 501,
                    uidNumber : userIdNum,
                    userPassword : password,
                    homeDirectory : "/home/users/"+display,
                    objectClass: ["person","posixAccount","inetOrgPerson"],
                }
                ldapClient.add(
                    'cn='+gn+sn+','+'ou=users,dc=example,dc=org',
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

// addUser(1002,"Lee","junseo","ljunseo","1234").then( ()=>{
//     console.log("success!");
// } , (err) =>{
//     console.log("error!" + err);
// })
