import 'dotenv/config';
import os from 'os';
import { BackupManager } from "../core/BackupManager";
import { LocalStorage } from "../storage/LocalStorage";
import { AdapterFactory } from '../factory/AdapterFactory';
import { getScheduler } from '../factory/SchedulerFactory';

const platform = os.platform();

export const backup = async (dbtype: string, interval: number = 0) => {

    const storage = new LocalStorage(dbtype);

    const adapter = AdapterFactory.getAdapter(dbtype);

    const backupManager = new BackupManager(adapter, storage);


    const fileName = `backup-${Date.now()}.${dbtype === 'postgres' ? 'sql' : dbtype === 'mongodb' ? 'mongodb' : ''}`;
    console.log('Preparing backup...');

    if (interval !== 0) {
        //auto backup flow goes here
        const scheduler = getScheduler(platform);
        if (!scheduler) return;

        scheduler.start(dbtype, interval);
    }

    await backupManager.run(fileName);
}