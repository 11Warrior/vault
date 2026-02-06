import 'dotenv/config';
import { PostgresAdapter } from "../adapters/PostgresAdapter/PostgresAdapter"
import { BackupManager } from "../core/BackupManager";
import { LocalStorage } from "../storage/LocalStorage";
import { MongoDBAdapter } from '../adapters/MongoDBAdapter/MongoDBAdapeter';

export const backup = async (dbtype: string) => {
    let adapter;
    if (dbtype === 'postgres') {
        adapter = new PostgresAdapter(process.env);
    }
    else if (dbtype === 'mongodb') {
        adapter = new MongoDBAdapter(process.env);
    }

    const storage = new LocalStorage(dbtype);

    const backupManager = new BackupManager(adapter, storage);

    const fileName = `backup-${Date.now()}.${dbtype === 'postgres' ? 'sql' : dbtype === 'mongodb' ? 'mongodb' : ''}`;
    console.log('Preparing backup...');

    await backupManager.run(fileName);
}