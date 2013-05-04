"use strict";

//angular.module('clorideApp')
window.APP
  .filter('getStat', function(){
    return function(input){
      //console.log(angular.element($('country-stat-'+ input)))
      return input;
    };
  });
