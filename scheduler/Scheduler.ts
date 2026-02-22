export interface Scheduler {
    start(interval: string): Promise<void>,
    stop(): Promise<void>,
    status(): Promise<void>
}