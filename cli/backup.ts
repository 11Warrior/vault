import 'dotenv/config';
import { BackupManager } from "../core/BackupManager";
import { LocalStorage } from "../storage/LocalStorage";
import { AdapterFactory } from '../factory/AdapterFactory';
import { getScheduler } from '../factory/SchedulerFactory';
import { SchedulerManager } from '../core/SchedulerManager';
import { Scheduler } from '../scheduler/Scheduler';
import { getPlatform } from '../utils/utils';

const platform = getPlatform();

export const backup = async (dbtype: string, interval: string = " ") => {

    const scheduler = getScheduler(platform, dbtype) as Scheduler;
    const adapter = AdapterFactory.getAdapter(dbtype);

    const storage = new LocalStorage(dbtype);
    const backupManager = new BackupManager(adapter, storage);

    const schedulerManager = new SchedulerManager(scheduler, interval);

    if (interval !== " ") {
        await schedulerManager.run();
    }

    const fileName = `backup-${Date.now()}.${dbtype === 'postgres' ? 'sql' : dbtype === 'mongodb' ? 'mongodb' : ' '}`;

    console.log('Preparing backup...');

    await backupManager.run(fileName);

    process.exit(0);
}