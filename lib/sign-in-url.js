'use strict';

var uuid = require('uuid');

module.exports = function (config) {

  var redirectUrl = [
    config.redirectUrl.protocol,
    config.redirectUrl.host,
    config.redirectUrl.uri
  ].join('');

  return config.url +
    '?response_type=code' +
    '&client_id=' + config.clientId +
    '&redirect_uri=' + redirectUrl +
    '&scope=' + config.scope +
    '&state=' + uuid();

};
