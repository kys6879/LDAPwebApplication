const express = require('express');
const router = express.Router();
const  fs  = require ( 'file-system' ); 

router.get('/export/web',(request, response, next) => {
  response.render('option/export');
});

router.post('/export',(req, response, next) => {
  let alldata = req.body.entries;
  let kind = req.body.kind;

  console.log("body 값 : " + alldata);
  console.log("kind 값 : " + kind);
      fs.writeFile(`./data/${kind}.json`, alldata, encoding="utf-8",(err) => {
        if(err){
            response.send("Failed" + err);
        }
    });
    response.send({
      result : true
    });
}); 



module.exports = router;
