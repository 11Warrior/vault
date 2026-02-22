import { Readable } from "stream";

export class RestoreManager {
    constructor(private adapter: any, private storage: any) { }

    async run(filename: string) {
        const restored_data: Readable = this.storage.load(filename);
        await this.adapter.restore(restored_data);
    }
}