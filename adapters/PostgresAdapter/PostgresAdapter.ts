import { spawn } from "child_process";
import { Adapter } from "../Adapters";
import { Readable } from "stream";

export class PostgresAdapter implements Adapter {
    constructor(private config: any) { }

    testConnection(): Promise<void> {
        return new Promise((resolve, reject) => {
            let args: string[] = [];
            let env = { ...process.env };

            if (this.config.DB_URL) {
                args = [
                    this.config.DB_URL,
                    '-c', "\\q"

                ];
            } else {
                args = [
                    '-h', this.config.DB_HOST,
                    '-U', this.config.DB_USER,
                    // '-p', this.config.DB_PORT,
                    '-d', this.config.DB_NAME,
                    '-c', "\\q"
                ]

                env = { ...env, PGPASSWORD: this.config.DB_PASS }
            }

            const psql_child = spawn('psql', args, { env })

            psql_child.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error("Error connecting with the postgres db"))
                }
            })
        })
    }

    backup(): Readable {
        if (this.config.DB_URL) {
            //...backup using hosted url
            const backup_data = spawn('pg_dump',
                [

                    this.config.DB_URL
                ]
            )

            backup_data.stderr.on('data', (data) => {
                console.log("Error while backing up the data from host", data.toString());
            })

            return backup_data.stdout;
        }

        const backup_data = spawn('pg_dump',
            [
                '-U', this.config.DB_USER,
                '-h', this.config.DB_HOST,
                this.config.DB_NAME
            ], {
            env: {
                ...process.env,
                PGPASSWORD: this.config.DB_PASS
            }
        }
        )

        backup_data.stderr.on('data', (data) => {
            console.log("pg dump error while backup : ", data.toString());
        })

        return backup_data.stdout;
    }

    restore(file: Readable): Promise<void> {
        // console.log(this.config.DB_NAME);
        if (this.config.DB_URL) {
            const restored_backup = spawn('psql', [
                this.config.DB_URL
            ])

            file.pipe(restored_backup.stdin);

            return new Promise((resolve, reject) => {
                restored_backup.on('exit', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error("Error while restoring for hosted db"));
                    }
                })
            })
        }

        const restored_backup = spawn('psql', [
            '-h', this.config.DB_HOST,
            '-U', this.config.DB_USER,
            '-d', this.config.DB_NAME,
            this.config.DB_NAME

        ],
            {
                env: {
                    ...process.env,
                    PGPASSWORD: this.config.DB_PASS
                }
            })

        file.pipe(restored_backup.stdin);

        return new Promise((resolve, reject) => {
            restored_backup.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error('Error restoring db file'))
                }
            })
        })
    }
}