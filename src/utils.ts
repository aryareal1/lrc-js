import { TIMESTAMP } from "./constants";

/**
 * Convert timestamp to millisexonds
 * @param time timestamp
 */
export function timestampToMs(time: string) {
    let [_, mm, ss, xx] = time.match(TIMESTAMP) ?? [];
    if (xx) xx = xx.padEnd(3, '0');
    return (+mm * 60 + +ss) * 1000 + (+xx || 0);
};
/**
 * Convert millisecond to timestamp
 * @param ms milliseconds
 */
export function msToTimestamp(ms: number) {
    let mm = Math.floor(ms / 60 / 1000),
        ss = Math.floor((ms / 1000)) % 60,
        xx = ms % 1000;
    return `${mm}:${(''+ss).padStart(2, '0')}.${xx}`;
}