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
};

let createParents = (r) =>{
    let beforeDn = r.dn;
    if(beforeDn == config.adSuffix){
        r.parentsDn = "king";
        return ;
    } 
    let signIndex = beforeDn.indexOf(",");

    let backDn = beforeDn.substring(signIndex+1,beforeDn.length);

    r.parentsDn = backDn;
};

let createRoutePath = (r) =>{
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
};

let createPosition = (r) =>{
    if(r.gidNumber  == 500){
        r.position = "사원";
    }else if(r.gidNumber == 501){
        r.position = "대리";
    }
    else if(r.gidNumber == 505){
        r.position = "차장";
    }
    else if(r.gidNumber == 508){
        r.position = "이사";
    }
    else if(r.gidNumber == 506){
        r.position = "부장";
    }
    else if(r.gidNumber == 504){
        r.position = "과장";
    }
    else if(r.gidNumber == 507){
        r.position = "사장";
    }
};

module.exports = {
    createDetailObjectClass,
    createParents,
    createRoutePath,
    createPosition
}
