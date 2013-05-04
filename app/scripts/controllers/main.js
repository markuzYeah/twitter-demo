'use strict';

//angular.module('clorideApp')
window.APP
  .controller('MainCtrl', function ($scope, $location, socketService){

    $scope.data = $scope.data || [];

    function pickFirst(n, array){
      var retArray = [];
      while (n){
        --n;
        retArray.push(array[n]);
      }
      return retArray;
    }

    var curTime = new Date()
    , isFirstRun = true
    , allData = []
    ;
    socketService.on('send:data', function(data){
      //console.log(++counterSocket,'AAA', allData, allData.length)
      var waitTime
      ;
      if ($location.$$path === '/leaf'){
        waitTime = 5000
      }
      else if ($location.$$path === '/pin'){
        waitTime = -Math.log(0)
      }
      else{
        waitTime = 10
      }

      data.forEach(function(tweet){
        allData.unshift(tweet);
        if (allData.length > 1000){
          allData.pop();
        }
      });

      if (isFirstRun){
        $scope.data = pickFirst(6 + 1, allData);
        isFirstRun = false;
      }

      if ((new Date() - curTime) > waitTime){
        $scope.data = pickFirst(6 + 1, allData);
        curTime = new Date();
      }
    });

  });


