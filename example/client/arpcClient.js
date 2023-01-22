// deno-lint-ignore-file
const serverURL = "http://localhost:9000"

const files = [];
const ctx = {
   fileList: files,
   fileName: "",
   folderName: ""
};

const callbacks = new Map();
let log;
let nextMsgID = 0;

/** 
 * Make an Asynchronous Remote Proceedure Call 
 * @returns (promise) this promise has a callback that is stored
 * by ID in a callbacks Set. When this promise resolves or rejects
 * the callback is retrieves by ID and executed by the promise. 
 * */
export const Call = (procedure, params) => {
   const msgID = nextMsgID++;
   log(`ARPC msg ${msgID} called ${procedure}`);
   return new Promise((resolve, reject) => {

      callbacks.set(msgID, (error, result) => {
         if (error)
            return reject(new Error(error.message));
         resolve(result);
      });
      fetch(serverURL + "/", {
         method: "POST",
         mode: 'cors',
         body: JSON.stringify({ msgID, procedure, params })
      });
   });
};

export const Initialize = (logger = null) => {
   log = logger || console.log
   return new Promise((resolve, reject) => {
      const events = new EventSource(serverURL + "/rpc_registration");
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
            log(`ARPC msg ${msgID} returned an error - #{error}`)
         }
         if (msgID >= 0) {
            if (result) {
               log(`ARPC msg ${msgID} returned - ${result}`);

               if (!callbacks.has(msgID)) {
                  console.log('no callback found for ', msgID)
                  return;
               }
               
               const callback = callbacks.get(msgID);
               callbacks.delete(msgID);
               callback(error, result);
               
            }
         }
      });
   });
};

