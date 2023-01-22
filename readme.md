# ARPC-SSE
Asynchronous Remote Procedure Calls, over Server Sent Events.

This service architecture is as follows:
## SSE
A client registers for a service over Server Sent Events .        

  
## RPC
  * This service has many built-in Remote Procedures that a client may call with the correct protocol. See the rpc-list below.
  * A client-side rpc-call uses an async registry that returns a promise. When the server eventually responds to the call(sse-onmessage), the client-rpc resolves the promise with a result or an error. 
 
 ![rpc](SSE-BC.png)
  
  ## Protocol
  An RPC call-RpcRequest to the server must use the following protocol:
```js
type RpcId = number;
type RpcProcedure = string;
type RpcParams = JsonArray | JsonObject;

interface RpcRequest {
    msgID: RpcId;
    procedure: RpcProcedure;
    params?: RpcParams;
}

interface RpcResponse {
    msgID: RpcId;
    error: JsonValue;
    result: JsonValue;
}

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [member: string]: JsonValue };
type JsonArray = JsonValue[];
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
```
A `raw` client call is performed as:
```js
   fetch("/rpc", {
      method: "POST",
      body: JSON.stringify({ msgID: msgID, procedure: procedure, params: params }),
   });
```
The server will perform the procedure and return either a result or an error response.    
See: `RpcResponse` above.
     
The client, on receipt of the sse-message, will unpack the response, locate the stored promise registered to this `msgID`, and either resolve or reject it depending on the values of `error` and `result`.


## Built-in Remote Procedures
The following are the current built-in procedures.    
You can see them in action in the example in /example/ .
 1. `getFileList` - returns the results of a `deno-walk`. /* params{ root, folder } */
 2. `getFile` - returns the text content of a file.       /* params{ folder, name } */
 3. `saveFile` - saves text content to a file.            /* params{ folder, name, content } */
