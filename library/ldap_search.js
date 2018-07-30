const ldapjs = require('ldapjs');
const config = require('../config/config');
const createProperties = require('../library/ldap_create_properties')
const fs = require('fs');

const ldapOptions = {
    url: config.server,
    connectTimeout: 30000,
    reconnect: true
}

let getEntryData = (baseDn,options) =>{
    return new Promise( (resolve,reject) =>{
        const ldapClient = ldapjs.createClient(ldapOptions);
        ldapClient.bind(
            config.pwdUser,
            config.pwdUserPassword,
            (err) => {
                if (err) return reject(err);
                ldapClient.search(baseDn,options,(err,res)=>{
                    if(err) return reject(err);
                    let entries = [];
                    res.on('searchEntry',(entry)=>{
                        let r = entry.object;
                        if(r !== undefined){
                            createProperties.createDetailObjectClass(r);
                            createProperties.createTreeLevel(r);
                            createProperties.createParents(r);
                            createProperties.createRoutePath(r);
                            entries.push(r);
                        }
                    });
                    res.on('error',(err)=>{
                        reject(err);
                    });
                    res.on('end',()=>{
                        let results = {
                            entries : entries, // 엔트리들의 객체
                            filterOption : options.filter, // 검색에 사용된 필터
                            entryLength : entries.length // 엔트리의 개수
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
    getEntryData
};
