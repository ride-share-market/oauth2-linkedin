'use strict';

var should = require('chai').should();

var signInUrl = require('./sign-in-url');

var config = {
  clientId: 'abc123def456',
  redirectUrl: {
    protocol: 'http://',
    host: 'mysite.com',
    uri: '/auth/linkedin/callback'
  }
};

describe('Linkedin', function () {

  describe('Oauth2', function () {

    describe('URL', function () {

      it('should return a linkedin oauth signin URL', function () {
        should.exist(signInUrl);

        var oauthUrlState = signInUrl(config);

        oauthUrlState.signInUrl.should.match(/https:\/\/www\.linkedin\.com\/uas\/oauth2\/authorization\?response_type=code&client_id=.*&redirect_uri=.*&scope=.*&state=.*/);

        oauthUrlState.state.should.be.a('string');

      });

    });

  });

});
