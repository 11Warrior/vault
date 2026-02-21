import { execSync } from "child_process";
import { Scheduler } from "../Scheduler";

export class WindowsScheduler implements Scheduler {
    constructor(private dbtype: string) { }

    async start(interval: string): Promise<void> {
        const nodePath = execSync("which node")
        const entryPath = process.argv[1];

        const command = `schtasks \CREATE 
            \RI 
        
        
        
        `

    }

    async stop(): Promise<void> {

        
    }

    async status(): Promise<void> {


    }
}