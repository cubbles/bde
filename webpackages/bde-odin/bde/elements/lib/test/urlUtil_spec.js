/* globals splitUrl,testStoreConnection,buildParamUrl */
'use strict';

describe('urlUtil', function () {
  describe('#splitUrl', function () {
    it('url=https://cubbles.world/sandbox/my-webpackage@1.2.3/my-artifact', function () {
      var url = 'https://cubbles.world/sandbox/my-webpackage@1.2.3/my-artifact';
      var erg = splitUrl(url);
      erg.should.have.property('baseUrl', 'https://cubbles.world');
      erg.should.have.property('store', 'sandbox');
      erg.should.have.property('webpackageId', 'my-webpackage@1.2.3');
      erg.should.have.property('artifactId', 'my-artifact');
    });

    it('url=https://cubbles.world/sandbox/com.incowia.my-webpackage@1.2.3/my-artifact', function () {
      var url = 'https://cubbles.world/sandbox/com.incowia.my-webpackage@1.2.3/my-artifact';
      var erg = splitUrl(url);
      erg.should.have.property('baseUrl', 'https://cubbles.world');
      erg.should.have.property('store', 'sandbox');
      erg.should.have.property('webpackageId', 'com.incowia.my-webpackage@1.2.3');
      erg.should.have.property('artifactId', 'my-artifact');
    });
    it('url=https://cubbles.world/sandbox/', function () {
      var url = 'https://cubbles.world/sandbox/';
      var erg = splitUrl(url);
      erg.should.have.property('baseUrl', 'https://cubbles.world');
      erg.should.have.property('store', 'sandbox');
      erg.should.not.have.property('webpackageId');
      erg.should.not.have.property('artifactId');
    });
    it('url=https://cubbles.world/sandbox', function () {
      var url = 'https://cubbles.world/sandbox';
      var erg = splitUrl(url);
      erg.should.have.property('baseUrl', 'https://cubbles.world');
      erg.should.have.property('store', 'sandbox');
      erg.should.not.have.property('webpackageId');
      erg.should.not.have.property('artifactId');
    });
    it('url=https://cubbles.world/sandbox/com.incowia.my-webpackage@1.2.3/', function () {
      var url = 'https://cubbles.world/sandbox/com.incowia.my-webpackage@1.2.3/';
      var erg = splitUrl(url);
      erg.should.have.property('baseUrl', 'https://cubbles.world');
      erg.should.have.property('store', 'sandbox');
      erg.should.have.property('webpackageId', 'com.incowia.my-webpackage@1.2.3');
      erg.should.not.have.property('artifactId');
    });
    it('url=https://cubbles.world/sandbox/com.incowia.my-webpackage@1.2.3', function () {
      var url = 'https://cubbles.world/sandbox/com.incowia.my-webpackage@1.2.3';
      var erg = splitUrl(url);
      expect(erg).to.be.undefined;
    });
    it('url=https://cubbles.world/sandbox/my-artifact', function () {
      var url = 'https://cubbles.world/sandbox/com.incowia.my-webpackage@1.2.3';
      var erg = splitUrl(url);
      expect(erg).to.be.undefined;
    });
  });
  describe('#testStoreConnection', function () {
    var server;
    beforeEach(function () {
      server = sinon.fakeServer.create();
    });
    afterEach(function () {
      server.restore();
    });

    describe('success', function () {
      beforeEach(function () {
        var okResponse = [
          200,
          { 'Content-type': 'application/json' },
          '{"hello":"world"}'
        ];

        server.respondWith('GET', 'http://test', okResponse);
      });

      it('callback paramater success should be true', function (done) {
        function callback (success) {
          expect(success).to.equal(true);
          done();
        }

        var url = 'http://test';

        testStoreConnection(url, callback);

        server.respond();
      });
    });
    describe('file not found', function () {
      beforeEach(function () {
        var oknotFoundResponse = [
          404,
          { 'Content-type': 'application/json' },
          'File not found'
        ];

        server.respondWith('GET', 'http://test', oknotFoundResponse);
      });

      it('callback paramater success should be false ', function (done) {
        function callback (success) {
          expect(success).to.equal(false);
          done();
        }

        var url = 'http://test';

        testStoreConnection(url, callback);

        server.respond();
      });
    });
  });
  describe('#buildParamUrl', function () {
    it('should be get an url with webpackageId and artifact in path', function () {
      var baseUrl = 'http://cubbles.world';
      var store = 'sandbox';
      var webpackageId = 'my-package@1.2.3';
      var artifactId = 'my-artifact';
      var erg = buildParamUrl(baseUrl, store, webpackageId, artifactId);
      erg.should.be.equal(baseUrl + '/' + store + '/' + webpackageId + '/' + artifactId);
    });
    it('should be get an url with webpackageId in path', function () {
      var baseUrl = 'http://cubbles.world';
      var store = 'sandbox';
      var webpackageId = 'my-package@1.2.3';
      var artifactId;
      var erg = buildParamUrl(baseUrl, store, webpackageId, artifactId);
      erg.should.be.equal(baseUrl + '/' + store + '/' + webpackageId);
    });
    it('should be get an url with baseUrl and store', function () {
      var baseUrl = 'http://cubbles.world';
      var store = 'sandbox';
      var webpackageId;
      var artifactId;
      var erg = buildParamUrl(baseUrl, store, webpackageId, artifactId);
      erg.should.be.equal(baseUrl + '/' + store);
    });
    it('should be get an url with baseUrl', function () {
      var baseUrl = 'http://cubbles.world';
      var store;
      var webpackageId;
      var artifactId;
      var erg = buildParamUrl(baseUrl, store, webpackageId, artifactId);
      erg.should.be.equal(baseUrl);
    });
  });
});
