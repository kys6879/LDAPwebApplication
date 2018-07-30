const express = require('express');
const config = require('../config/config');
const router = express.Router();

// 엔트리 생성폼
router.get('/',(request, response, next) => {
    let dn = request.query.dn; 
    response.render("create/create",{
        dn : dn
    });
});

module.exports = router;
