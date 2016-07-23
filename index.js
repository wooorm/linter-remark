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
      rcName: '.remarkrc',
      packageField: 'remarkConfig',
      ignoreName: '.remarkignore'
    })
  };
}

/**
 * Run package activation tasks.
 */
function activate() {
  require('atom-package-deps').install('linter-remark');
}

/*
 * Expose.
 */
module.exports = {
  activate: activate,
  provideLinter: linter
};
