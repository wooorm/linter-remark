'use strict';

/* global atom */

var path = require('path');
var test = require('tape');
var lint = require('..');

test('linter-remark', function (t) {
  t.plan(2);

  atom.workspace.destroyActivePaneItem();

  Promise.resolve()
    .then(function () {
      return atom.packages.activatePackage(
        path.join(path.resolve(__dirname, '..'))
      );
    })
    .then(function () {
      return atom.packages.activatePackage('language-gfm');
    })
    .then(function () {
      return atom.workspace.open(
        path.join(path.resolve(__dirname, '..'), 'readme.md')
      );
    })
    .then(function (editor) {
      return lint.provideLinter().lint(editor);
    })
    .then(function (messages) {
      t.equal(messages.length, 0, 'should start out without messages');
    })
    .then(function () {
      return atom.workspace.open(path.join(__dirname, 'invalid.md'));
    })
    .then(function (editor) {
      return lint.provideLinter().lint(editor);
    })
    .then(function (messages) {
      t.deepEqual(
        messages.map(function (message) {
          return message.html;
        }),
        [
          '<span class="badge badge-flexible">remark-lint:' +
            'no-consecutive-blank-lines</span> Remove 1 line ' +
            'before node',
          '<span class="badge badge-flexible">remark-validate-' +
            'links</span> Link to unknown heading: <code>heading' +
            '</code>'
        ],
        'should emit messages'
      );
    });
});
