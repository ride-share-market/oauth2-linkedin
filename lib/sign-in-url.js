'use strict';

var assert = require('assert'),
  uuid = require('uuid');

module.exports = function (config) {

  assert.equal(typeof config, 'object', 'required argument config must be an object');

  // default values
  config.url = config.url || 'https://www.linkedin.com/uas/oauth2/authorization';
  config.scope = config.scope || 'r_basicprofile%20r_emailaddress';

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
