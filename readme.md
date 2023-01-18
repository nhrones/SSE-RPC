
# HotServe

This implementation of Deno Server, integrates ESBuild to improve the developement
experience.     
When you hot-serve a project, it automates the `code->transpile->run loop`.

## DX loop
Running the `hotserve` command in a project folder will: 
  * serve the content of the project folder (index.html)
  * auto-open the project in your browser (localhost:8000)
  * hot-reload/refresh the browser after `any` saved change.    
      * any change in the `/src/` folder will trigger an ESBuild to `/dist/bundle.js`.    
      * all changes trigger a browser restart or refreah.    
      * `css` changes simply refresh styles without a browser restart.        


## async RPC
HotServe has a built-in `SSE-RPC` service.    
See: SSE-RPC notes in `./SSE-RPC.md`  

## Usage
For the `auto-build` feature, HotServe requires a project folder with the following minimum:  
```
/src/main.ts
index.html
bundle.js
```
Note: that `index.html` must include a script tag for bundle.js of type 'module'   

Otherwise, HotServe will serve and present any folder that contains an index.html file.

A `/src/main.ts` file is required for auto-build. ESBuild will bundle from main.ts.   
HotServe will the auto-build all saved changes in the /src folder.    

## Example
To run the example:           
  * Download the example folder
  * Open the folder in vscode
  * From a command line in the folder, run ...           
```
deno run -A --unstable https://raw.githubusercontent.com/nhrones/HotServe/master/server.ts
```   
## Install local
I run a local copy of HotServe, installed as `hotserve`.    
I prefer the command name `hotserve` without caps. (easier to type)! 
```
deno install -A --unstable -n hotserve https://raw.githubusercontent.com/nhrones/HotServe/master/server.ts
```    
Then in any project folder, you can simply run the command `hotserve` in the root folder.

Note: this will serve any project type - js, ts or deno,  but, will only auto-build from a `/src/main.ts` file.

If you prefer, you can serve the application from any sub-folder such as `./dist` or `./public`.    
To do so, place your app files, (index.html, and bundle.js at minimum) to this sub-folder.
```
/src/main.ts
/dist/index.html
/dist/bundle.js
```
You would then start `hotserve` from the projects root, by adding the folder name as an argument to the hotserve command:
```
hotserve dist
or...
hotserve public
``` 
This will redirect the build output to `/dist/bundle.js` or `/public/bundle.js`,    
and will start the browser serving `/dist/index.html` or `/public/index.html`.

# Benefits
This DX allows me to use a `Deno` code experience for all my client-side projects.    
By placing the following at the top of /src/main.ts, keeps vscode happy:
```js
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />
``` 
(My BobTheBuilder scaffolds this automatically) 
This allow me to then write all client-side code as `ts`, without the Deno vscode extension getting in the way.     
On save, all src code is then auto-bundled to a bundle.js file, and the browser is refreshed immediately.    
This provides a very pleasant and efficient DX. 

## How it works 
First, on startup, HotServe runs a deno sub-process that launches your default browser to localhost:8000.     
Also, when serving any index.html file, HotServe will inject a script tag at the end of the body tag. This injected javascript boots an EventSource that listens for refresh/restart commands.   When a command is recieved, this script will refresh/restart the running browser.    
The injected script is transient. It does not change your original index.html file in any way!
  
# Please note:
This is a `toy project` built as a learning experience for my own use.     
I'm sure their are better ways to do this.    
I have a companion app `Bob the Builder`, https://github.com/nhrones/BobTheBuilder .    
Bob uses HotServe to quickly `scaffold` out Deno, TS, or JS apps that I use to learn/experiment with.    

## Build-> Fool-Around -> Learn -> Toss-It-Out -> Start Again.

In the past 54 years of writing code, I learned one very valuable lesson! `It's never too late to throw it out and start over`.  As we code, we learn! Often new found knowlege leeds to new insights about architecture and tool usage. 
