import 'dotenv/config';
import { Command } from 'commander'
import { backup } from './backup'
import { restore } from './restore';

const program = new Command();

program
    .name('backup')
    .command('backup')
    .argument('<dbtype>', 'database type [postgres, mongodb]', (dbtype) => {
        if (!['postgres', 'mongodb'].includes(dbtype)) {
            throw new Error("Invalid database type enterred !");
        }
        return dbtype;
    })
    .description('Backups your database.')
    .action((dbtype) => backup(dbtype));


program
    .name('restore')
    .command('restore <filename>')
    .description('Restoring from existing db file')
    .action((filename) => restore(filename))

program.parse(process.argv);
