'use strict';
//angular.module('clorideApp')
window.APP
  .service('alertService', function(){
    this.alerts = this.alerts || [];

    this.add = function(type, msg){
      this.alerts.push({type: type, msg: msg});
    };

    this.closeAlert = function(index){
      this.alerts.splice(index, 1);
    };

  });

