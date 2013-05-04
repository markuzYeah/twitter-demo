'use strict';

#angular.module('clorideApp')
window.APP
  .controller 'CountriesCtrl', ($scope, $location, socketService) ->
    $scope.data = $scope.data || []

    counter = 0
    isFirstRun = true
    allData = []
    curTime = new Date()
    
    pickFirst = (n, array)->
      retArray = []
      while n
        --n
        retArray.push array[n]
      retArray


    socketService.on 'send:data', (data)->
      if $location.$$path == '/leaf'
        waitTime = 5000
      else if $location.$$path == '/pin'
        waitTime = -Math.log(0)
      else
        waitTime = 10
      
      num = 6 * 2
      data.forEach (tweet) ->
        if tweet.place and tweet.place.country_code
          allData.unshift(tweet.place.country_code)

        if $scope.data.length > 1000
          allData.pop()
          #console.log ++counter, tweet.place.country_code
      if isFirstRun
        $scope.data = pickFirst num, allData

        isFirstRun = false

      if new Date() - curTime > waitTime
        $scope.data = pickFirst num, allData 
        curTime = new Date()
      
      $scope.score = []
      [0...num].forEach (i)->
        $scope.score.push (Math.random() * 25)
    
