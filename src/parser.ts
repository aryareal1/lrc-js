import {
    DEFAULT_CONFIG, LineTypes,
    LYRIC_LINE, METADATA_LINE,
    ENHANCED_TIMESTAMP, ENHANCED_WORD_SPLITTER,
    INSTRUMENT_PART,
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
            // repeated
            if (cfg.repeatedLyric && timestamps.length > 1) {
                parsedLines.push({
                    line: i,
                    type: LineTypes.RepeatedLyric,
                    timestamps: timestamps.map(timestamp => timestampToMs(timestamp)),
                    content: lyric,
                    raw,
                })
            }
            else
                timestamps.forEach(timestamp => {
                    // intrument
                    if (!lyric || INSTRUMENT_PART.test(lyric)) {
                        const [_, part] = lyric.match(INSTRUMENT_PART) ?? []
                        parsedLines.push({
                            line: i,
                            type: LineTypes.Instrument,
                            timestamp: timestampToMs(timestamp),
                            part: lyric ? part : 'interlude',
                            raw
                        });
                    }
                    // enhanced
                    else if (cfg.enhancedLyric && ENHANCED_TIMESTAMP.test(lyric)) {
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
                        // multi
                        let sameTimeIndex = parsedLines.findIndex(p =>
                            (p.type === LineTypes.Lyric || p.type === LineTypes.MultiLyric)
                            && p.timestamp === timestampToMs(timestamp)
                        );
                        if (cfg.multiLyric && sameTimeIndex !== -1) {
                            let sameLine = parsedLines[sameTimeIndex];
                            if (sameLine.type === LineTypes.Lyric) {
                                parsedLines[sameTimeIndex] = {
                                    type: LineTypes.MultiLyric,
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
                            else if (sameLine.type === LineTypes.MultiLyric) {
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
        else if (METADATA_LINE.test(line)) {
            const [raw, key, value] = line.match(METADATA_LINE) ?? [''];
            parsedLines.push({
                line: i,
                type: LineTypes.Metadata,
                key, value,
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