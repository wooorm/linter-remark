'use strict';

/* global atom */
/* eslint-disable import/no-extraneous-dependencies */

/* Dependencies. */
var CompositeDisposable = require('atom').CompositeDisposable;
var engine = require('unified-engine-atom');

/* Subscriptions. */
var subscriptions = new CompositeDisposable();
var config = {};

/* Expose. */
exports.activate = activate;
exports.deactivate = deactivate;
exports.provideLinter = linter;

/* Activation tasks. */
function activate() {
  var schema = require('./package').configSchema;

  require('atom-package-deps').install('linter-remark');

  Object.keys(schema).forEach(function (key) {
    subscriptions.add(atom.config.observe('linter-remark.' + key, setter));

    function setter(value) {
      config[key] = value;
    }
  });
}

/* Deactivation tasks. */
function deactivate() {
  subscriptions.dispose();
}

/* Linter. */
function linter() {
  return {
    grammarScopes: config.scopes,
    name: 'remark',
    scope: 'file',
    lintsOnChange: true,
    lint: lint
  };
}

/* One run. */
function lint(editor) {
  return engine({
    processor: require('remark'),
    pluginPrefix: 'remark',
    presetPrefix: 'remark-preset',
    packageField: 'remarkConfig',
    rcName: '.remarkrc',
    ignoreName: '.remarkignore',
    detectIgnore: config.detectIgnore,
    detectConfig: config.detectConfig,
    settings: {
      gfm: config.settingGfm,
      yaml: config.settingYaml,
      commonmark: config.settingCommonmark,
      pedantic: config.settingPedantic,
      footnotes: config.settingFootnotes,
      breaks: config.settingBreaks
    }
  })(editor);
}
