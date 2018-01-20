'use strict';

/* global atom, window */
/* eslint-disable import/no-extraneous-dependencies */

/* Dependencies. */
var CompositeDisposable = require('atom').CompositeDisposable;

var engine;
var idleCallbacks = new Set();

/* Subscriptions. */
var subscriptions = new CompositeDisposable();
var config = {};

/* Expose. */
exports.activate = activate;
exports.deactivate = deactivate;
exports.provideLinter = linter;

function loadDeps() {
  if (!engine) {
    engine = require('unified-engine-atom');
  }
}

function makeIdleCallback(work) {
  var callbackId;
  var callBack = () => {
    idleCallbacks.delete(callbackId);
    work();
  };
  callbackId = window.requestIdleCallback(callBack);
  idleCallbacks.add(callbackId);
}

function scheduleIdleTasks() {
  function linterRemarkInstallPeerPackages() {
    require('atom-package-deps').install('linter-remark');
  }

  var linterRemarkLoadDependencies = loadDeps;

  if (!atom.inSpecMode()) {
    makeIdleCallback(linterRemarkInstallPeerPackages);
    makeIdleCallback(linterRemarkLoadDependencies);
  }
}

/* Activation tasks. */
function activate() {
  var schema = require('./package').configSchema;

  Object.keys(schema).forEach(function (key) {
    subscriptions.add(atom.config.observe('linter-remark.' + key, setter));

    function setter(value) {
      config[key] = value;
    }
  });

  scheduleIdleTasks();
}

/* Deactivation tasks. */
function deactivate() {
  idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
  idleCallbacks.clear();
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
  loadDeps();

  return engine({
    processor: require('remark'),
    pluginPrefix: 'remark',
    packageField: 'remarkConfig',
    rcName: '.remarkrc',
    ignoreName: '.remarkignore',
    detectIgnore: config.detectIgnore,
    detectConfig: config.detectConfig,
    settings: {
      gfm: config.settingGfm,
      commonmark: config.settingCommonmark,
      pedantic: config.settingPedantic,
      footnotes: config.settingFootnotes
    }
  })(editor);
}
