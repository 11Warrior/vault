import { LinuxScheduler } from "../scheduler/Linux/SystemdScheduler";
import { WindowsScheduler } from "../scheduler/Windows/WindowsScheduler";

export function getScheduler(platform: string) {
   switch(platform) {
    case('linux') :
        return new LinuxScheduler();
    case('win32') : 
        return new WindowsScheduler();
    
    default:  
        console.log('Unsupported OS platform...');
   }
}