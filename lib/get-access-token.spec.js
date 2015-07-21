'use strict';

var should = require('chai').should(),
  sinon = require('sinon'),
  qhttp = require('q-io/http'),
  fs = require('fs'),
  path = require('path')

var getAccessTokenError = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../test/fixtures/get-access-token-error.json')).toString()),
  getAccessTokenSuccess = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../test/fixtures/get-access-token-success.json')).toString());

var config = {
  url: 'https://www.linkedin.com/uas/oauth2/authorization',
  clientId: 'abc123def456',
  clientSecret: 'topSecret',
  redirectUrl: {
    protocol: 'http://',
    host: 'mysite.com',
    uri: '/auth/linkedin/callback'
  }
};

var logger = sinon.spy();

var getAccessToken = require('./get-access-token');

describe('Linkedin', function () {

  describe('Oauth2', function () {

    describe('Access Token', function () {

      afterEach(function () {
        logger.reset();
      });

      describe('Fail', function () {

        afterEach(function () {
          if (qhttp.request.restore) {
            qhttp.request.restore();
          }
        });

        it('handle JSON error respones', function (done) {

          var read = function () {
            return Promise.resolve(JSON.stringify(getAccessTokenError));
          };

          sinon.stub(qhttp, 'request', function (req) {
            return Promise.resolve({body: {read: read}});
          });

          return getAccessToken(config, logger, 'AQRj1b-oL7paEHbIaWP6hyod3lKfIsILaD14loKJ-8-iMSB-EPQE0RsV9SrIHp75HZ1xtbMrPARmDAcHNltF49bDz9GHLPZEMsbgXqhDkdI5LT2Jo4w')
            .catch(function (err) {
              err.should.match(/failed linkedin/i);
              sinon.assert.calledOnce(logger);
            })
            .then(done, done);

        });

        it('handle non-JSON respones', function (done) {

          var read = function () {
            return Promise.resolve('<html><body>Not Valid JSON Response</body></html>');
          };

          sinon.stub(qhttp, 'request', function (req) {
            return Promise.resolve({body: {read: read}});
          });

          return getAccessToken(config, logger, 'AQRj1b-oL7paEHbIaWP6hyod3lKfIsILaD14loKJ-8-iMSB-EPQE0RsV9SrIHp75HZ1xtbMrPARmDAcHNltF49bDz9GHLPZEMsbgXqhDkdI5LT2Jo4w')
            .catch(function (err) {
              err.should.match(/failed linkedin/i);
              sinon.assert.calledOnce(logger);
            })
            .then(done, done);

        });

      });

      describe('Success', function () {

        it('success', function (done) {

          var read = function () {
            return Promise.resolve(JSON.stringify(getAccessTokenSuccess));
          };

          sinon.stub(qhttp, 'request', function (req) {
            return Promise.resolve({body: {read: read}});
          });

          return getAccessToken(config, logger, 'AQR5e3W1kZvDu2X5m_JwpPOam9pugz4wbb3y6Hfusr8VvHsPFWHHZWLMdGW5A-ebUMMxSFJAZh8yXIfdbs-xQJDzLblaK7Khd-Ns9bpBg6BCGH0-lmk')
            .then(function (res) {
              res.access_token.should.equal(getAccessTokenSuccess.access_token);
              res.expires_in.should.equal(getAccessTokenSuccess.expires_in);
            })
            .then(done, done);

        });

      })

    });

  });

});
