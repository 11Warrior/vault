import os from 'os'

function getTimeAndUnit(interval: string) {
    if (interval === " ") return null;

    const regex = /^(\d+)([hmd])$/i;

    const match = interval.match(regex);

    if (!match) {
        console.log("Unsupported interval type...");
        return null;
    }

    const time = parseInt(match?.[1] as string, 10);
    let unit = match[2] as string;

    if (time <= 0) {
        throw new Error("Please enter the positive time like 6d, 10m..")
    }

    return { time, unit };
}

export function ValidInterval(interval: string): (string | null) {
    const data = getTimeAndUnit(interval);

    if (!data) return null;

    const { unit, time } = data;

    switch (unit) {
        case "d":
            return `${time}d`
        case "h":
            return `${time}h`
        case "m":
            return `${time}min`
        default:
            return null;
    }
}

export function getPlatform() {
    return os.platform();
}

export function getScheduleForWindows(interval: string) {
    //data ccannot be null here -> validinterval -> scheduler -> getScheduleforwindows -> using any is safe 

    const { unit, time } = getTimeAndUnit(interval) as any;

    switch (unit) {
        case "d":
            return { 'type': SCHEDULE['d'], 'value': time }
        case "h":
            return { 'type': SCHEDULE['h'], 'value': time }
        case "m":
            return { 'type': SCHEDULE['m'], 'value': time }
        default:
            return null;
    }

}

enum SCHEDULE {
    'h' = 'HOURLY',
    'd' = 'DAILY',
    'm' = 'MINUTE'
}

