import { serve } from './deps.ts'
import { corsResponse, DEBUG, host, port } from './constants.ts'
import { postMessage } from './post.ts'
import { registerRPC } from './sse_rpc.ts'

//////////////////////////////////////
//    Handle all http requests      //
//////////////////////////////////////
function handleRequest(request: Request): Response | Promise<Response> {

    // get the requested path name
    const { pathname } = new URL(request.url);
    if (DEBUG) console.log('Got server request!', pathname)
    
    if (pathname.includes("rpc_registration")) {
        if (DEBUG) console.log('got rpc_registration request!')
        return registerRPC(request)
    } // service all POST requests - (Remote Procedure Calls)    
    else if (request.method === 'POST') {
        if (DEBUG) console.log('handling POST request!')
        return postMessage(request)
    } else {
        if (DEBUG) console.log('Requested pathName Not Found - ', pathname)
        return Promise.resolve(corsResponse(`Requested pathName Not Found - ${pathname}`))
    }
}

serve(handleRequest, { hostname: host, port: port })
    .then(() => console.log("Server closed"))
    .catch((err) => console.info('Server caught error - ', err))
