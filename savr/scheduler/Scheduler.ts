export interface Scheduler {
    start(dbtype: string, interval: number): Promise<void>,
    stop(dbtype: string): Promise<void>,
    status(dbtype: string): Promise<void>
}