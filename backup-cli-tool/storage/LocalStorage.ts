import path from 'path';
import fs, { createReadStream, createWriteStream } from 'fs'
import Stream, { Readable } from 'stream';

export class LocalStorage {
    
    constructor(private type: any) {}

    save(dataStream: Readable, filename: string): Promise<void> {

        return new Promise((resolve, reject) => {
            const filePath = path.join('backup', this.type, filename)
            dataStream.pipe(createWriteStream(filePath)).on('finish', resolve);
        })
    }

    load(filename: string): Stream {
        return fs.createReadStream(path.join('backup', 'postgress', filename));
    }
}