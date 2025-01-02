import { parseLrc } from "./parser";

test('plain line', () => {
    const lrc = `Just a basic line with text`;
    let parsed = [
        {
            line: 0,
            type: "plain",
            raw: "Just a basic line with text"
        }
    ]
    expect(parseLrc(lrc)).toEqual(parsed);
})

test('tag line', () => {
    const lrc = `[ti:Song Title]
[ar: Song Artist]`;
    let parsed = [
        {
            line: 0,
            type: "tag",
            id: "ti",
            value: "Song Title",
            raw: "[ti:Song Title]"
        },
        {
            line: 1,
            type: "tag",
            id: "ar",
            value: " Song Artist",
            raw: "[ar: Song Artist]"
        }
    ];
    expect(parseLrc(lrc)).toEqual(parsed);
})

test('lyric line', () => {
    const lrc = `[00:01.89]Simple lyric line`;
    let parsed = [
        {
            line: 0,
            type: "lyric",
            timestamp: 1890,
            content: "Simple lyric line",
            raw: "[00:01.89]Simple lyric line"
        }
    ];
    expect(parseLrc(lrc)).toEqual(parsed);
})

test('multi time line used the type', () => {
    const lrc = `[00:02.83][01:27.23]Lyric line with multiple timestamp`;
    let parsed = [
        {
            line: 0,
            type: "multitime_lyric",
            timestamps: [2830, 87230],
            content: "Lyric line with multiple timestamp",
            raw: "[00:02.83][01:27.23]Lyric line with multiple timestamp"
        }
    ];
    expect(parseLrc(lrc, { multiTime: true })).toEqual(parsed);
})

test('multi time line with default type', () => {
    const lrc = `[00:02.83][01:27.23]Lyric line with multiple timestamp`;
    let parsed = [
        {
            line: 0,
            type: "lyric",
            timestamp: 2830,
            content: "Lyric line with multiple timestamp",
            raw: "[00:02.83][01:27.23]Lyric line with multiple timestamp"
        },
        {
            line: 0,
            type: "lyric",
            timestamp: 87230,
            content: "Lyric line with multiple timestamp",
            raw: "[00:02.83][01:27.23]Lyric line with multiple timestamp"
        }
    ];
    expect(parseLrc(lrc)).toEqual(parsed);
})

test('multi line', () => {
    const lrc = `[01:26.34]First line
[01:26.34]Second line
[01:26.34]Third line`;
    let parsed = [
        {
            type: "multiline_lyric",
            timestamp: 86340,
            lines: [
                {
                    line: 0,
                    content: "First line",
                    raw: "[01:26.34]First line"
                },
                {
                    line: 1,
                    content: "Second line",
                    raw: "[01:26.34]Second line"
                },
                {
                    line: 2,
                    content: "Third line",
                    raw: "[01:26.34]Third line"
                }
            ],
            content: "First line\nSecond line\nThird line"
        }
    ];
    expect(parseLrc(lrc)).toEqual(parsed);
})

test('enhanced line', () => {
    const lrc = `[02:34.829] <02:35> Word <02:35.98> by <02:37.12> word`;
    let parsed = [
        {
            line: 0,
            type: "enhanced_lyric",
            timestamp: 154829,
            words: [
                {
                    index: 0,
                    timestamp: 155000,
                    content: " Word ",
                    raw: "<02:35> Word "
                },
                {
                    index: 1,
                    timestamp: 155980,
                    content: " by ",
                    raw: "<02:35.98> by "
                },
                {
                    index: 2,
                    timestamp: 157120,
                    content: " word",
                    raw: "<02:37.12> word"
                }
            ],
            raw: "[02:34.829] <02:35> Word <02:35.98> by <02:37.12> word"
        }
    ]
    expect(parseLrc(lrc)).toEqual(parsed);
})

test('parsing full lyric with mixed line types', () => {
    const lyric =
        `[ti: Song Title]
[ar: The Best Artist]
Plain text goes bluah

[00:00.92][01:24.92][02:23.21]Lyric line with many timestamp
[00:02.86]Just a normal lyric line
[00:05.23]First multiline lyric
[00:05.23]Second multiline lyric
[00:05.23]Third multiline lyric
[01:28.00] <01:28.78> Enhanced <01:29.45> lyric <01:31.22> word <01:35.29> by word`;
    const parsedLyric = [
        {
            line: 0,
            type: "tag",
            id: "ti",
            value: " Song Title",
            raw: "[ti: Song Title]"
        },
        {
            line: 1,
            type: "tag",
            id: "ar",
            value: " The Best Artist",
            raw: "[ar: The Best Artist]"
        },
        {
            line: 2,
            type: "plain",
            raw: "Plain text goes bluah"
        },
        {
            line: 3,
            type: "plain",
            raw: ""
        },
        {
            line: 4,
            type: "lyric",
            timestamp: 920,
            content: "Lyric line with many timestamp",
            raw: "[00:00.92][01:24.92][02:23.21]Lyric line with many timestamp"
        },
        {
            content: "Lyric line with many timestamp",
            line: 4,
            raw: "[00:00.92][01:24.92][02:23.21]Lyric line with many timestamp",
            timestamp: 84920,
            type: "lyric"
        },
        {
            content: "Lyric line with many timestamp",
            line: 4,
            raw: "[00:00.92][01:24.92][02:23.21]Lyric line with many timestamp",
            timestamp: 143210,
            type: "lyric"
        },
        {
            line: 5,
            type: "lyric",
            timestamp: 2860,
            content: "Just a normal lyric line",
            raw: "[00:02.86]Just a normal lyric line"
        },
        {
            type: "multiline_lyric",
            timestamp: 5230,
            lines: [
                {
                    line: 6,
                    content: "First multiline lyric",
                    raw: "[00:05.23]First multiline lyric"
                },
                {
                    line: 7,
                    content: "Second multiline lyric",
                    raw: "[00:05.23]Second multiline lyric"
                },
                {
                    line: 8,
                    content: "Third multiline lyric",
                    raw: "[00:05.23]Third multiline lyric"
                }
            ],
            content: "First multiline lyric\nSecond multiline lyric\nThird multiline lyric"
        },
        {
            line: 9,
            raw: "[01:28.00] <01:28.78> Enhanced <01:29.45> lyric <01:31.22> word <01:35.29> by word",
            timestamp: 88000,
            type: "enhanced_lyric",
            words: [
                {
                    content: " Enhanced ",
                    index: 0,
                    raw: "<01:28.78> Enhanced ",
                    timestamp: 88780
                },
                {
                    content: " lyric ",
                    index: 1,
                    raw: "<01:29.45> lyric ",
                    timestamp: 89450
                },
                {
                    content: " word ",
                    index: 2,
                    raw: "<01:31.22> word ",
                    timestamp: 91220
                },
                {
                    content: " by word",
                    index: 3,
                    raw: "<01:35.29> by word",
                    timestamp: 95290
                },
            ],
        },
    ];
    expect(parseLrc(lyric)).toEqual(parsedLyric);
})