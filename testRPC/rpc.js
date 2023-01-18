// deno-lint-ignore-file
//const server = "https://github.com/nhrones/SSE-RPC/blob/master/server.ts"
//const server = "https://raw.githubusercontent.com/nhrones/SSE-RPC/master/server.ts"
const server = "http://localhost:9000"

const files = [];
const ctx = {
  fileList: files,
  fileName: "",
  folderName: ""
};

let log;

const callbacks = /* @__PURE__ */ new Map();
let nextMsgID = 0;

export const rpcRequest = (procedure, params) => {
  const msgID = nextMsgID++;
  log("requesting " + msgID);
  return new Promise((resolve, reject) => {
    callbacks.set(msgID, (error, result) => {
      if (error)
        return reject(new Error(error.message));
      resolve(result);
    });
    fetch(server + "/", {
      method: "POST",
      mode: 'cors',
      body: JSON.stringify({ msgID, procedure, params })
    });
  });
};

export const initComms = (log2) => {
    log = log2
  return new Promise((resolve, reject) => {
    const events = new EventSource(server + "/rpc_registration");
    log("CONNECTING");
    events.addEventListener("open", () => {
      log("events.onopen - CONNECTED");
      resolve("ok");
    });
    events.addEventListener("error", (_e) => {
      switch (events.readyState) {
        case EventSource.OPEN:
          log("CONNECTED");
          break;
        case EventSource.CONNECTING:
          log("CONNECTING");
          break;
        case EventSource.CLOSED:
          reject("closed");
          log("DISCONNECTED");
          break;
      }
    });
    events.addEventListener("message", (e) => {
      const { data } = e;
      const parsed = JSON.parse(data);
      const { msgID, error, result } = parsed;
      if (error) {
        console.log("sse-rpc got error - ", error);
      }
      if (msgID >= 0) {
        if (error) { log('Error - ' + error)}
        if (result) {
            log("sse-rpc got result - " + result); //.substring(0, 12));
        }
        if (!callbacks.has(msgID)) return;
        const callback = callbacks.get(msgID);
        callbacks.delete(msgID);
        callback(error, result);
      }
    });
  });
};

