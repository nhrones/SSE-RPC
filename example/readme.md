# RPC Example Client app
This simple web app uses the RPC service to do file-io.    
The app code was transpiled and bundled using esbuild.    
The clients Typescript source is in /example/src.    
The bundle starts at /src/main.ts

## Run It 

To run this example, you must first start the RPC service.     
From the project root, open a terminal and enter the following:    
```
$ deno run -A --unstable server.ts
```
Or, you could run the server directly from this git repo:
```
deno run -Ar --unstable https://raw.githubusercontent.com/nhrones/SSE-RPC/master/server.ts
```
Then, with the RPC service running, run the application in the ./example folder   
using either the `Live Server` vscode extension, or any other dev-server    
that supports js modules.
