'use strict'

/* global atom, window */

// Dependencies.
var CompositeDisposable = require('atom').CompositeDisposable

var engine
var idleCallbacks = new Set()

// Subscriptions.
var subscriptions = new CompositeDisposable()
var config = {}

// Expose.
exports.activate = activate
exports.deactivate = deactivate
exports.provideLinter = linter

// Activation tasks.
function activate() {
  var schema = require('./package.json').configSchema

  Object.keys(schema).forEach(function (key) {
    subscriptions.add(atom.config.observe('linter-remark.' + key, setter))

    function setter(value) {
      config[key] = value
    }
  })

  scheduleIdleTasks()
}

// Deactivation tasks.
function deactivate() {
  idleCallbacks.forEach(cancel)
  idleCallbacks.clear()
  subscriptions.dispose()
}

// Linter.
function linter() {
  return {
    grammarScopes: config.scopes,
    name: 'remark',
    scope: 'file',
    lintsOnChange: true,
    lint: lint
  }
}

// One run.
function lint(editor) {
  linterRemarkLoadDependencies()

  return engine({
    processor: require('remark'),
    pluginPrefix: 'remark',
    packageField: 'remarkConfig',
    rcName: '.remarkrc',
    ignoreName: '.remarkignore',
    detectIgnore: config.detectIgnore,
    detectConfig: config.detectConfig
  })(editor)
}

function scheduleIdleTasks() {
  if (!atom.inSpecMode()) {
    queue(linterRemarkInstallPeerPackages)
    queue(linterRemarkLoadDependencies)
  }
}

function linterRemarkInstallPeerPackages() {
  require('atom-package-deps').install('linter-remark')
}

function linterRemarkLoadDependencies() {
  if (!engine) {
    engine = require('unified-engine-atom')
  }
}

function queue(work) {
  var id = window.requestIdleCallback(callback)

  idleCallbacks.add(id)

  function callback() {
    idleCallbacks.delete(id)
    work()
  }
}

function cancel(callbackID) {
  window.cancelIdleCallback(callbackID)
}
