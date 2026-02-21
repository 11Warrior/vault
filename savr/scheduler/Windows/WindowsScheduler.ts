import { exec, execSync } from "child_process";
import { Scheduler } from "../Scheduler";
import { getScheduleForWindows } from "../../utils/utils";

export class WindowsScheduler implements Scheduler {
    constructor(private dbtype: string) { }

    async start(interval: string): Promise<void> {
        const dbtype = this.dbtype;

        const nodePath = execSync("where node").toString().trim();
        const entryPath = process.argv[1];
        const serviceFile = `savr-${dbtype}`

        const schedulerData = getScheduleForWindows(interval);
        const WorkingDirectory = process.cwd();

        if (!schedulerData) return;

        //type : HOURLY, MINUTE or DAILY value as 3 , 5 
        const { type, value } = schedulerData;


        const command = `schtasks /Create ` +
            `/SC ${type} ` +
            `/MO ${value} ` +
            `/TN "${serviceFile}" ` +
            `/TR "cmd /c \\"cd /d ${WorkingDirectory} && ${nodePath} ${entryPath} backup ${dbtype}\\"" ` +
            `/RL HIGHEST ` +
            `/Z ` +
            `/F`;

        execSync(command);

        console.log(`Autobackup enabled for ${dbtype}`);

    }

    async stop(): Promise<void> {
        const dbtype = this.dbtype;
        const serviceFile = `savr-${dbtype}`

        const command = `schtasks /Delete /TN ${serviceFile} /F`
        execSync(command);

        console.log(`Autobackup disabled for ${dbtype}`);
    }

    async status(): Promise<void> {
        const dbtype = this.dbtype;
        const serviceFile = `savr-${dbtype}`;

        execSync(`schtasks /Query /TN "${serviceFile}"`);

    }
}