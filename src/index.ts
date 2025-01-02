import { parseLrc } from "./parser";
import { timestampToMs } from "./utils";
import {
    LineTypes, DEFAULT_CONFIG,
    type Config, type Lyric,
    type Line, type PlainLine,
    type TagLine, type LyricLine,
    type MultiLineLyric, type MultiLine,
    type EnhancedLine, type EnhancedWord,
    type MultiTimeLine
} from "./constants";

export {
    parseLrc, timestampToMs,
    LineTypes, DEFAULT_CONFIG,
    type Config, type Lyric,
    type Line, type PlainLine,
    type TagLine, type LyricLine,
    type MultiLineLyric, type MultiLine,
    type EnhancedLine, type EnhancedWord,
    type MultiTimeLine
};