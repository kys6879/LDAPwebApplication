const ldapjs = require('ldapjs');
const fs = require('fs');

const ldapOptions = {
    url: `ldap://172.17.0.2`,
    connectTimeout: 30000,
    reconnect: true
}

const pwdUser = "cn=admin,dc=example,dc=org";
const pwdUserPassword = "admin";
const adSuffix = "dc=example,dc=org"; // test.com

let createDetailObjectClass = (r) =>{
    for(let i=0; i<r.objectClass.length; i++){
        switch(r.objectClass[i]){
            case "organizationalUnit":
                r.detailObjectClass = "organizationalUnit";
                break;
            case "person":
                r.detailObjectClass = "person";
                break;
            case "posixGroup":
                r.detailObjectClass = "posixGroup";
                break;
            case "organization":
                r.detailObjectClass = "organization";
                break;
            case "organizationalRole":
                r.detailObjectClass = "organizationalRole";
                break;
            
        }                       
    }
}

let getAllRecords = (filterOption) =>{
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
                        "ObjectClass",
                        "createTimestamp",
                        "modifyTimestamp",
                        "pwdPolicySubentry"
                    ],
                    scope: "sub",
                    filter: filterOption
                };
                ldapClient.search(adSuffix,options,(err,res)=>{
                    if(err) return reject(err);
                    let entries = [];
                    res.on('searchEntry',(entry)=>{
                        let r = entry.object;
                        if(r !== undefined){
                            console.log("푸시전 : "+r.objectClass);
                            createDetailObjectClass(r);
                            entries.push(r);
                        }
                    });
                    res.on('error',(err)=>{
                        reject(err);
                    });
                    res.on('end',()=>{
                        let results = {
                            entries : entries,
                            filterOption : filterOption,
                            entryLength : entries.length
                        }
                        console.log(results.entries);
                        resolve(results);
                    });
                });
            }
        );
    });
}

module.exports = {
    getAllRecords
};
