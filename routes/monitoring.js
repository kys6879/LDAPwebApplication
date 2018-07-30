const express = require('express');
const router = express.Router();
const  fs  = require ( 'file-system' ); 

router.get('/',(request,response,next)=>{
    fs.writeFile('./routes/demo.txt', "Hello world!", encoding="utf-8",(err)=>{
        if(err){
            response.send("Failed" + err);
        }
    });
    response.send("Success");
  }); 

module.exports = router;
