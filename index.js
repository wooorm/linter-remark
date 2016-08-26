/**
 * @author Titus Wormer
 * @copyright 2016 Titus Wormer
 * @license MIT
 * @module linter-remark
 * @fileoverview Check markdown with remark.
 */

'use strict';

/* eslint-env node */

/* Dependencies. */
var engine = require('unified-engine-atom');

/* Expose. */
module.exports = {
  activate: activate,
  provideLinter: linter
};

/**
 * Run package activation tasks.
 */
function activate() {
  require('atom-package-deps').install('linter-remark');
}

/**
 * `linter-remark`.
 *
 * @return {LinterConfiguration}
 */
function linter() {
  return {
    grammarScopes: [
      'source.gfm',
      'source.pfm',
      'text.md'
    ],
    name: 'remark',
    scope: 'file',
    lintOnFly: true,
    lint: engine({
      processor: require('remark'),
      pluginPrefix: 'remark',
      presetPrefix: 'remark-preset',
      packageField: 'remarkConfig',
      rcName: '.remarkrc',
      ignoreName: '.remarkignore'
    })
  };
}
