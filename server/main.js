//
// TODO: add a logger
//
"use strict";
process.on('uncaughtException', function(err){ throw err})
;
var cluster = require('cluster')
, path = require('path')
, workers = []
, node_env
;
workers = [
  'server'
, 'twitter'
//, 'twitter-health'
]


function isMaster(){
  workers.forEach(function(src, k){
    cluster.fork({
      NODE_WORKER_SRC: ['./workers/', src, '.js'].join('')
    , NODE_ENV: process.env.NODE_ENV || 'dev'
    , NODE_MASTER_PID: process.pid
    })
  })
}

if (cluster.isMaster){ return isMaster() }
require(process.env.NODE_WORKER_SRC)

