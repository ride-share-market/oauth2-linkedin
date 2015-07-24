'use strict';

var should = require('chai').should(),
  sinon = require('sinon'),
  qhttp = require('q-io/http'),
  fs = require('fs'),
  path = require('path');

var getAccessTokenError = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../test/fixtures/get-access-token-error.json')).toString()),
  getAccessTokenSuccess = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../test/fixtures/get-access-token-success.json')).toString());

var config = {
  clientId: 'abc123def456',
  clientSecret: 'topSecret',
  redirectUrl: {
    protocol: 'http://',
    host: 'mysite.com',
    uri: '/auth/linkedin/callback'
  }
  },
  logger = sinon.spy(),
  linkedInCode = 'AQRj1b-oL7paEHbIaWP6hyod3lKfIsILaD14loKJ-8-iMSB-EPQE0RsV9SrIHp75HZ1xtbMrPARmDAcHNltF49bDz9GHLPZEMsbgXqhDkdI5LT2Jo4w';

var getAccessToken = require('./get-access-token');

describe('Linkedin', function () {

  describe('Oauth2', function () {

    describe('Access Token', function () {

      afterEach(function () {
        if (qhttp.request.restore) {
          qhttp.request.restore();
        }
        logger.reset();
      });

      describe('Fail', function () {

        it('should handle a JSON error respone', function (done) {

          should.exist(getAccessToken);

          var read = function () {
            return Promise.resolve(JSON.stringify(getAccessTokenError));
          };

          sinon.stub(qhttp, 'request', function () {
            return Promise.resolve({body: {read: read}});
          });

          return getAccessToken(config, logger, linkedInCode)
            .catch(function (err) {
              err.should.match(/failed linkedin/i);
              sinon.assert.calledOnce(logger);
            })
            .then(done, done);

        });

        it('should handle a non-JSON respone', function (done) {

          var read = function () {
            return Promise.resolve('<html><body>Not Valid JSON Response</body></html>');
          };

          sinon.stub(qhttp, 'request', function () {
            return Promise.resolve({body: {read: read}});
          });

          return getAccessToken(config, logger, linkedInCode)
            .catch(function (err) {
              err.should.match(/failed linkedin/i);
              sinon.assert.calledOnce(logger);
            })
            .then(done, done);

        });

      });

      describe('Success', function () {

        it('should return an access token in JSON format', function (done) {

          var read = function () {
            return Promise.resolve(JSON.stringify(getAccessTokenSuccess));
          };

          sinon.stub(qhttp, 'request', function () {
            return Promise.resolve({body: {read: read}});
          });

          return getAccessToken(config, logger, linkedInCode)
            .then(function (res) {
              res.access_token.should.equal(getAccessTokenSuccess.access_token);
              res.expires_in.should.equal(getAccessTokenSuccess.expires_in);
            })
            .then(done, done);

        });

      });

    });

  });

});
