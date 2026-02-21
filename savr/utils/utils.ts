import { store } from "./globalstore";

export function ValidInterval(interval: string): (string | null) {
    if (interval === " ") return null;

    const regex = /^(\d+)([hmd])$/i;

    const match = interval.match(regex);
    // console.log(match)

    if (!match) {
        console.log("Unsupported interval type...");
        return null;
    }

    const time = parseInt(match?.[1] as string, 10);
    let unit = match[2] as string;
    // console.log("In ValidInterval meth : time " + time + " unit" + unit);

    if (time <= 0) {
        throw new Error("Please enter the positive time like 6d, 10m..")
    }

    store.interval = {
        time,
        unit
    };


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

