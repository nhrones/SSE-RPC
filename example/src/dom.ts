/// <reference no-default-lib="true" />
/// <reference lib="dom" />

const $ = (id: string) => document.getElementById(id);
export const logger = $("logger") as HTMLPreElement;
export const outPut = $("out") as HTMLPreElement;
export const getFileListBtn = $("getFilesBtn") as HTMLButtonElement;
export const getFileBtn = $("getFileBtn") as HTMLButtonElement;
export const saveFileBtn = $("saveFileBtn") as HTMLButtonElement;

let linenum = 0
export const log = (what: string, whatElse: string | null = null, and: string | null = null) => {
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
