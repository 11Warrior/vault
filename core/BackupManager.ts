
export class BackupManager {
    constructor(
        private adapter: any,
        private storage: any
    ) { }

    async run(filename: string) {
        await this.adapter.testConnection();

        const backedUp = this.adapter.backup();

        await this.storage.save(backedUp, filename);
    }
}