import 'dotenv/config';
import { PostgresAdapter } from "../adapters/PostgresAdapter/PostgresAdapter"
import { BackupManager } from "../core/BackupManager";
import { LocalStorage } from "../storage/LocalStorage";

export const backup = async (dbtype : string) => {
    const adapter = new PostgresAdapter(process.env);

    const storage = new LocalStorage(dbtype);

    const backupManager = new BackupManager(adapter, storage);

    const fileName = `backup-${Date.now()}.sql`;
    console.log('Preparing backup...');
    
    await backupManager.run(fileName);
}