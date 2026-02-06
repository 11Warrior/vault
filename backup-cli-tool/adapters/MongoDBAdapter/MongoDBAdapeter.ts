import { Readable } from "node:stream";
import { Adapter } from "../Adapters";
import { spawn } from "node:child_process";


export class MongoDBAdapter implements Adapter {
    constructor(private config: any) { }

    async testConnection(): Promise<void> {
        // TODO: Implement actual MongoDB connection test
        return new Promise((resolve, reject) => {
            let args: string[] = []
            let env = { ...process.env }

            if (this.config.DB_URL) {
                args = [
                    '--uri', this.config.DB_URL,
                    // "--dryRun",
                    "--tlsInsecure"
                ]
            } else {
                args = [
                    "--host", this.config.DB_HOST,
                    "--username", this.config.DB_USER,
                    "--password", this.config.DB_PASS,
                    '--dryRun',
                    '--tlsInsecure'
                ]
            }

            const test_mongo_conn = spawn('mongodump', args, { env });

            test_mongo_conn.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error("Error while connecting to mongodb database"))
                }
            })
        })
    }

    backup(): Readable {
        let args = []
        //TODO: Backup method
        if (this.config.DB_URL) {
            args = [
                '--uri', this.config.DB_URL,
                "--archive"
            ]
        } else {
            args = [
                "--host", this.config.DB_HOST,
                "--username", this.config.DB_USER,
                "--password", this.config.DB_PASS,
                "--archive"
            ]
        }

        const mongo_backup = spawn('mongodump', args)

        return mongo_backup.stdout;
    }

    restore(file: Readable): Promise<void> {
        //TODO: restore method
        let args: string[] = []
        const env = { ...process.env }

        if (this.config.DB_URL) {
            args = [
                '--uri', this.config.DB_URL,
                '--drop',
                "--archive"
            ]
        } else {
            args = [
                '--host', this.config.DB_HOST,
                '--username', this.config.DB_USER
            ]
        }

        const restore_data = spawn('mongorestore', args, { env })

        // restore_data.stderr.on('data', (data) => {
        //     console.log("Error getting the stream in mongodb restore method", data.toString());
        // })

        file.pipe(restore_data.stdin).on('error', () => {
            console.log("Error while piping the restored file ", );
        });

        return new Promise((resolve, reject) => {
            restore_data.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error("Error restoring the data of mongodb."));
                }
            })
        })


        // return new Promise((resolve, reject) => {    
        // })

    }
}