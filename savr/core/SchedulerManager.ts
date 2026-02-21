import { Scheduler } from "../scheduler/Scheduler";
import { ValidInterval } from "../utils/utils";

export class SchedulerManager {
    constructor(private scheduler: Scheduler, private interval: string) { }

    async run() {
        const scheduler = this.scheduler;
        const interval = this.interval;

        if (interval === "0") {
            await scheduler.stop();
            process.exit(0)
        }

        if (interval && interval.trim().length > 0) {
            const validInterval = ValidInterval(interval);

            if (validInterval) {
                //auto backup flow goes here
                await scheduler.start(validInterval);
            }
            
            process.exit(0);
        }
    }
}