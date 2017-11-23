/* globals buildWebpackageId,createNewArtifact, splitWebpackageId */
'use strict';
describe('webpackageUtils', function () {
  describe('#buildWebpackageId', function () {
    it('paramater is manifest object (with groupId)', function () {
      var manifest = {
        groupId: 'com.incowia',
        name: 'my-package',
        version: '1.2.3'
      };
      var erg = buildWebpackageId(manifest);
      erg.should.be.equals('com.incowia.my-package@1.2.3');
    });
    it('paramater is manifest object (with groupId === null)', function () {
      var manifest = {
        groupId: null,
        name: 'my-package',
        version: '1.2.3'
      };
      var erg = buildWebpackageId(manifest);
      erg.should.be.equals('my-package@1.2.3');
    });
    it('paramater is manifest object (without groupId)', function () {
      var manifest = {
        name: 'my-package',
        version: '1.2.3'
      };
      var erg = buildWebpackageId(manifest);
      erg.should.be.equals('my-package@1.2.3');
    });
  });
  describe('#createNewArtifact', function () {
    it('property without arguments', function () {
      var artifact = createNewArtifact();
      artifact.should.have.property('artifactId', null);
      artifact.should.have.property('artifactType', 'compoundComponent');
      artifact.should.have.property('description', null);
      artifact.should.have.property('runnables');
      artifact.runnables.should.be.eql([]);
      artifact.should.have.property('resources');
      artifact.resources.should.be.eql([]);
      artifact.should.have.property('dependencies');
      artifact.dependencies.should.be.eql([]);
      artifact.should.have.property('slots');
      artifact.slots.should.be.eql([]);
      artifact.should.have.property('members');
      artifact.members.should.be.eql([]);
      artifact.should.have.property('connections');
      artifact.connections.should.be.eql([]);
      artifact.should.have.property('inits');
      artifact.inits.should.be.eql([]);
    });
    it('property without artifactId', function () {
      var artifact = createNewArtifact({});
      artifact.should.have.property('artifactId', null);
      artifact.should.have.property('artifactType', 'compoundComponent');
      artifact.should.have.property('description', null);
      artifact.should.have.property('runnables');
      artifact.runnables.should.be.eql([]);
      artifact.should.have.property('resources');
      artifact.resources.should.be.eql([]);
      artifact.should.have.property('dependencies');
      artifact.dependencies.should.be.eql([]);
      artifact.should.have.property('slots');
      artifact.slots.should.be.eql([]);
      artifact.should.have.property('members');
      artifact.members.should.be.eql([]);
      artifact.should.have.property('connections');
      artifact.connections.should.be.eql([]);
      artifact.should.have.property('inits');
      artifact.inits.should.be.eql([]);
    });
    it('property with artifactId', function () {
      var artifact = createNewArtifact({ artifactId: 'my-artifact' });
      artifact.should.have.property('artifactId', 'my-artifact');
      artifact.should.have.property('artifactType', 'compoundComponent');
      artifact.should.have.property('description', null);
      artifact.should.have.property('runnables');
      artifact.runnables.should.be.eql([]);
      artifact.should.have.property('resources');
      artifact.resources.should.be.eql([]);
      artifact.should.have.property('dependencies');
      artifact.dependencies.should.be.eql([]);
      artifact.should.have.property('slots');
      artifact.slots.should.be.eql([]);
      artifact.should.have.property('members');
      artifact.members.should.be.eql([]);
      artifact.should.have.property('connections');
      artifact.connections.should.be.eql([]);
      artifact.should.have.property('inits');
      artifact.inits.should.be.eql([]);
    });
    it('property with all properties', function () {
      var init = {
        artifactId: 'my-artifact',
        artifactType: 'compoundComponentX',
        description: 'my description',
        runnables: [ {
          name: 'name',
          path: './index.html',
          description: 'Bla'
        } ],
        resources: [ 'my-resource.js' ],
        dependencies: [ {
          artifactId: 'dep-artifact'
        } ],
        slots: [ {
          slotId: 'myslot'
        } ],
        members: [ {
          memberId: 'first',
          artifactId: 'dep-artifact'
        } ],
        connections: [ {
          connectionId: 'con',
          source: {
            memberIdRef: 'first',
            slot: 'one'
          },
          destination: {
            slot: 'myslot'
          }
        } ],
        inits: [ {
          slot: 'myslot',
          value: 'test'
        } ]
      };
      var artifact = createNewArtifact(init);
      artifact.should.have.property('artifactId', init.artifactId);
      artifact.should.have.property('artifactType', init.artifactType);
      artifact.should.have.property('description', init.description);
      artifact.should.have.property('runnables');
      artifact.runnables.should.be.eql(init.runnables);
      artifact.should.have.property('resources');
      artifact.resources.should.be.eql(init.resources);
      artifact.should.have.property('dependencies');
      artifact.dependencies.should.be.eql(init.dependencies);
      artifact.should.have.property('slots');
      artifact.slots.should.be.eql(init.slots);
      artifact.should.have.property('members');
      artifact.members.should.be.eql(init.members);
      artifact.should.have.property('connections');
      artifact.connections.should.be.eql(init.connections);
      artifact.should.have.property('inits');
      artifact.inits.should.be.eql(init.inits);
    });
  });
  describe('#splitWebpackageId', function () {
    it('webpackageId with groupId', function () {
      var groupId = 'com.incowia';
      var name = 'my-webpackage';
      var version = '1.2.3';
      var erg = splitWebpackageId(groupId + '.' + name + '@' + version);
      erg.should.have.property('groupId', groupId);
      erg.should.have.property('name', name);
      erg.should.have.property('version', version);
    });
    it('webpackageId without groupId', function () {
      var name = 'my-webpackage';
      var version = '1.2.3';
      var erg = splitWebpackageId(name + '@' + version);
      erg.should.have.property('groupId', null);
      erg.should.have.property('name', name);
      erg.should.have.property('version', version);
    });
    it('webpackageId without version', function () {
      var name = 'my-webpackage';

      var erg = splitWebpackageId(name);
      erg.should.have.property('groupId', null);
      erg.should.have.property('name', name);
      erg.should.have.property('version', undefined);
    });
  });
});
