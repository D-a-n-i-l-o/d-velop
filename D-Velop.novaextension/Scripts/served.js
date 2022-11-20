//
// Copyright 2022 Staysail Systems, Inc.
//
// Distributed under the terms of the MIT license.

const Messages = require("./messages.js");
const Catalog = require("./catalog.js");
const Config = require("./config.js");
const delay = require("./delay.js");

var lspClient = null;

function stopClient() {
  if (lspClient) {
    lspClient.stop();
  }
}

async function startClient() {
  let path = "";
  let args = [];
  // uncomment the following for debugging
  //    args.concat(["--loglevel", "trace"]);

  if (nova.config.get(Config.useCustomServer)) {
    path = nova.config.get(Config.customServerPath);
    // Use the default server path
    if (!path) {
      path = "/usr/local/bin/serve-d";
    }
  } else {
    path = nova.path.join(nova.extension.globalStoragePath, "serve-d");
  }

  if (!nova.fs.access(path, nova.fs.X_OK)) {
    Messages.showNotice(catalog.msgNoLspClient, "");
    return null;
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
  lspClient = new LanguageClient(
    "d-langserver" + Date.now(), // use a unique server id for each call
    "Serve-D",
    serverOptions,
    clientOptions
  );

  // lspClient.onDidStop(this.didStop, this);

  try {
    lspClient.start();
  } catch (err) {
    Messages.showNotice(Catalog.msgLspDidNotStart, err.message);
    return false;
  }

  var limit = 1000;
  while (!lspClient.running && limit > 0) {
    delay(10);
    limit -= 10;
  }
  if (lspClient.running) {
    return true;
  }

  Messages.showNotice(Catalog.msgLspDidNotStart, "");
  return false;
}

async function restartClient() {
  stopClient();
  let rv = await startClient();
  if (rv) {
    Messages.showNotice(Catalog.msgLspRestarted, "");
  }
  return rv;
}

async function sendRequest_(method, params) {
  if (lspClient == null) {
    Messages.showError(Catalog.msgNoLspClient);
    return null;
  } else {
    return lspClient.sendRequest(method, params);
  }
}

let ServeD = {
  restart: restartClient,
  start: startClient,
  stop: stopClient,
  deactivate: stopClient,
  sendRequest: sendRequest_,
};
module.exports = ServeD;
