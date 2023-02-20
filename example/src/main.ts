/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="deno.ns" />

import {
   log,
   getFileListBtn,
   getFileBtn,
   saveFileBtn,
   outPut,
} from './dom.ts'

import * as RPC from './rpcClient.ts';

const testFolder = 'example';
const testFileName = './test.txt';

// when this button is clicked, run an ARPC
getFileListBtn.onclick = () => {
   log(`"Get File List" button clicked!`);
   // calls a remote procedure to get list of files from a folder
   RPC.Call('GetDirectory', {
      root: './',
      folder: 'example',
   })
      // when the procedure has completed ---
      .then((result) => {
         if (typeof result === "string") {
            let filenames = "File list:  "
            const files = JSON.parse(result)
            for (const file of files) {
               if (file.isFile) {
                  filenames = filenames + file.name + ", ";
               }
            }
            outPut.innerHTML = filenames; // show it.
         }
      })
      .catch((e) => log(e));
};

// get the file content
getFileBtn.onclick = () => {
   
   log(`"Get-File" button clicked!`);
   
   // calls a remote procedure to get a files content 
   RPC.Call("GetFile", {
      folder: testFolder,
      fileName: testFileName,
   })
   .then((result) => {
      if (typeof result === "string") {
         // shave off any quotation marks
         if (result.startsWith('"')) {
            result = result.slice(1, result.length - 1);
         }
         if (typeof result === 'string') outPut.innerHTML = result;
         saveFileBtn.removeAttribute("disabled");
      }
   })
   .catch((e) => log(e));
};

// save the file content
saveFileBtn.onclick = () => {  
   log(`"Save-File" button clicked!`);  
   // calls a remote procedure to save a file
   RPC.Call("SaveFile", {
      folder: testFolder,
      fileName: testFileName,
      content: outPut.textContent as string,
   })
   .then((result) => {
      if (typeof result === "string")
         log("Result - " + result);
         outPut.textContent = '';
      saveFileBtn.setAttribute("disabled", "");
   })
   .catch((e) => log(e));
};

RPC.Initialize(log).then(() => {
   log("Initialized RPC services!");
});

log("App started!");
