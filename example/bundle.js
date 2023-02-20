// deno-lint-ignore-file
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// deno:file:///C:/Users/nhron/dev/DevTools/SSE-RPC/example/src/dom.ts
var $ = /* @__PURE__ */ __name((id) => document.getElementById(id), "$");
var logger = $("logger");
var outPut = $("out");
var getFileListBtn = $("getFilesBtn");
var getFileBtn = $("getFileBtn");
var saveFileBtn = $("saveFileBtn");
var linenum = 0;
var log = /* @__PURE__ */ __name((what, whatElse = null, and = null) => {
  if (logger) {
    let text = what + "   ";
    if (whatElse) {
      text += whatElse;
    }
    if (and) {
      text += and;
    }
    linenum++;
    logger.textContent = linenum + " - " + text + `
` + logger.textContent;
  }
}, "log");

// deno:file:///C:/Users/nhron/dev/DevTools/SSE-RPC/example/src/rpcClient.ts
var serverURL = "http://localhost:9000";
var callbacks = /* @__PURE__ */ new Map();
var log2 = console.log;
var nextMsgID = 0;
var Call = /* @__PURE__ */ __name((procedure, params) => {
  const msgID = nextMsgID++;
  log2(`RPC msg ${msgID} called ${procedure}`);
  return new Promise((resolve, reject) => {
    callbacks.set(msgID, (error, result) => {
      if (error)
        return reject(new Error(error));
      resolve(result);
    });
    fetch(serverURL + "/", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ msgID, procedure, params })
    });
  });
}, "Call");
var Initialize = /* @__PURE__ */ __name((logger2) => {
  log2 = logger2 || console.log;
  return new Promise((resolve, reject) => {
    const events = new EventSource(serverURL + "/rpc_registration");
    log2("CONNECTING");
    events.addEventListener("open", () => {
      log2("events.onopen - CONNECTED");
      resolve("ok");
    });
    events.addEventListener("error", (_e) => {
      switch (events.readyState) {
        case EventSource.OPEN:
          log2("CONNECTED");
          break;
        case EventSource.CONNECTING:
          log2("CONNECTING");
          break;
        case EventSource.CLOSED:
          reject("closed");
          log2("DISCONNECTED");
          break;
      }
    });
    events.addEventListener("message", (e) => {
      const { data } = e;
      const parsed = JSON.parse(data);
      const { msgID, error, result } = parsed;
      if (error) {
        console.log("sse-rpc got error - ", error);
        log2(`ARPC msg ${msgID} returned an error - #{error}`);
      }
      if (msgID >= 0) {
        if (result) {
          log2(`ARPC msg ${msgID} returned - ${result}`);
          if (!callbacks.has(msgID)) {
            console.log("no callback found for ", msgID);
            return;
          }
          const callback = callbacks.get(msgID);
          callbacks.delete(msgID);
          callback(error, result);
        }
      }
    });
  });
}, "Initialize");

// deno:file:///C:/Users/nhron/dev/DevTools/SSE-RPC/example/src/main.ts
var testFolder = "example";
var testFileName = "./test.txt";
getFileListBtn.onclick = () => {
  log(`"Get File List" button clicked!`);
  Call("GetDirectory", {
    root: "./",
    folder: "example"
  }).then((result) => {
    if (typeof result === "string") {
      let filenames = "File list:  ";
      const files = JSON.parse(result);
      for (const file of files) {
        if (file.isFile) {
          filenames = filenames + file.name + ", ";
        }
      }
      outPut.innerHTML = filenames;
    }
  }).catch((e) => log(e));
};
getFileBtn.onclick = () => {
  log(`"Get-File" button clicked!`);
  Call("GetFile", {
    folder: testFolder,
    fileName: testFileName
  }).then((result) => {
    if (typeof result === "string") {
      if (result.startsWith('"')) {
        result = result.slice(1, result.length - 1);
      }
      if (typeof result === "string")
        outPut.innerHTML = result;
      saveFileBtn.removeAttribute("disabled");
    }
  }).catch((e) => log(e));
};
saveFileBtn.onclick = () => {
  log(`"Save-File" button clicked!`);
  Call("SaveFile", {
    folder: testFolder,
    fileName: testFileName,
    content: outPut.textContent
  }).then((result) => {
    if (typeof result === "string")
      log("Result - " + result);
    outPut.textContent = "";
    saveFileBtn.setAttribute("disabled", "");
  }).catch((e) => log(e));
};
Initialize(log).then(() => {
  log("Initialized RPC services!");
});
log("App started!");
