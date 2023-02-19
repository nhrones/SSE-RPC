import { DEBUG, setCWD } from './constants.ts'
import { getDirectory, getFile, saveFile } from './fileIO.ts'

const sseChannel = new BroadcastChannel("sse-rpc");

/** 
 * Server Sent Events
 * Subscribes a client to a Server Sent Event stream 
 * @param _req (Request) - the request object from the http request
 */
export function registerRPC(req: Request): Response {

    if (DEBUG) console.info('Started SSE Stream! - ', req.url)

    const stream = new ReadableStream({
        start: (controller) => {

            // listening for bc messages
            sseChannel.onmessage = (e) => {

                const { msgID, procedure, params } = e.data
                if (DEBUG) console.log(`sse got - msgID: ${msgID}, procedure: "${procedure}", params: ${JSON.stringify(params)}`)
                // deno-lint-ignore no-explicit-any
                let thisError: any = null
                let thisResult = null
                // calling remote procedures
                switch (procedure) {
                    case 'GetFileList': {
                        console.log('handling - GetFileList' )
                        const { root, folder } = params
                        setCWD(root)
                        getDirectory(folder).then(result => {
                            thisResult = JSON.stringify(result)
                            const reply = JSON.stringify({
                                msgID: msgID,
                                error: thisError,
                                result: thisResult
                            })
                            controller.enqueue('data: ' + reply + '\n\n');
                        })
                        break;
                    }
                    // get file contents
                    case 'GetFile': {
                        console.log('handling - GetFile' )
                        getFile(params).then(result => {
                            thisResult = JSON.stringify(result)
                            const reply = JSON.stringify({
                                msgID: msgID,
                                error: thisError,
                                result: thisResult
                            })
                            controller.enqueue('data: ' + reply + '\n\n');
                        })
                        break;
                    }
                    // save file contents    
                    case 'SaveFile': {
                        console.log('handling - SaveFile' )
                        saveFile(params)
                        thisResult = 'ok'
                        break;
                    }
                    default: {
                        console.log('handling - default' )
                        thisError = 'Unknown procedure called!';
                        break;
                    }
                }

                const reply = JSON.stringify({
                    msgID: msgID,
                    error: thisError,
                    result: thisResult
                })
                controller.enqueue('data: ' + reply + '\n\n');

            }
        },
        cancel() {
            sseChannel.close();
        }
    })
    
    return new Response(stream.pipeThrough(new TextEncoderStream()), {
        headers: {
            "content-type": "text/event-stream",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache"
        },
    })
}
