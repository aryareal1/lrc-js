# LRC-JS

Parse LRC into javascript object.

## Features

- Typescript support
- Browser and Node.js support
- Default and enchanced LRC format support
- Simple usage yet powerfull

## Installation & Usage

Type this to install:

```sh
npm install @aryareal1/lrc-js
```

Here is the example usage:

```js
import { parseLrc } from "lrc-js";

let lyric = `[ti: Song Title]
[ar: The Best Artist]
Plain text goes bluah

[00:00.92][01:24.92][02:23.21]Lyric line with many timestamp
[00:02.86]Just a normal lyric line
[00:04.55][interlude]
[00:05.23]First multiline lyric
[00:05.23]Second multiline lyric
[00:05.23]Third multiline lyric
[01:28.00] <01:28.78> Enhanced <01:29.45> lyric <01:31.22> word <01:35.29> by word`;

console.log(parseLrc(lyric));
```

The output will be:

```json
[
  {
    "line": 0,
    "type": "metadata",
    "key": "ti",
    "value": " Song Title",
    "raw": "[ti: Song Title]"
  },
  {
    "line": 1,
    "type": "metadata",
    "key": "ar",
    "value": " The Best Artist",
    "raw": "[ar: The Best Artist]"
  },
  {
    "line": 2,
    "type": "plain",
    "raw": "Plain text goes bluah"
  },
  {
    "line": 3,
    "type": "plain",
    "raw": ""
  },
  {
    "line": 4,
    "type": "lyric",
    "timestamp": 920,
    "content": "Lyric line with many timestamp",
    "raw": "[00:00.92][01:24.92][02:23.21]Lyric line with many timestamp"
  },
  {
    "line": 4,
    "type": "lyric",
    "timestamp": 84920,
    "content": "Lyric line with many timestamp",
    "raw": "[00:00.92][01:24.92][02:23.21]Lyric line with many timestamp"
  },
  {
    "line": 4,
    "type": "lyric",
    "timestamp": 143210,
    "content": "Lyric line with many timestamp",
    "raw": "[00:00.92][01:24.92][02:23.21]Lyric line with many timestamp"
  },
  {
    "line": 5,
    "type": "lyric",
    "timestamp": 2860,
    "content": "Just a normal lyric line",
    "raw": "[00:02.86]Just a normal lyric line"
  },
  {
    "line": 6,
    "type": "instrument",
    "timestamp": 4550,
    "part": "interlude",
    "raw": "[00:04.55][interlude]"
  },
  {
    "type": "multi_lyric",
    "timestamp": 5230,
    "lines": [
      {
        "line": 7,
        "content": "First multiline lyric",
        "raw": "[00:05.23]First multiline lyric"
      },
      {
        "line": 8,
        "content": "Second multiline lyric",
        "raw": "[00:05.23]Second multiline lyric"
      },
      {
        "line": 9,
        "content": "Third multiline lyric",
        "raw": "[00:05.23]Third multiline lyric"
      }
    ],
    "content": "First multiline lyric\nSecond multiline lyric\nThird multiline lyric"
  },
  {
    "line": 10,
    "type": "enhanced_lyric",
    "timestamp": 88000,
    "words": [
      {
        "index": 0,
        "timestamp": 88780,
        "content": " Enhanced ",
        "raw": "<01:28.78> Enhanced "
      },
      {
        "index": 1,
        "timestamp": 89450,
        "content": " lyric ",
        "raw": "<01:29.45> lyric "
      },
      {
        "index": 2,
        "timestamp": 91220,
        "content": " word ",
        "raw": "<01:31.22> word "
      },
      {
        "index": 3,
        "timestamp": 95290,
        "content": " by word",
        "raw": "<01:35.29> by word"
      }
    ],
    "raw": "[01:28.00] <01:28.78> Enhanced <01:29.45> lyric <01:31.22> word <01:35.29> by word"
  }
]
```

## Types of Line

### Plain Line

Line with just plain text

```
Just a basic line with text
```

<details>
  <summary>Output</summary>
  
  ```json
  [
    {
      "line": 0,
      "type": "plain",
      "raw": "Just a basic line with text"
    }
  ]
  ```
</details>

### Metadata Line

Line with tag or metadata format

```
[ti:Song Title]
[ar: Song Artist]
```

<details>
  <summary>Ouput</summary>
  
  ```json
  [
    {
      "line": 0,
      "type": "metadata",
      "key": "ti",
      "value": "Song Title",
      "raw": "[ti:Song Title]"
    },
    {
      "line": 1,
      "type": "metadata",
      "key": "ar",
      "value": " Song Artist",
      "raw": "[ar: Song Artist]"
    }
  ]
  ```
</details>

### Lyric Line

Default lyric line with timestamp

```
[00:01.89]Simple lyric line
```

<details>
  <summary>Output</summary>
   
  ```json
  [
    {
      "line": 0,
      "type": "lyric",
      "timestamp": 1890,
      "content": "Simple lyric line",
      "raw": "[00:01.89]Simple lyric line"
    }
  ]
  ```
</details>

### Repeated Lyric Line

Lyric line with multiple timestamps to make repeated lyric.

> [!IMPORTANT]
> This type is not used by default, `config.repeatedLyric` must be `true` to use this.
> See output below.

```
[00:02.83][01:27.23]Lyric line with multiple timestamp
```

<details>
  <summary>Output</summary>
  
  If `config.repeatedLyric` is `true`:
  ```json
  [
    {
      "line": 0,
      "type": "repeated_lyric",
      "timestamps": [ 2830, 87230 ],
      "content": "Lyric line with multiple timestamp",
      "raw": "[00:02.83][01:27.23]Lyric line with multiple timestamp"
    }
  ]
  ```
  Otherwise:
  ```json
  [
    {
      "line": 0,
      "type": "lyric",
      "timestamp": 2830,
      "content": "Lyric line with multiple timestamp",
      "raw": "[00:02.83][01:27.23]Lyric line with multiple timestamp"
    },
    {
      "line": 0,
      "type": "lyric",
      "timestamp": 87230,
      "content": "Lyric line with multiple timestamp",
      "raw": "[00:02.83][01:27.23]Lyric line with multiple timestamp"
    }
  ]
  ```
</details>

### Multi Lyric Line

Merges multiple lyric lines with same timestamps into one index in the array.

> [!NOTE]
> You can turn this off by setting `config.multiLyric` to `false` and it'll return default LyricLine

```
[01:26.34]First line
[01:26.34]Second line
[01:26.34]Third line
```

<details>
  <summary>Output</summary>

```json
[
  {
    "type": "multi_lyric",
    "timestamp": 86340,
    "lines": [
      {
        "line": 0,
        "content": "First line",
        "raw": "[01:26.34]First line"
      },
      {
        "line": 1,
        "content": "Second line",
        "raw": "[01:26.34]Second line"
      },
      {
        "line": 2,
        "content": "Third line",
        "raw": "[01:26.34]Third line"
      }
    ],
    "content": "First line\nSecond line\nThird line"
  }
]
```

</details>

### Enhanced Lyric Line

Lyric line that support per word sync.

> [!NOTE]
> You can turn this off by setting `config.enhancedLyric` to `false` and it'll return default LyricLine

```
[02:34.829] <02:35> Word <02:35.98> by <02:37.12> word
```

<details>
  <summary>Output</summary>

```json
[
  {
    "line": 0,
    "type": "enhanced_lyric",
    "timestamp": 154829,
    "words": [
      {
        "index": 0,
        "timestamp": 155000,
        "content": " Word ",
        "raw": "<02:35> Word "
      },
      {
        "index": 1,
        "timestamp": 155980,
        "content": " by ",
        "raw": "<02:35.98> by "
      },
      {
        "index": 2,
        "timestamp": 157120,
        "content": " word",
        "raw": "<02:37.12> word"
      }
    ],
    "raw": "[02:34.829] <02:35> Word <02:35.98> by <02:37.12> word"
  }
]
```

</details>

### Instrument Line

Line with timestamp but no lyric, like interlude in a music

```
[00:00.00][intro]
[02:43.23]
[03:32.82][interlude]
[04:22.34][outro]
```

<details>
  <summary>Output</summary>

```json
[
  {
    "line": 0,
    "type": "instrument",
    "timestamp": 0,
    "part": "intro",
    "raw": "[00:00.00][intro]"
  },
  {
    "line": 1,
    "type": "instrument",
    "timestamp": 163230,
    "part": "interlude",
    "raw": "[02:43.23]"
  },
  {
    "line": 2,
    "type": "instrument",
    "timestamp": 212820,
    "part": "interlude",
    "raw": "[03:32.82][interlude]"
  },
  {
    "line": 3,
    "type": "instrument",
    "timestamp": 262340,
    "part": "outro",
    "raw": "[04:22.34][outro]"
  }
]
```

</details>

## Reference

### Ⓕ parseLrc(lrc: string, config: IConfig)

Main function to parse LRC content

### Ⓔ LineType

Types of line: [^](#types-of-line)

- `LineType.Plain` just a plain text line.
- `LineType.Tag` metadata tag line.
- `LineType.Lyric` simple lyric line.
- `LineType.EnhancedLyric` enhanced lyric line or lyric that sync per word.
- `LineType.MultiLineLyric` merge of lines with same timestamp.
- `LineType.MultiTimeLyric` lyric line with multiple timestamps, <ins>not used</ins> by default.
- `LineType.Instrument` line with timestamp but no lyric

### Ⓘ IConfig

Parser configuration

- `IConfig.enhancedLyric: boolean` enable parse for enhanced format (default: `true`)
- `IConfig.multiLyric: boolean` merge lines with same timestamp into one index (default: `true`)
- `IConfig.repeatedLyric: boolean` make line with multiple timestamp into one index instead of multiple index (default: `false`)
