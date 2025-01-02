export const DEFAULT_CONFIG: Config = {
    enhancedLyric: true,
    multiLyric: true,
    repeatedLyric: false
};

// RegExp
export const TIMESTAMP = /(\d{1,}):(\d{2})(?:\.(\d{1,3}))?/;
export const METADATA_LINE = /^\[(.+?):(.*?)\]$/;
export const LYRIC_LINE = /^((?:\[(?:\d{1,}):(?:\d{2})(?:\.(?:\d{1,3}))?\])+)(.*)$/;
export const ENHANCED_TIMESTAMP = /<(\d{1,}):(\d{2})(?:\.(\d{1,3}))?>/g;
export const ENHANCED_WORD_SPLITTER = /<(?:\d{1,}):(?:\d{2})(?:\.(?:\d{1,3}))?>/g;
export const INSTRUMENT_PART = /^\[([^[\]]+?)\]$/;

/** Types of line */
export enum LineTypes {
    Plain = 'plain',
    Metadata = 'metadata',
    Lyric = 'lyric',
    MultiLyric = 'multi_lyric',
    RepeatedLyric = 'repeated_lyric',
    EnhancedLyric = 'enhanced_lyric',
    Instrument = 'instrument'
}

// Types
export type Lyric = Array<
    PlainLine
    | MetadataLine
    | LyricLine
    | MultiLyricLine
    | RepeatedLyricLine
    | EnhancedLyricLine
    | InstrumentLine>;

export interface Line<T extends LineTypes> {
    line: number
    type: T
    raw: string
}

export interface PlainLine extends Line<LineTypes.Plain> { }

export interface MetadataLine extends Line<LineTypes.Metadata> {
    key: string
    value: string
}

export interface LyricLine extends Line<LineTypes.Lyric> {
    timestamp: number
    content: string
}

export interface MultiLyricLine {
    type: LineTypes.MultiLyric
    timestamp: number
    lines: Array<MultiLyric>
    content: string
}
export interface MultiLyric {
    line: number
    content: string
    raw: string
}

export interface RepeatedLyricLine extends Line<LineTypes.RepeatedLyric> {
    timestamps: number[]
    content: string
}

export interface EnhancedLyricLine extends Line<LineTypes.EnhancedLyric> {
    timestamp: number
    words: Array<EnhancedWord>
}
export interface EnhancedWord {
    index: number
    timestamp: number
    content: string
    raw: string
}

export interface InstrumentLine extends Line<LineTypes.Instrument> {
    timestamp: number
    part: string
}

export interface Config {
    /**
     * Merge lines with same timestamp into one index in the array
     * @default true
    */
    multiLyric: boolean
    /**
     * Make lines with multiple timestamp in one index instead
     * of multiple index in the array
     * @default false
     */
    repeatedLyric: boolean
    /**
     * Enable parsing enhanced LRC format
     * @default true
     */
    enhancedLyric: boolean
}