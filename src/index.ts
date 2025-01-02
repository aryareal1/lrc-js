import { parseLrc } from "./parser";
import { timestampToMs } from "./utils";
import {
    LineTypes, DEFAULT_CONFIG,
    type Config, type Lyric,
    type Line, type PlainLine,
    type MetadataLine, type LyricLine,
    type MultiLyricLine, type MultiLyric,
    type EnhancedLyricLine, type EnhancedWord,
    type RepeatedLyricLine, type InstrumentLine
} from "./constants";

export {
    parseLrc, timestampToMs,
    LineTypes, DEFAULT_CONFIG,
    type Config, type Lyric,
    type Line, type PlainLine,
    type MetadataLine, type LyricLine,
    type MultiLyricLine, type MultiLyric,
    type EnhancedLyricLine, type EnhancedWord,
    type RepeatedLyricLine, type InstrumentLine
};