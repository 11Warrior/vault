import { Scheduler } from "../Scheduler";

export class WindowsScheduler implements Scheduler {
    async start(dbtype: string, interval: number): Promise<void> {
        const serviceFile = `savr-${dbtype}`
    }

    async stop(dbtype: string): Promise<void> {

    }

    async status(): Promise<void> {


    }
}