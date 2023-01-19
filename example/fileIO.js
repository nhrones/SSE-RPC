import {
   log,
   getFileList,
   getFile,
   saveFile,
   outPut,
} from './dom.js'

//import { initComms, arpcCall } from './arpcClient.js'

import * as ARPC from './arpcClient.js'

const testFolder = 'example';
const testFileName = './test.txt';

// when this button is clicked, run an ARPC
getFileList.onclick = () => {
   log(`"Get File List" button clicked!`);
   // calls a remote procedure to get list of files from a folder
   ARPC.Call("GetFileList", {
      root: './',
      folder: 'testRPC',
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
getFile.onclick = () => {
   
   log(`"Get-File" button clicked!`);
   
   // calls a remote procedure to get a files content 
   ARPC.Call("GetFile", {
      folder: testFolder,
      fileName: testFileName,
   })
   .then((result) => {
      if (typeof result === "string") {
         // shave off the quotation marks
         if (result.startsWith('"')) {
            result = result.slice(1, result.length - 1);
         }
         outPut.innerHTML = result
         saveFile.removeAttribute("disabled", "");
      }
   })
   .catch((e) => log(e));
};

// save the file content
saveFile.onclick = () => {  
   log(`"Save-File" button clicked!`);  
   // calls a remote procedure to save a file
   ARPC.Call("SaveFile", {
      folder: testFolder,
      fileName: testFileName,
      content: outPut.textContent,
   })
   .then((result) => {
      if (typeof result === "string")
         log("Result - " + result);
         outPut.textContent = '';
      saveFile.setAttribute("disabled", "");
   })
   .catch((e) => log(e));
};

ARPC.Initialize().then(() => {
   log("Initialized ARPC services!");
});

log("App started!");
