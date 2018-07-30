const ldapjs = require('ldapjs');
const Promise = require('bluebird');
const config = require('../config/config')

const ldapOptions = {
    url: config.server,
    connectTimeout: 30000,
    reconnect: true
};

let addEntry = (dn,entry) => {
    return new Promise((resolve,reject) =>{
        const ldapClient = ldapjs.createClient(ldapOptions);
        ldapClient.bind(
            config.pwdUser,config.pwdUserPassword,
            (err) =>{
                if (err){
                    return reject(err);
                }
                ldapClient.add(
                    dn,
                    entry,
                    (err,Response) => {
                        if (err){
                            return reject(err)
                        }
                        return resolve(Response);
                    });
            });
    });
}

module.exports = {
    addEntry
};
