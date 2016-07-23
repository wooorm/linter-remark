/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module linter-remark
 * @fileoverview Test suite for `linter-remark`.
 */

'use strict';

/* global atom, waitsForPromise */
/* eslint-env jasmine */

/* Dependencies. */
var path = require('path');
var lint = require('..');

var join = path.join;

/* Tests. */
describe('linter-remark', function () {
  it('should work', function () {
    atom.workspace.destroyActivePaneItem();

    waitsForPromise(function () {
      return Promise.resolve()
        .then(function () {
          return atom.packages.activatePackage(
            join(path.resolve(__dirname, '..'))
          );
        })
        .then(function () {
          return atom.packages.activatePackage('language-gfm');
        })
        .then(function () {
          return atom.workspace.open(
            join(path.resolve(__dirname, '..'), 'readme.md')
          );
        })
        .then(function (editor) {
          return lint.provideLinter().lint(editor);
        })
        .then(function (messages) {
          expect(messages.length).toBe(0);
        })
        .then(function () {
          return atom.workspace.open(
            join(__dirname, 'fixtures', 'invalid.md')
          );
        })
        .then(function (editor) {
          return lint.provideLinter().lint(editor);
        })
        .then(function (messages) {
          expect(
            messages.map(flatten).join('\n')
          ).toBe([
            '<span class="badge badge-flexible">remark-lint:' +
              'no-consecutive-blank-lines</span> Remove 1 line ' +
              'before node',
            'Link to unknown heading: <code>heading</code>'
          ].join('\n'));
        })
        .then(function () {
          expect(true).toBe(true);
        });
    });
  });
});

function flatten(message) {
  return message.html || message.text;
}
