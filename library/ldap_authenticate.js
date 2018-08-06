const ldapjs = require('ldapjs');
const config = require('../config/config');
const Promise = require('bluebird');

const ldapOptions = {
    url: config.server,
    connectTimeout: 30000,
    reconnect: true
}

let authenticate = (cn,password,ou) => {
    return new Promise((resolve ,reject) => {
        const ldapClient = ldapjs.createClient(ldapOptions);
        ldapClient.bind(
            `cn=${cn},ou=${ou},ou=department,${config.adSuffix}`,
            password,
            (err,res) => {
                if (err) return reject(err);
                ldapClient.unbind();
                return resolve(res);
            });
    });
};

module.exports = {
    authenticate
};
