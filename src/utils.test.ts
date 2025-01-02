import { msToTimestamp, timestampToMs } from "./utils"

test('convert timestamp to milsecs', () => {
    expect(timestampToMs('1:23.456')).toEqual(83456);
})

test('convert ms to timestamp', () => {
    expect(msToTimestamp(1234)).toEqual('0:01.234')
})