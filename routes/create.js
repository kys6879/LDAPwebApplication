const express = require('express');
const config = require('../config/config');
const router = express.Router();

// 엔트리 생성폼
router.get('/', function(request, response, next) {
    response.render("create",{
        dn : request.query.dn
    });
});

module.exports = router;
