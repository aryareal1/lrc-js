export const DEFAULT_CONFIG: Config = {
    enhanced: true,
    multiLine: true,
    multiTime: false
};

// RegExp
export const TIMESTAMP = /(\d{1,}):(\d{2})(?:\.(\d{1,3}))?/;
export const TAG_LINE = /^\[(.+?):(.*?)\]$/;
export const LYRIC_LINE = /^((?:\[(?:\d{1,}):(?:\d{2})(?:\.(?:\d{1,3}))?\])+)(.*)$/;
export const ENHANCED_TIMESTAMP = /<(\d{1,}):(\d{2})(?:\.(\d{1,3}))?>/g;
export const ENHANCED_WORD_SPLITTER = /<(?:\d{1,}):(?:\d{2})(?:\.(?:\d{1,3}))?>/g;

/** Types of line */
export enum LineTypes {
    Plain = 'plain',
    Tag = 'tag',
    Lyric = 'lyric',
    EnhancedLyric = 'enhanced_lyric',
    MultiLineLyric = 'multiline_lyric',
    MultiTimeLyric = 'multitime_lyric'
}

// Types
export type Lyric = Array<PlainLine | TagLine | LyricLine | EnhancedLine | MultiLineLyric | MultiTimeLine>;

export interface Line<T extends LineTypes> {
    line: number
    type: T
    raw: string
}

export interface PlainLine extends Line<LineTypes.Plain> { }

export interface TagLine extends Line<LineTypes.Tag> {
    id: string
    value: string
}

export interface LyricLine extends Line<LineTypes.Lyric> {
    timestamp: number
    content: string
}

export interface EnhancedLine extends Line<LineTypes.EnhancedLyric> {
    timestamp: number
    words: Array<EnhancedWord>
}
export interface EnhancedWord {
    index: number
    timestamp: number
    content: string
    raw: string
}

export interface MultiLineLyric {
    type: LineTypes.MultiLineLyric
    timestamp: number
    lines: Array<MultiLine>
    content: string
}
export interface MultiLine {
    line: number
    content: string
    raw: string
}

export interface MultiTimeLine extends Line<LineTypes.MultiTimeLyric> {
    timestamps: number[]
    content: string
}

export interface Config {
    /**
     * Merge lines with same timestamp into one index in the array
     * @default true
    */
    multiLine: boolean
    /**
     * Enable parsing enhanced LRC format
     * @default true
     */
    enhanced: boolean
    /**
     * Make lines with multiple timestamp in one index instead
     * of multiple index in the array
     * @default false
     */
    multiTime: boolean
}