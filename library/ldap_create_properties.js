const config = require('../config/config');
let createDetailObjectClass = (r) =>{
    for(let i=0; i<r.objectClass.length; i++){
        switch(r.objectClass[i]){
            case "organizationalUnit":
                r.detailObjectClass = "organizationalUnit";
                break;
            case "inetOrgPerson":
                r.detailObjectClass = "inetOrgPerson";
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

let createTreeLevel = (r) =>{
    let beforeDn = r.dn; 
    let treeLevel = beforeDn.match(/,/g);

    r.treeLevel = treeLevel.length-2;
}

let createParents = (r) =>{
    let beforeDn = r.dn;
    if(beforeDn == config.adSuffix){
        r.parentsDn = "king";
        return ;
    } 
    let signIndex = beforeDn.indexOf(",");

    let backDn = beforeDn.substring(signIndex+1,beforeDn.length);

    r.parentsDn = backDn;
}
let createRoutePath = (r) =>{ // kimyounngseo
    for(let i=0; i<r.objectClass.length; i++){ 
        switch(r.objectClass[i]){
            case "organizationalUnit":
                r.routePath = `/ou/${r.ou}/web`;
                break;
            case "inetOrgPerson":
                r.routePath = `/user/${r.cn}/web`;
                break;
            case "posixGroup":
                r.routePath = `/group/${r.cn}/web`;
                break;
            case "organization":
                r.routePath = `/org/${r.dc}/web`;
                break;
            case "organizationalRole":
                r.routePath = `/admin/${r.cn}/web`;
                break;
        }
    }    
}

module.exports = {
    createTreeLevel,
    createDetailObjectClass,
    createParents,
    createRoutePath
}
