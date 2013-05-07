"use strict";

var domain = require('domain').create()
, ntwitter = require('ntwitter')
, redis = require('redis')
, EventEmitter2 = require('eventemitter2').EventEmitter2

, errManager = require('../errManager')

//, tweet = Object.create(ntwitter(twitterConfig))
, tweetEvt
;

function fetchTweets(){
  var params = {locations: '-180.0,-90.0,180.0,90.0'}
  , twitterConfig = require('../etc/twitterConfig')
  , tweetClient = Object.create(ntwitter(twitterConfig))
  , evt 
  ;
  evt = new EventEmitter2({
    wildcard: true
  , delimiter: '::'
  })

  tweetClient.verifyCredentials(function(err){
    if (err) throw err;
    tweetClient.stream('statuses/filter', params, function(stream){
      stream.on('error', function(err){
        if (err) throw err;
      });
      stream.on('data', function(chunk){
        evt.emit('data', chunk)
      });

    })
  })
  
  return evt
}

//console.log(twitterConfig)

domain.on('error', errManager)

domain.run(function(){
  var tweetEvt = fetchTweets()
  , redisClient = redis.createClient()
  ;
  redisClient.on('ready', function(){
    var counter = 0;
    tweetEvt.on('data', function(tweet){
      tweet.created_at = new Date(tweet.created_at)
  
      redisClient.lpush('L:twitterDump', JSON.stringify(tweet))
    })
  });
})
  
