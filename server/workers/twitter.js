"use strict";

var twitterClient = require('../etc/twitterClient')
, twitterConfig = require('../etc/twitterConfig')
, ntwitter = require('ntwitter')
, redis = require('redis')
, domain = require('domain').create()
, EventEmitter2 = require('eventemitter2').EventEmitter2

, tweet = Object.create(ntwitter(twitterConfig))
, redisClient = redis.createClient()
, tweetEvt
;


//console.log(twitterConfig)

// testing if tweet.fetch exists.
if (tweet.fetch){ throw new Error('can\'t extend ntwitter')}

tweet.fetch = function(){
  var _this = this
  , params = {locations: '-180.0,-90.0,180.0,90.0'}
  , evt 
  ;
  evt = new EventEmitter2({
    wildcard: true
  , delimiter: '::'
  })

  this.verifyCredentials(function(err){
    if (err) throw err;
    _this.stream('statuses/filter', params, function(stream){
      stream.on('error', function(err){
        console.log('AA', err)
        if (err) throw err;
      });
      stream.on('data', function(chunk){
        evt.emit('data', chunk)
      });

    })
  })
  
  return evt
}

redisClient.on('error', function(){
  if (err) throw err;
})

tweetEvt = tweet.fetch()
redisClient.on('ready', function(){
  var counter = 0;
  tweetEvt.on('data', function(tweet){
    tweet.created_at = new Date(tweet.created_at)

    redisClient.lpush('L:twitterDump', JSON.stringify(tweet))
    //console.log(tweet, ++counter)
  })
});





/*

function tryConn(){
  setTimeout(function(){
    var e
    try {
      dClient = dnode.connect(5004)
      dClient.on('remote', function(remote){
        remote.log(DATA)
      })
    }
    catch(e){
      return
    }
    evt.emit('connected')
  }, 100)
}

evt = new EventEmitter2({
  wildcard: true
, delimiter: '::'
})


evt.on('connected', function(){
  isConn = true
  console.log('WWW')
})

evt.on('data', function(data){
})

domain.on('error', function(err){
  console.log(err)
  tryConn()
})

domain.run(function(){

  tryConn()
  twitterClient(twitterConfig, function(err, data){
    if (err) throw err;
    if (isConn){ 
    }

    console.log('.', isConn)
  })
})

*/
