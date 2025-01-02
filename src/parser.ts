import {
    DEFAULT_CONFIG, LineTypes,
    LYRIC_LINE, TAG_LINE,
    ENHANCED_TIMESTAMP, ENHANCED_WORD_SPLITTER,
    type Config, type Lyric
} from "./constants";
import { timestampToMs } from "./utils";

/**
 * Parse LRC content
 * @param {string} lrc content
 * @param config parse configuration
 */
export function parseLrc(lrc: string, config?: Partial<Config>) {
    const lines = lrc.split('\n');
    const parsedLines: Lyric = [];
    const cfg: Config = { ...DEFAULT_CONFIG, ...config };

    lines.forEach((line, i) => {
        // lyric
        if (LYRIC_LINE.test(line)) {
            const [raw, time, lyric] = line.match(LYRIC_LINE) ?? [''];

            let timestamps = time.split('][');
            if (cfg.multiTime && timestamps.length > 1) {
                // multitime
                parsedLines.push({
                    line: i,
                    type: LineTypes.MultiTimeLyric,
                    timestamps: timestamps.map(timestamp => timestampToMs(timestamp)),
                    content: lyric,
                    raw,
                })
            }
            else
                timestamps.forEach(timestamp => {
                    // enhanced
                    if (cfg.enhanced && ENHANCED_TIMESTAMP.test(lyric)) {
                        let wordTimestamps = lyric.match(ENHANCED_TIMESTAMP) ?? [];
                        let wordTexts = lyric.split(ENHANCED_WORD_SPLITTER); wordTexts.shift();

                        const words = wordTexts.map((word, i) => {
                            let wordTimestamp = wordTimestamps[i];
                            return {
                                index: i,
                                timestamp: timestampToMs(wordTimestamp),
                                content: word,
                                raw: wordTimestamp + word,
                            };
                        });

                        parsedLines.push({
                            line: i,
                            type: LineTypes.EnhancedLyric,
                            timestamp: timestampToMs(timestamp),
                            words,
                            raw
                        })
                    }
                    // normal
                    else {
                        // multiline
                        let sameTimeIndex = parsedLines.findIndex(p =>
                            (p.type === LineTypes.Lyric || p.type === LineTypes.MultiLineLyric)
                            && p.timestamp === timestampToMs(timestamp)
                        );
                        if (cfg.multiLine && sameTimeIndex !== -1) {
                            let sameLine = parsedLines[sameTimeIndex];
                            if (sameLine.type === LineTypes.Lyric) {
                                parsedLines[sameTimeIndex] = {
                                    type: LineTypes.MultiLineLyric,
                                    timestamp: sameLine.timestamp,
                                    lines: [
                                        {
                                            line: sameLine.line,
                                            content: sameLine.content,
                                            raw: sameLine.raw
                                        },
                                        {
                                            line: i,
                                            content: lyric,
                                            raw
                                        }
                                    ],
                                    content: sameLine.content + '\n' + lyric
                                };
                            }
                            else if (sameLine.type === LineTypes.MultiLineLyric) {
                                sameLine.lines.push({
                                    line: i,
                                    content: lyric,
                                    raw
                                });
                                sameLine.content = sameLine.content + '\n' + lyric;
                            }
                        }
                        // simple
                        else
                            parsedLines.push({
                                line: i,
                                type: LineTypes.Lyric,
                                timestamp: timestampToMs(timestamp),
                                content: lyric,
                                raw
                            });
                    }
                })
        }
        // tag
        else if (TAG_LINE.test(line)) {
            const [raw, id, value] = line.match(TAG_LINE) ?? [''];
            parsedLines.push({
                line: i,
                type: LineTypes.Tag,
                id, value,
                raw
            })
        }
        // plain
        else {
            parsedLines.push({
                line: i,
                type: LineTypes.Plain,
                raw: line
            })
        }
    });
    return parsedLines;
}