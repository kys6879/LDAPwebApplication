var express = require('express');
var router = express.Router();

var  fs  = require ( 'file-system' ); 

router.get('/',(request,response,next)=>{
    fs.writeFile('./routes/demo.txt', "Hello world!", encoding="utf-8", function(err){
        if(err){
            response.send("Failed" + err);
        }
    });
    response.send("Success");
  }); 



module.exports = router;
