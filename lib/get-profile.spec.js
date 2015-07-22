'use strict';

var should = require('chai').should(),
  sinon = require('sinon'),
  qhttp = require('q-io/http'),
  fs = require('fs'),
  path = require('path');

var getProfile = require('./get-profile');

var getProfileSuccess = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../test/fixtures/get-profile-success.json')).toString());

var logger = sinon.spy();

describe('Linkedin', function () {

  describe('Oauth2', function () {

    describe('Get Profile', function () {

      afterEach(function () {
        if (qhttp.request.restore) {
          qhttp.request.restore();
        }
        logger.reset();
      });

      describe('Success', function () {

        it('should return a user profile', function (done) {

          should.exist(getProfile);

          var read = function () {
            return Promise.resolve(JSON.stringify(getProfileSuccess));
          };

          sinon.stub(qhttp, 'request', function () {
            return Promise.resolve({body: {read: read}});
          });

          return getProfile(logger, 'AQWWRICivYY-9J36CFeOUh4283Z5FLj-KqJ82VGspUP-8NzZJaoj9jILd4OcLFBjJfe2c4BPLGzIPJJ1yMsWdhnE_MnBKCp9IoJGtE4fUud502Y0FAPGuEHqwrzY_3z5xmvmYYo1vmy9kGi-Blidq8XBarPP2Jg4iHoLcswFfNtP-flG8LU')
            .then(function (res) {
              should.exist(res.emailAddress);
            })
            .then(done, done);

        });

      });

      describe('Fail', function () {

        it('should handle a non valid JSON respone', function (done) {

          var read = function () {
            return Promise.resolve(JSON.stringify({id: 123456}));
          };

          sinon.stub(qhttp, 'request', function () {
            return Promise.resolve({body: {read: read}});
          });

          return getProfile(logger, 'AQWWRICivYY-9J36CFeOUh4283Z5FLj-KqJ82VGspUP-8NzZJaoj9jILd4OcLFBjJfe2c4BPLGzIPJJ1yMsWdhnE_MnBKCp9IoJGtE4fUud502Y0FAPGuEHqwrzY_3z5xmvmYYo1vmy9kGi-Blidq8XBarPP2Jg4iHoLcswFfNtP-flG8LU')
            .catch(function (err) {
              err.should.match(/failed/i);
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

          return getProfile(logger, 'AQWWRICivYY-9J36CFeOUh4283Z5FLj-KqJ82VGspUP-8NzZJaoj9jILd4OcLFBjJfe2c4BPLGzIPJJ1yMsWdhnE_MnBKCp9IoJGtE4fUud502Y0FAPGuEHqwrzY_3z5xmvmYYo1vmy9kGi-Blidq8XBarPP2Jg4iHoLcswFfNtP-flG8LU')
            .catch(function (err) {
              err.should.match(/failed/i);
              sinon.assert.calledOnce(logger);
            })
            .then(done, done);

        });

      });

    });

  });

});
