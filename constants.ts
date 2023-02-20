export const DEBUG = true
export const MINIFY = false
export const host = "localhost"
export const port = 9000



//---------------------------------------------------------
//  Typed Procedures --------------------------------------
//---------------------------------------------------------
/** generic event Handler type */
// deno-lint-ignore no-explicit-any
export type Handler<T = any> = (data?: T) => void;

export type contentCFG = {
   folder: string;
   fileName: string;
   content: string;
}
/** 
 * Named Procedure types    
 * Each procedure-type \<name\> is unique    
 * Each procedure-type registers a payload-type 
 * This payload-type is type-checked when coding procedure-calls
 */
export type TypedProcedures = {

   /** getDirectory event */
   GetDirectory: {
      root: string,
      folder: string
   },

   /** getFile event */
   GetFile: {    
      folder: string;
      fileName: string
   },
   
   /** Focused state-changed event */
   SaveFile: {
      folder: string;
      fileName: string;
      content: string;
   },
}

export const corsResponse = (body = '') => new Response(body,
    {
        status: 200,
        headers: { 
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Methods": "GET OPTIONS POST DELETE",
     },
    }
);

export const browserAlias = {
    windows: "explorer",
    darwin: "open",
    linux: "sensible-browser",
};

//---------------------------------------------------------
//  CTX ---------------------------------------------------
//---------------------------------------------------------

export type CTX = {
    cwd: string    
    fileName: string
    port: number
    url: string
}

export const ctx: CTX = {
    cwd: Deno.cwd(),
    fileName: './server.ts',
    port: port,
    url: 'localhost',
}
export const setCWD = (newCWD: string) => {
    ctx.cwd = newCWD;
}

export const setCTX = (newCTX:CTX ) => {
    ctx.cwd = newCTX.cwd
    ctx.fileName = newCTX.fileName
    ctx.port = newCTX.port
    ctx.url = newCTX.url
}


//---------------------------------------------------------
//  RPC ---------------------------------------------------
//---------------------------------------------------------

export type RpcId = number;
export type RpcParams = JsonArray | JsonObject;
export type RpcProcedure = string;

export interface RpcRequest {
    msgID: RpcId;
    procedure: RpcProcedure;
    params?: RpcParams;
}

export interface RpcResponse {
    msgID: RpcId;
    error: JsonValue;
    result: JsonValue;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [member: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
