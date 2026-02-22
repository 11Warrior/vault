import path from 'path';
import fs, { createReadStream, createWriteStream } from 'fs'
import Stream, { Readable } from 'stream';

export class LocalStorage {

    constructor(private type: any) { }

    save(dataStream: Readable, filename: string): Promise<void> {

        return new Promise((resolve, reject) => {
            const dirPath = path.join('backup', this.type);
            fs.mkdirSync(dirPath, { recursive: true });
            const filePath = path.join(dirPath, filename)
            dataStream.pipe(createWriteStream(filePath)).on('finish', resolve);
        })
    }

    load(filename: string): Stream {
        const fileDir = path.join('backup', this.type, filename)
        if (!fileDir) throw new Error("Backup folder/file is empty")
        return createReadStream(fileDir);
    }
}