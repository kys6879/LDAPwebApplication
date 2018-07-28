const express = require('express');
const router = express.Router();
var  fs  = require ( 'file-system' ); 

router.get('/export/web', function(request, response, next) {
  response.render('option/export');
});

router.post('/export', function(req, response, next) {
  let alldata = req.body.entries;
  let kind = req.body.kind;

  console.log("body 값 : " + alldata);
  console.log("kind 값 : " + kind);
      fs.writeFile(`./data/${kind}.json`, alldata, encoding="utf-8", function(err){
        if(err){
            response.send("Failed" + err);
        }
    });
    response.send({
      result : true
    });
  }); 

module.exports = router;
