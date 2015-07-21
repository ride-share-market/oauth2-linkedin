'use strict';

var co = require('co'),
  qhttp = require('q-io/http');

module.exports = function getOauthAccessToken(config, logger, code) {

  var accessTokenParameters = buildAccessTokenParameters(config, code);

  var req = {
    url: 'https://www.linkedin.com/uas/oauth2/accessToken',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': accessTokenParameters.length
    },
    body: [accessTokenParameters]
  };

  return co(function *() {

    try {
      return yield qhttp.request(req)
        .then(function (res) {
          return res.body.read();
        })
        .then(function (data) {
          return resolveAccessTokenResponse(data.toString());
        });
    }
    catch (e) {
      logger(e);
      return Promise.reject('Failed LinkedIn sign in.');
    }

  });

}

function resolveAccessTokenResponse(res) {
  try {
    var accessTokenResponse = JSON.parse(res);
    if (accessTokenResponse.error) {
      return Promise.reject(accessTokenResponse);
    }
    else {
      return Promise.resolve(accessTokenResponse);
    }
  }
  catch (e) {
    return Promise.reject(e.stack);
  }
}

function buildAccessTokenParameters(config, code) {

  return [
    'grant_type=authorization_code',
    'client_id=' + config.clientId,
    'client_secret=' + config.clientSecret,
    'redirect_uri=' + [config.redirectUrl.protocol, config.redirectUrl.host, config.redirectUrl.uri].join(''),
    'code=' + code
  ].join('&');

}
