import {initComms, rpcRequest} from './rpc.js'
const logger = document.getElementById("logger");
const log = (what, whatElse = null, and = null) => {
  if (logger) {
    let text = what + "   ";
    if (whatElse)
      text += whatElse;
    if (and)
      text += and;
    logger.textContent = text + `
` + logger.textContent;
  }
};

const getdirBtn = document.getElementById("getdirBtn");
getdirBtn.onclick = () => {
  log(`Dir Button clicked!`);
  
    rpcRequest("GetFileList", {
        root:'./',
        folder: '',
    }).then((result) => {
      if (typeof result === "string")
        log("Result - " + result);
    }).catch((e) => log(e));
};

const getFileBtn = document.getElementById("getFileBtn");
getFileBtn.onclick = () => {
  log(`Get Button clicked!`);
  //folder, fileName
    rpcRequest("GetFile", {
        folder: '',
        fileName:'app.js',
    }).then((result) => {
      if (typeof result === "string")
        log("Result - " + result);
    }).catch((e) => log(e));
};

const saveFileBtn = document.getElementById("saveFileBtn");
saveFileBtn.onclick = () => {
  log(`Save Button clicked!`);
  
    rpcRequest("SaveFile", {
        folder: './',
        fileName:'./style.css',
        content: `
        h1 {
            color: black;
        }
        `,
    }).then((result) => {
      if (typeof result === "string")
        log("Result - " + result);
    }).catch((e) => log(e));
};

initComms(log).then(() => {
  log("initComms ok");
  rpcRequest("GetFileList", {
    folder: '',
    fileName: null,
    content: null,
    root: `C:/Users/nhron/dev/DevTools/SSE-RPC/testRPC/`
  }).then((result) => {
    console.log(result)
  }).catch((e) => log(e));
});

log("App started!");
export {
  log,
  logger
};
