
/**
 * Module dependencies.
 */

"use strict";

var domain = require('domain').create()
, http = require('http')
, path = require('path')
, express = require('express')
, socket = require('socket.io')
, redis = require('redis')
, EventEmitter2 = require('eventemitter2').EventEmitter2

, routes = require('./routes')
, errManager = require('../errManager')

, O = Object
, redisClient 
, serverEvt
;


function createServer(){
  var app = express()
  , exServer = http.createServer(app)
  , io = socket.listen(exServer)
  , evt
  ;
  evt = new EventEmitter2({
    wildcard: true
  , delimiter: '::'
  })

  io.configure(function(){
    io.set('log level', 1)
  })

  // all environments
  app.set('port', process.env.PORT || 3001);
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  //app.use(require('less-middleware')({ src: __dirname + '/public' }));
  
  if ('prod' == app.get('env')) {
    var pub = path.join(__dirname, '../../dist')
    ;
    app.use(express.errorHandler());
    app.use(express.static(pub))
  }
  else {
    // development only
    var pub = path.join(__dirname, '../../.tmp')
    ;
    app.use(express.errorHandler());
    app.use(express.static(pub))
  }
  
  app.get('/', routes.index);
  app.get('/leaf', routes.index);
  app.get('/pin', routes.index);
  

  io.sockets.on('connection', function(socket){
    evt.emit('socketConn', socket)
  })
  
  exServer.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

  return evt
}

domain.on('error', errManager)

domain.run(function(){
  redisClient = redis.createClient()
  serverEvt = createServer()
  
  serverEvt.on('socketConn', function(socket){
    serverEvt.on('tweets', function(tweets){
      console.log('sending...', new Date())
      socket.volatile.emit('send:data', tweets)
    }) 
  })
  
  redisClient.on('ready', function(){
    setInterval(function(){
      redisClient.lrange('L:twitterDump', 0, 20, function(err, data){
        data = data.map(function(tweet){
          return JSON.parse(tweet)
        })
        serverEvt.emit('tweets', data)
      })
      // no need to have more then 1000
      redisClient.ltrim('L:twitterDump', 0, 100)
    }, 500)
  })
  


})



