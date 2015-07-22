'use strict';

var co = require('co'),
  qhttp = require('q-io/http');

module.exports = function (logger, accessToken) {

  var req = {
    url: 'https://api.linkedin.com/v1/people/~:(id,picture-url,email-address,first-name,last-name,public-profile-url)?format=json',
    headers: {
      authorization: 'Bearer ' + accessToken
    }
  };

  return co(function *() {

    try {
      return yield qhttp.request(req)
        .then(function (res) {
          return res.body.read();
        })
        .then(function (data) {
          return resolveGetProfileResponse(data.toString());
        });
    }
    catch (e) {
      logger(e);
      return Promise.reject('Failed to get LinkedIn profile.');
    }

  });

};

function resolveGetProfileResponse(res) {
  try {

    var getProfileResponse = JSON.parse(res);

    if (getProfileResponse.emailAddress) {
      return Promise.resolve(getProfileResponse);
    }
    else {
      return Promise.reject(getProfileResponse);
    }

  }
  catch (e) {
    return Promise.reject(e.stack);
  }
}
