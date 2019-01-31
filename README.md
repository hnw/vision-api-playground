# vision-api-playground

## Setup

```
$ npm i
```

Required packages:

- @google-cloud/vision
- dotenv
- yargs

## Configuration

Save credential JSON for accessing Cloud Vision API.

Copy `.env.example` to `.env` and rewrite JSON path.


## Usage

``` shell
$ node document-text-detection.js [--lang LANG] [filename]
```

## Example

``` shell
$ node document-text-detection.js resources/geotrust/04816.jpeg
Full text: 04816

Block confidence: 0.9900000095367432
Paragraph confidence: 0.9900000095367432
Word text: 04816
Word confidence: 0.9900000095367432
Symbol text: 0
Symbol confidence: 0.9900000095367432
Symbol text: 4
Symbol confidence: 0.9900000095367432
Symbol text: 8
Symbol confidence: 0.9900000095367432
Symbol text: 1
Symbol confidence: 0.9900000095367432
Symbol text: 6
Symbol confidence: 0.9900000095367432
```

