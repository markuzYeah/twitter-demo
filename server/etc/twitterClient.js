//
// This code is compatible with ES6, aka Harmony
//
// TODO: fix the pyramid of hell. Use some promises!!
//
;(function(undefined){
  "use strict";
  //
  var twitter = require('ntwitter')
  , _ = require('./mixins')
  , print = _.e.print
  , put = _.e.put
  , exit = _.e.exit
  , kill = _.e.kill
  , randId = _.e.randId
  , toEpoch = _.e.toEpoch
  , originalDate = new Date()
  ;


  function parseTweet(chunk){
    return chunk
  }

  module.exports = function(conf, cb){
    //
    // tweetter object.
    var tweet = Object.create(twitter(conf))
      // this location implies the whole world :)
    , params = {locations: '-180.0,-90.0,180,90'}
    , counter = 0
    , cb = cb || function(){print(arguments)}
    ;
    if (tweet.fetch) throw new Error('Error while extending ntwitter obj')
    //
    tweet.fetch = (function(){
      var that = this
        , sec = 0.1
        , data = {
            country: {}
          , city: {}
          , tweets: {}
          , flow: []
          , time: new Date()
        }
      ;
      //
      this.verifyCredentials(function(err){
        if (err) cb(err)
        //
        that.stream('statuses/filter', params, function(stream){
          stream.on('error', function(err){
            if (err) cb(err)
          });
          //
          stream.on('data', function(chunk){
            chunk = parseTweet(chunk)
            var cc
              , d
              , dd
              , id = randId(10)
            ;
            chunk.place = chunk.place || {}
            d = chunk.place
            var country = d.country || '?'
              , country_code = d.country_code || '?' 
              , full_name = d.full_name || '?' 
            //
            if (full_name !== country){
              data.city[full_name] = data.city[full_name] || {}
              dd = data.city[full_name]
              dd.count = dd.count || 0
              dd.count += 1
              dd.flow = dd.flow || []
              dd.flow.unshift(id)
              dd.country = dd.country || {}
              dd.country[country_code] = true
            }
            //
            cc = data.country[country_code] =
              data.country[country_code] || {}
            cc.name = country
            cc.count = cc.count || 0
            cc.count += 1
            cc.flow = cc.flow || []
            cc.flow.unshift(id)
            //
            tweet = {
                text: chunk.text
              , id: chunk.id
              , place: {
                  id: chunk.place.id || '?'
                , country_code: chunk.place.country_code || '?' 
                , country: chunk.place.country || '?' 
                , full_name: chunk.place.full_name || '?' 
              }
              , user: {
                  screen_name: chunk.user.screen_name
                , id: chunk.user.id
                , profile_image_url: chunk.user.profile_image_url
                , description: chunk.user.description
                , utc_offset: chunk.user.utc_offset
                , created_at: chunk.user.created_at
                , time_zone: chunk.user.time_zone
                , lang: chunk.user.lang
              },
            }
            //data.tweets[id] = JSON.stringify(tweet)
            data.tweetsById = data.tweetsById || {}
            data.tweetsById[id] = tweet
            data.tweetsArray = data.tweetsArray || []
            data.tweetsArray.unshift(tweet)
            data.flow.unshift(id)
            //
            // 5 second snapshots
            if ((new Date() - data.time) >= (sec*1000)){
              data.time = new Date()
              cb(null, data)
              data = {
                  country: {}
                , city: {}
                , tweets: {}
                , flow: []
                , time: new Date()
              }
            }
          })
        })
      })
    })
    tweet.fetch()
    put('tweetter client running ')
  }
}).call(this);
