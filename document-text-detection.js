require('dotenv').config();
const yargs = require('yargs')
      .demandCommand(1)
      .usage('Usage: $0 [options]')
      .default('lang', 'en')
      .describe('lang', 'Language hints')
      .help()
      .version('0.0.1')
      .locale('en');
const argv = yargs.argv;

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision')

// Creates a client
const client = new vision.ImageAnnotatorClient();

(async () => {
  // Read a local image as a text document
  let request = {
    "image": {
      "source": {
        filename: (argv._)[0],
      }
    },
    "imageContext": {
      "languageHints": [
        argv.lang
      ]
    }
  };
  const [result] = await client.documentTextDetection(request);
  const fullTextAnnotation = result.fullTextAnnotation;
  console.log(`Full text: ${fullTextAnnotation.text}`);
  fullTextAnnotation.pages.forEach(page => {
    page.blocks.forEach(block => {
      console.log(`Block confidence: ${block.confidence}`);
      block.paragraphs.forEach(paragraph => {
        console.log(`Paragraph confidence: ${paragraph.confidence}`);
        paragraph.words.forEach(word => {
          const wordText = word.symbols.map(s => s.text).join('');
          console.log(`Word text: ${wordText}`);
          console.log(`Word confidence: ${word.confidence}`);
          word.symbols.forEach(symbol => {
            console.log(`Symbol text: ${symbol.text}`);
            console.log(`Symbol confidence: ${symbol.confidence}`);
          });
        });
      });
    });
  });
})();
