
/*
 * GET home page.
 */
"user strict";
var path = require('path') 
, request = require('request')
, fs = require('fs')
;


exports.index = function(req, res){
  ;
  // using this trick to get the livereload functionality
  // not perfect but good enough

  if (process.env.NODE_ENV === 'prod'){
    // 
    // this ,logic here is kinda broke.
    //
    var pub = path.join(__dirname, '../../../dist/index.html')
    ;
    res.send(fs.readFileSync(path.join(__dirname, '../../../dist/index.html'),{encoding: 'utf8'}) )
  }
  if (process.env.NODE_ENV === 'dev'){
    request('http://localhost:9000/', function(err, response, body){
      res.send(body)
    });
  }
 
 
};

