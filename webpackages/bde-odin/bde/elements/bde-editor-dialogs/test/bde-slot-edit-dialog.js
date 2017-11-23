/* globals fixture, chai, expect */
// eslint-disable-next-line no-unused-vars
var expect = chai.expect;
// Note that should has to be executed
chai.should();
(function () {
  'use strict';
  describe('<bde-slot-edit-dialog>', function () {
    var slotEditDlg;
    let artifact;
    let slot;
    before(function () {
      slotEditDlg = fixture('bde-slot-edit-dialog-fixture');
    });
    after(function () {
      slotEditDlg = null;
    });
    beforeEach(function () {
      artifact = {
        artifactId: 'test-artifact',
        slots: [],
        inits: []
      };
      slot = {
        slotId: 'test1'
      };
    });
    afterEach(function () {
      artifact = null;
      slot = null;
    });
    describe('for member slot', function () {
      beforeEach(function () {
        let memberIdRef = 'member1';
        slotEditDlg.set('memberId', memberIdRef);
      });

      describe('with empty init', function () {
        describe('without direction property', function () {
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type string', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'string');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type number', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'number');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type boolean', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'boolean');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type object', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'object');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type array', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'array');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show no type ', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', undefined);
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
        });
        describe('with direction property =  ["input"]', function () {
          beforeEach(function () {
            slot.direction = ['input'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type string', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'string');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type number', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'number');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type boolean', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'boolean');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type object', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'object');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type array', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'array');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show no type', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', undefined);
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
        });
        describe('with direction property =  ["input", "output"]', function () {
          beforeEach(function () {
            slot.direction = ['input', 'output'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type string', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'string');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type number', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'number');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type boolean', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'boolean');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type object', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'object');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type array', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'array');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show no type', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', undefined);
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
        });
        describe('with direction property =  ["output"]', function () {
          beforeEach(function () {
            slot.direction = ['output'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should show the type string', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'string');
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should show the type number', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'number');
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should show the type boolean', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'boolean');
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should show the type object', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'object');
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should show the type array', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'array');
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should show the type boolean', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', undefined);
            });
          });
        });
      });
      describe('existing init', function () {
        describe('without direction property', function () {
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 'Bla'
              };
              artifact.inits.push(init);
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type string', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'string');
            });
            it('should have "Bla" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Bla'));
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 13
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type number', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'number');
            });
            it('should have 13 as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(13));
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: true
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type boolean', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'boolean');
            });
            it('should have true as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(true));
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: {
                  'foo': 'bar'
                }
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type object', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'object');
            });
            it('should have {"foo": "bar"} as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify({
                'foo': 'bar'
              }));
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: [
                  'one', 'two'
                ]
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type array', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'array');
            });
            it('should have ["one", "two"] as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify([
                'one', 'two'
              ]));
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 'Hallo'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show no type', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', undefined);
            });
            it('should have "Hallo" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Hallo'));
            });
          });
        });
        describe('with direction property =  ["input"]', function () {
          beforeEach(function () {
            slot.direction = ['input'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 'Bla'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type string', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'string');
            });
            it('should have "Bla" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Bla'));
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 13
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type number', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'number');
            });
            it('should have a 13 as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(13));
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: true
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type boolean', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'boolean');
            });
            it('should have true as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(true));
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: {
                  'foo': 'bar'
                }
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type object', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'object');
            });
            it('should have a {"foo": "bar"} init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value');
              textareaEl.value.should.be.eql(JSON.stringify({'foo': 'bar'}));
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: [
                  'one', 'two'
                ]
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type array', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'array');
            });
            it('should have a ["one", "two"] init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value');
              textareaEl.value.should.be.eql(JSON.stringify(['one', 'two']));
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 'Hallo'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show no type', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', undefined);
            });
            it('should have a "Hallo" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Hallo'));
            });
          });
        });
        describe('with direction property =  ["input", "output"]', function () {
          beforeEach(function () {
            slot.direction = ['input', 'output'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 'Bla'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type string', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'string');
            });
            it('should have "Bla" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Bla'));
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 13
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type number', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'number');
            });
            it('should have a 13 as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(13));
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: true
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type boolean', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'boolean');
            });
            it('should have a true init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(true));
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: {
                  'foo': 'bar'
                }
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type object', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'object');
            });
            it('should have a {"foo": "bar"} init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value');
              textareaEl.value.should.be.eql(JSON.stringify({
                'foo': 'bar'
              }));
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: [
                  'one', 'two'
                ]
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show the type array', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', 'array');
            });
            it('should have a ["one", "two"] init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value');
              textareaEl.value.should.be.eql(JSON.stringify([
                'one', 'two'
              ]));
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 'Hallo'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', false);
            });
            it('should show no type ', function () {
              var inputEl = slotEditDlg.$$('#memberType > paper-input');
              inputEl.should.have.property('value', undefined);
            });
            it('should have "Hallo" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Hallo'));
            });
          });
        });
        describe('with direction property =  ["output"]', function () {
          beforeEach(function () {
            slot.direction = ['output'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 'Bla'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 13
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: true
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: {
                  'foo': 'bar'
                }
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: [
                  'one', 'two'
                ]
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: 'Hallo'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
          });
        });
      });
    });
    describe('for compound slot', function () {
      beforeEach(function () {
        var memberId;
        slotEditDlg.set('memberId', memberId);
        slotEditDlg.set('ownSlot', true);
      });
      describe('with empty init', function () {
        describe('without direction property', function () {
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type string', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('string');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type number', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('number');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type boolean', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('boolean');
            });

            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type object', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('object');
            });

            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type array', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('array');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type any', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('any');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
        });
        describe('with direction property =  ["input"]', function () {
          beforeEach(function () {
            slot.direction = ['input'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type string', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('string');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type number', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('number');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type boolean', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('boolean');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type object', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('object');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type array', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('array');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type any', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('any');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
        });
        describe('with direction property =  ["input", "output"]', function () {
          beforeEach(function () {
            slot.direction = ['input', 'output'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type string', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('string');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type number', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('number');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type boolean', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('boolean');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type object', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('object');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type array', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('array');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type any', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('any');
            });
            it('should have a null init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', null);
            });
          });
        });
        describe('with direction property =  ["output"]', function () {
          beforeEach(function () {
            slot.direction = ['output'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type string', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('string');
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type number', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('number');
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type boolean', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('boolean');
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type object', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('object');
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type array', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('array');
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });

            it('should have selected the type any', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('any');
            });
          });
        });
      });
      describe('existing init', function () {
        describe('without direction property', function () {
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              let init = {
                slot: 'test1',
                value: 'Bla'
              };
              artifact.inits.push(init);
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type string', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('string');
            });
            it('should have "Bla" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Bla'));
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 13
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type number', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('number');
            });
            it('should have 13 as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(13));
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: true
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type boolean', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('boolean');
            });
            it('should have true as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(true));
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: {
                  'foo': 'bar'
                }
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type object', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('object');
            });
            it('should have {"foo": "bar"} as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify({
                'foo': 'bar'
              }));
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: [
                  'one', 'two'
                ]
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type array', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('array');
            });
            it('should have ["one", "two"] as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify([
                'one', 'two'
              ]));
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 'Hallo'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type any', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('any');
            });
            it('should have "Hallo" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Hallo'));
            });
          });
        });
        describe('with direction property =  ["input"]', function () {
          beforeEach(function () {
            slot.direction = ['input'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 'Bla'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type string', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('string');
            });
            it('should have "Bla" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Bla'));
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 13
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type number', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('number');
            });
            it('should have a 13 as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(13));
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: true
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type boolean', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('boolean');
            });
            it('should have true as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(true));
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: {
                  'foo': 'bar'
                }
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type object', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('object');
            });
            it('should have a {"foo": "bar"} init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value');
              textareaEl.value.should.be.eql(JSON.stringify({'foo': 'bar'}));
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: [
                  'one', 'two'
                ]
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type array', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('array');
            });
            it('should have a ["one", "two"] init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value');
              textareaEl.value.should.be.eql(JSON.stringify(['one', 'two']));
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 'Hallo'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type any', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('any');
            });
            it('should have a "Hallo" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Hallo'));
            });
          });
        });
        describe('with direction property =  ["input", "output"]', function () {
          beforeEach(function () {
            slot.direction = ['input', 'output'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 'Bla'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type string', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('string');
            });
            it('should have "Bla" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Bla'));
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 13
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type number', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('number');
            });
            it('should have a 13 as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(13));
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: true
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type boolean', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('boolean');
            });
            it('should have a true init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify(true));
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: {
                  'foo': 'bar'
                }
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type object', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('object');
            });
            it('should have a {"foo": "bar"} init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value');
              textareaEl.value.should.be.eql(JSON.stringify({
                'foo': 'bar'
              }));
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: [
                  'one', 'two'
                ]
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type array', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('array');
            });
            it('should have a ["one", "two"] init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value');
              textareaEl.value.should.be.eql(JSON.stringify([
                'one', 'two'
              ]));
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 'Hallo'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for member type', function () {
              var divEl = slotEditDlg.$$('#memberType');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type any', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('any');
            });
            it('should have "Hallo" as init value', function () {
              var textareaEl = slotEditDlg.$$('#initValue');
              textareaEl.should.have.property('value', JSON.stringify('Hallo'));
            });
          });
        });
        describe('with direction property =  ["output"]', function () {
          beforeEach(function () {
            slot.direction = ['output'];
          });
          describe('with type string', function () {
            beforeEach(function () {
              slot.type = 'string';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 'Bla'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type string', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('string');
            });
          });
          describe('with type number', function () {
            beforeEach(function () {
              slot.type = 'number';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 13
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type number', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('number');
            });
          });
          describe('with type boolean', function () {
            beforeEach(function () {
              slot.type = 'boolean';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                memberIdRef: 'member1',
                value: true
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type boolean', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('boolean');
            });
          });
          describe('with type object', function () {
            beforeEach(function () {
              slot.type = 'object';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: {
                  'foo': 'bar'
                }
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type object', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('object');
            });
          });
          describe('with type array', function () {
            beforeEach(function () {
              slot.type = 'array';
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: [
                  'one', 'two'
                ]
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type array', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('array');
            });
          });
          describe('with no type property', function () {
            beforeEach(function () {
              artifact.slots.push(slot);
              slotEditDlg.set('slot', slot);
              let init = {
                slot: 'test1',
                value: 'Hallo'
              };
              artifact.inits.push(init);
              slotEditDlg.set('artifact', artifact);
              slotEditDlg._handleDialogOpened({
                target: 'dummy',
                currentTarget: 'dummy'
              });
            });
            it('should have a hidden div for the slot part', function () {
              var divEl = slotEditDlg.$$('#slotPart');
              divEl.should.have.property('hidden', false);
            });
            it('should have a not hidden div for an init part', function () {
              var divEl = slotEditDlg.$$('#initPart');
              divEl.should.have.property('hidden', true);
            });
            it('should have selected the type any', function () {
              let listBoxEl = slotEditDlg.$$('#typeSelect');
              listBoxEl.selected.should.be.equals('any');
            });
          });
        });
      });
    });
  });
})();
