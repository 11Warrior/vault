import { MongoDBAdapter } from "../adapters/MongoDBAdapter/MongoDBAdapeter";
import { PostgresAdapter } from "../adapters/PostgresAdapter/PostgresAdapter";

export class AdapterFactory {
    static getAdapter(dbtype: string) {
        if (dbtype === 'postgres') {
            return new PostgresAdapter(process.env);
        }
        else if (dbtype === 'mongodb') {
            return new MongoDBAdapter(process.env);
        }
    }
}

