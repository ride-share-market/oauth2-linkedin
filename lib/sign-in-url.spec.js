'use strict';

var should = require('chai').should();

var signInUrl = require('./sign-in-url');

var config = {
  url: 'https://www.linkedin.com/uas/oauth2/authorization',
  clientId: 'abc123def456',
  redirectUrl: {
    protocol: 'http://',
    host: 'mysite.com',
    uri: '/auth/linkedin/callback'
  },
  scope: 'r_basicprofile%20r_emailaddress'
};

describe('Linkedin', function () {

  describe('Oauth2', function () {

    describe('URL', function () {

      it('should return a linkedin oauth signin URL', function () {
        should.exist(signInUrl);
        signInUrl(config).should.match(/https:\/\/www\.linkedin\.com\/uas\/oauth2\/authorization\?response_type=code&client_id=.*&redirect_uri=.*&scope=.*&state=.*/);
      });

    });

  });

});
