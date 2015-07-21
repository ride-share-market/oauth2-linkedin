'use strict';

var should = require('chai').should();

var linkedinUrl = require('./url');

var config = {
  url: 'https://www.linkedin.com/uas/oauth2/authorization',
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
        should.exist(linkedinUrl);
        linkedinUrl(config).should.match(/https:\/\/www\.linkedin\.com\/uas\/oauth2\/authorization\?response_type=code&client_id=.*&redirect_uri=.*&state=.*/);
      });

    });

  });

});