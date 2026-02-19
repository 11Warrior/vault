#!/usr/bin/env node

import { config } from 'dotenv';
import { Command } from 'commander'
import { backup } from './backup'
import { restore } from './restore';
import path from 'path';

config({
    path: path.resolve(process.cwd(), '.env')
})

if (!process.env.DB_URL) {
    console.error("DB_URL not found.");
    console.error("Make sure you are running savr from a directory containing a .env file.");
    process.exit(1);
}

const program = new Command();

program
    .command('backup')
    .argument('<dbtype>', 'database type [postgres, mongodb]', (dbtype) => {
        if (!['postgres', 'mongodb'].includes(dbtype)) {
            throw new Error("Invalid database type enterred !");
        }
        return dbtype;
    })
    .option('-t --time <interval>', 'Give interval for auto-backup feature like (-t 6h)')
    .description('Backups your database.')
    .action((dbtype, options) => {
        backup(dbtype, options.interval);
    });


program
    .command('restore <filename>')
    .description('Restoring from existing db file')
    .action((filename) => restore(filename))

program.parse(process.argv);
