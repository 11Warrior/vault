import { Readable } from "node:stream";
import { Adapter } from "../Adapters";
import { spawn } from "node:child_process";


export class MongoDBAdapter implements Adapter {
    constructor(private config: any) { }

    async testConnection(): Promise<void> {
        // TODO: Implement actual MongoDB connection test
        throw new Error("testConnection not implemented");
    }

    backup(): Readable {
        const args = []
        //TODO: Backup method
        if (this.config.DB_URL) {
            const mongo_backup = spawn('mongodump',
                [
                    "--uri=", this.config.DB_URL
                ]
            )

            return mongo_backup.stdout;
        }

        const mongo_backup = spawn('mongodump', [
            "--host=", this.config.DB_HOST,
            "--username=", this.config.DB_USER,
            "--password=", this.config.DB_PASS
        ])

        return mongo_backup.stdout;

    }

    restore(file: Readable): Promise<void> {
        //TODO: restore method
        return new Promise((resolve, reject) => {

        });
    }
}