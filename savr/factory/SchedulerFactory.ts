import { LinuxScheduler } from "../scheduler/Linux/LinuxScheduler";
import { WindowsScheduler } from "../scheduler/Windows/WindowsScheduler";

export function getScheduler(platform: string, dbtype: string) {
   switch(platform) {
    case('linux') :
        return new LinuxScheduler(dbtype);
    case('win32') : 
        return new WindowsScheduler(dbtype);
    
    default:  
        console.log('Unsupported OS platform...');
   }
}