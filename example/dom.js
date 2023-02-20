
const $ = (id) => document.getElementById(id);

export const logger = $("logger");
export const outPut = $("ctnt");
export const getFileListBtn = $("getFilesBtn");
export const getFileBtn = $("getFileBtn");
export const saveFileBtn = $("saveFileBtn");

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
