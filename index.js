'use strict'

const {AutoLanguageClient} = require('atom-languageclient')
const {install} = require('atom-package-deps')

const pkg = require('./package.json')

class RemarkLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    return pkg.enhancedScopes
  }

  getLanguageName() {
    return 'Markdown'
  }

  getServerName() {
    return 'Remark'
  }

  startServerProcess() {
    return super.spawn(require.resolve('.bin/remark-language-server'), [
      '--stdio'
    ])
  }

  activate() {
    install(pkg.name)
    super.activate()
  }
}

module.exports = new RemarkLanguageClient()
