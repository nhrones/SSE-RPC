/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="deno.ns" />

import { TypedProcedures } from '../../constants.ts'

// deno-lint-ignore-file
const serverURL = "http://localhost:9000"

const files: string[] = [];
const _ctx = {
   fileList: files,
   fileName: "",
   folderName: ""
};

const callbacks = new Map();
let log = console.log;
let nextMsgID = 0;

/** 
 * Make an Asynchronous Remote Proceedure Call
 *  
 * @param {string} procedure - the name of the remote procedure to be called
 * @param {TypedProcedures[key]} params - appropriately typed parameters for this procedure
 * 
 * @returns {Promise} - Promise object has a callback that is stored by ID    
 *   in a callbacks Set.   
 *   When this promise resolves or rejects, the callback is retrieves by ID    
 *   and executed by the promise. 
 */
export const Call = <key extends keyof TypedProcedures>(procedure: key, params: TypedProcedures[key]) => {

   const msgID = nextMsgID++;
   log(`RPC msg ${msgID} called ${procedure}`);
   return new Promise((resolve, reject) => {

      callbacks.set(msgID, (error: string | null, result: string | null) => {
         if (error)
            return reject(new Error(error));
         resolve(result);
      });
      fetch(serverURL + "/", {
         method: "POST",
         mode: 'cors',
         body: JSON.stringify({ msgID, procedure, params })
      });
   });
};

// deno-lint-ignore no-explicit-any
export const Initialize = (logger: (...data: any[]) => void) => {
   log = logger || console.log
   return new Promise((resolve, reject) => {

      // this is the SSE client
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

      // messages from server (RPC result/error)
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
