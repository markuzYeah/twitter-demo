"use strict";

//angular.module('clorideApp')
window.APP
  .filter('getLinks', function(){
    // source:
    // http://stackoverflow.com/questions/2099892/extracting-1-or-more-hyperlinks-from-paragraph-text-in-javascript-using-regular
    //
    function parseText(text){
      var urlPattern = "(https?|ftp)://(www\\.)?(((([a-zA-Z0-9.-]+\\.){1,}[a-zA-Z]{2,4}|localhost))|((\\d{1,3}\\.){3}(\\d{1,3})))(:(\\d+))?(/([a-zA-Z0-9-._~!$&'()*+,;=:@/]|%[0-9A-F]{2})*)?(\\?([a-zA-Z0-9-._~!$&'()*+,;=:/?@]|%[0-9A-F]{2})*)?(#([a-zA-Z0-9._-]|%[0-9A-F]{2})*)?"
      ;

      return text.match(new RegExp(urlPattern, "g"));
    }

    return function(input){
      var matchUrlArray = parseText(input)
      , newUrlArray
      ;
      if (matchUrlArray) {
        newUrlArray = matchUrlArray.map(function(url){
          var newUrl = [
            '<a target="_blank" href="', url, '">', url, "</a>"
          ].join('')
          ;

          input = input.replace(url, newUrl);
        });

      }

      return input;
    };
  });
