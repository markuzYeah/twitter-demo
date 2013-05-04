//
// TODO: add a logger
//
;(function(undefined){
  "use strict";
  process.on('uncaughtException', function(err){ throw err})
  ;
  var cluster = require('cluster')
  , path = require('path')
  , workers = []
  ;
  workers = [
    'server'
//  , 'twitter'
  ]

  function isMaster(){
    workers.forEach(function(src, k){
      cluster.fork({
        NODE_WORKER_SRC: ['./workers/', src, '.js'].join('')
      })
    })
  }

  if (cluster.isMaster){ return isMaster() }
  require(process.env.NODE_WORKER_SRC)

}).call(this);
