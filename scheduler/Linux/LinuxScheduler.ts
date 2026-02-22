import fs from 'fs'
import { Scheduler } from "../Scheduler";
import { execSync } from 'child_process';

export class LinuxScheduler implements Scheduler {
    constructor(private dbtype: string) { }

    async start(interval: string): Promise<void> {
        const dbtype = this.dbtype;
        const nodePath = process.execPath;

        const workDir = process.cwd();
        const entryPath = process.argv[1];

        const path = '/etc/systemd/system'

        const user = process.env.SUDO_USER || process.env.USER;

        if (!user) return;

        const serviceFile = `savr-${dbtype}.service`
        const timerFile = `savr-${dbtype}.timer`

        const serviceFileContent = `
            [Unit]
            Description=Run Autobackup 
            After=network.target

            [Service]
            Type=oneshot
            WorkingDirectory=${workDir}
            ExecStart=${nodePath} ${entryPath} backup ${dbtype}
            User=${user}

            [Install]
            WantedBy=multi-user.target
        `

        const timerFileContent = `
            [Unit]
            Description=Run autobackup service at time interval

            [Timer]
            OnBootSec=3min
            OnUnitInactiveSec=${interval}
            Persistent=true
            Unit=savr-${dbtype}.service

            [Install]
            WantedBy=timers.target
        `;


        fs.writeFileSync(`${path}/${serviceFile}`, serviceFileContent)
        fs.writeFileSync(`${path}/${timerFile}`, timerFileContent)

        execSync("systemctl daemon-reload");

        execSync(`systemctl enable ${timerFile}`);
        execSync(`systemctl start ${timerFile} `);

        execSync(`systemctl start ${serviceFile}`);
        
        console.log(`Autobackup enabled for ${dbtype}`);
    }

    async stop(): Promise<void> {
        //flow -> stop -> disable -> unlink -> reload
        const dbtype = this.dbtype;

        const timerFile = `savr-${dbtype}.timer`;
        const serviceFile = `savr-${dbtype}.service`;

        execSync(`systemctl stop ${timerFile} `);
        execSync(`systemctl disable ${timerFile} `);

        fs.unlinkSync(`/etc/systemd/system/${timerFile}`);
        fs.unlinkSync(`/etc/systemd/system/${serviceFile}`);

        execSync("systemctl daemon-reload");

        console.log(`Autobackup disabled for ${dbtype}`);
    }

    async status(): Promise<void> {
        const dbtype = this.dbtype;
        execSync(`systemctl status savr-${dbtype}.timer`);
    }
}