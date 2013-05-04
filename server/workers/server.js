
/**
 * Module dependencies.
 */

"use strict";

var domain = require('domain')
, http = require('http')
, path = require('path')
, express = require('express')
, socket = require('socket.io')
, redis = require('redis')
, EventEmitter2 = require('eventemitter2').EventEmitter2

, routes = require('./routes')
, manageErr = require('../manageErr')

, thisDomain = domain.create()
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
  app.set('port', process.env.PORT || 3000);
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  //app.use(express.static(path.join(__dirname, '../../dist')));
  app.use(express.static(path.join(__dirname, '../../.tmp')));
  //app.use(require('less-middleware')({ src: __dirname + '/public' }));
  
  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
  
  app.get('/', routes.index);
  app.get('/leaf', routes.index);
  app.get('/pin', routes.index);
  
  /*
  function keepConn(socket){
    twitterClient(twitterConfig, function(err, data){
      if (err) throw err;
      socket.volatile.emit('send:data', data)
    })
  }
  */

  io.sockets.on('connection', function(socket){
    evt.emit('socketConn', socket)
    /*
    try {
      keepConn(socket)
    }
    catch(e){}
  */
  })
  
  
  exServer.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

  return evt
}

thisDomain.on('error', manageErr)

thisDomain.run(function(){
  redisClient = redis.createClient()
  serverEvt = createServer()
  
  serverEvt.on('socketConn', function(socket){
    serverEvt.once('tweets', function(tweets){
      socket.volatile.emit('send:data', tweets)
    }) 
  })
  
  /*
  redisClient.on('error', function(err){
    // the error
    //console.log('HHHH', err.message)
    if (err) throw err;
  })
  */
  
  redisClient.on('ready', function(){
    setInterval(function(){
      redisClient.lrange('L:twitterDump', 0, 20, function(err, data){
        data = data.map(function(tweet){
          return JSON.parse(tweet)
        })
        serverEvt.emit('tweets', data)
      })
      // no need to have more then 1000
      redisClient.ltrim('L:twitterDump', 0, 1000)
    }, 500)
  })
  


})



