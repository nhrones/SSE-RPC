export const DEBUG = true
export const MINIFY = false
export const host = "localhost"
export const port = 9000

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
