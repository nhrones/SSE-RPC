
const $ = (id) => document.getElementById(id);

export const logger = $("logger");
export const outPut = $("ctnt");
export const getFileList = $("getFilesBtn");
export const getFile = $("getFileBtn");
export const saveFile = $("saveFileBtn");

let linenum = 0
export const log = (what, whatElse = null, and = null) => {
   if (logger) {
      let text = what + "   ";
      if (whatElse) {
         text += whatElse;
      }
      if (and) {
         text += and;
      }
      linenum++
      logger.textContent = linenum + ' - ' + text + `
` + logger.textContent;
   }
};
