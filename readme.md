# SSE-RPC
Async Remote Proceedure Calls, based on Server Sent Events.

The architecture is as follows:
## SSE
  * A client being served must have a minimal SSE capability .        

  
## RPC
  * This service has many built-in Remote Procedures that a client may call with the correct protocol. See the rpc-list below.
  * A client-side rpc-call uses an async registry that returns a promise. When the server eventually responds to the call(sse-onmessage), the client-rpc resolves the promise with a result or an error. 
  
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
You can see them in action in the example in `/testRPC/ `.
 1. `getFileList` - returns the results of a `deno-walk`.
 2. `getFile` - returns the text content of a file.
 3. `saveFile` - saves text content to a file.
