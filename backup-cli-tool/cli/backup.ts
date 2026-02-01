import 'dotenv/config';
import { PostgresAdapter } from "../adapters/PostgresAdapter/PostgresAdapter"
import { BackupManager } from "../core/BackupManager";
import { LocalStorage } from "../storage/LocalStorage";

export const backup = async () => {

    const adapter = new PostgresAdapter(process.env);
    const storage = new LocalStorage();

    const manager = new BackupManager(adapter, storage);

    const fileName = `backup-${Date.now()}.enc`;

    await manager.run(fileName);
}