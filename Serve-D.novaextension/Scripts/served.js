//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

const Messages = require("./messages.js");
const Catalog = require("./catalog.js");

class ServeD extends Disposable {
  constructor() {
    super();
    this.lspClient = null;
    nova.subscriptions.add(this);
  }

  deactivate() {
    this.dispose();
  }

  didStop(error) {
    if (error) {
      Messages.showError(Catalog.msgLspStoppedErr);
      console.error("Language server stopped with error:", error.message);
    }
  }

  start() {
    if (this.lspClient) {
      // stop client
      this.lspClient.stop();
      this.lspClient = null;
    }

    let path = "";
    let args = [];
    // uncomment the following for debugging
    // args: ['--loglevel', 'trace'],

    // Use the default server path
    if (!path) {
      path = "/usr/local/bin/serve-d";
    }

    // Create the client
    var serverOptions = {
      path: path,
      args: args,
    };
    var clientOptions = {
      // The set of document syntaxes for which the server is valid
      syntaxes: ["d"],
      debug: true,
    };
    this.lspClient = new LanguageClient(
      "d-langserver",
      "D Language Server",
      serverOptions,
      clientOptions
    );

    this.didStopDispose = this.lspClient.onDidStop(this.didStop);

    try {
      // Start the client
      this.lspClient.start();
    } catch (err) {
      Messages.showNotice(Catalog.msgLspDidNotStart, "");
      if (nova.inDevMode()) {
        console.error(err);
      }
      this.lspClient = null;
    }
  }

  async sendRequest(method, params) {
    if (this.lspClient == null) {
      Messages.showError(Catalog.msgNoLspClient);
    } else {
      return this.lspClient.sendRequest(method, params);
    }
  }

  async restart() {
    let client = this.lspClient;
    this.lspClient = null;
    if (client) {
      client.onDidStop((_) => {
        this.start();
        Messages.showNotice(Catalog.msgLspRestarted, "");
      }, this);
      client.stop();
    } else {
      this.start();
    }
  }

  async dispose() {
    if (this.didStopDispose) {
      this.didStopDispose.dispose();
      this.didStopDispose = null;
    }
    if (this.lspClient) {
      this.lspClient.stop();
      this.lspClient = null;
    }
  }
}

module.exports = ServeD;
