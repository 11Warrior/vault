import { Readable } from "stream";

export interface Adapter {
    testConnection(): Promise<void>,
    backup(): Readable,
    restore(file: Readable): Promise<void>
}