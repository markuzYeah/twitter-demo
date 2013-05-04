"use strict";

function manageRedisErr(err){
  var msgArray = err.message.split(' ')
  ;
  if (msgArray[msgArray.length - 1] !== 'ECONNREFUSED'){
    // whta happened ?? so quit the process
    console.log(err.stack)
    return process.exit(1)
  } 

  console.error(err.message)
}

module.exports = function(err){
  var redisRegEx = /^Redis/
  ;
  if (redisRegEx.test(err.message)){ return manageRedisErr(err) }
}


