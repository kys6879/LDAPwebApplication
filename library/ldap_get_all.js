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

let getAllRecords = () =>{
    return new Promise( (resolve,reject) =>{
        const ldapClient = ldapjs.createClient(ldapOptions);
        ldapClient.bind(
            pwdUser,
            pwdUserPassword,
            (err) => {
                if (err) return reject(err);
                let options = {
                    attributes: [
                        "cn",
                        "createTimestamp",
                        "modifyTimestamp",
                        "pwdPolicySubentry"
                    ],
                    scope: "sub",
                    filter: "(objectClass=person)"  
                };
                ldapClient.search(adSuffix,options,(err,res)=>{
                    if(err) return reject(err);
                    let entries = [];
                    res.on('searchEntry',(entry)=>{
                        var r = entry.object.cn;
                        console.log(""+r);
                        entries.push(r);
                    });
                    res.on('error',(err)=>{
                        reject(err);
                    });
                    res.on('end',()=>{
                        resolve(entries);
                    });
                });
            }
        );
    });
}

module.exports = {
    getAllRecords
};
