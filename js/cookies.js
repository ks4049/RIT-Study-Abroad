"use strict";

// cookies.js
// You can use this code for your projects!
// Derived from the Bill Dortch code at http://www.hidaho.com/cookies/cookie.txt
var cookies = function () {
  var today = new Date(),
      // expires in a year
  expiry = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000),
      getCookieVal = function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);

    if (endstr === -1) {
      endstr = document.cookie.length;
    }

    return unescape(document.cookie.substring(offset, endstr));
  };

  return {
    getCookie: function getCookie(name) {
      var arg = name + "=",
          alen = arg.length,
          clen = document.cookie.length,
          i = 0;

      while (i < clen) {
        var j = i + alen;

        if (document.cookie.substring(i, j) === arg) {
          return getCookieVal(j);
        }

        i = document.cookie.indexOf(" ", i) + 1;

        if (i === 0) {
          break;
        }
      }

      return null;
    },
    setCookie: function setCookie(name, value, expires, path, domain, secure) {
      document.cookie = name + "=" + escape(value) + (expires ? "; expires=" + expires.toGMTString() : "") + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "");
    },
    deleteCookie: function deleteCookie(name, path, domain) {
      document.cookie = name + "=" + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
  };
}();