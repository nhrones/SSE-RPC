
import { join, walk } from './deps.ts'
import type { WalkEntry } from './deps.ts'
import { ctx, DEBUG } from './constants.ts'
export type contentCFG = {
    folder: string;
    fileName: string;
    content: string;
}


/** get directory list */
export const getDirectory = async (path: string): Promise<WalkEntry[]> => {
    const paths: WalkEntry[] = []
    for await (const entry of walk(path, {
        includeFiles: true,
        includeDirs: true,
        followSymlinks: false,
        skip: [/vscode/, /git/]
    })) { // text files only
        if (entry.name[0] === ".") continue;
        if (entry.name.includes('.png')) continue;
        if (entry.name.includes('.jpg')) continue;
        paths.push(entry)
    }
    return paths
}

/** get file content */
export const getFile = async (cfg: contentCFG): Promise<string> => {
    const { folder, fileName } = cfg
    const target = join(folder, fileName)
    if (DEBUG) console.log(`getting - folder ${folder}, fileName ${fileName}, target ${target}`)
    try {
        return await Deno.readTextFile(target);
    } catch(err) {
        console.warn('error', err)
        return 'File not found!';
    }
}

/** save file content */
export const saveFile = (cfg: contentCFG): Promise<void> => {
    const { folder, fileName, content } = cfg
    if (DEBUG) console.log(`saving - folder ${folder} fileName ${fileName} content = ${content}`)
    return Deno.writeTextFile(join(ctx.cwd, folder, fileName), content);
}
