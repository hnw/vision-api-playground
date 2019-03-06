require('dotenv').config();
const yargs = require('yargs')
      .demandCommand(1)
      .usage('Usage: $0 [options] [file]')
      .default('out', 'out.png')
      .describe('out', 'Language hints')
      .help()
      .version('0.0.1')
      .locale('en');
const argv = yargs.argv;
const cv = require('opencv4nodejs');

const img = cv.imread((argv._)[0])

// グレイスケール変換+モルフォロジー変換（ドット除去）
const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
const crKernel = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(2, 2));
const grayImg = img.bgrToGray()
      .morphologyEx(kernel, cv.MORPH_CLOSE)
      .erode(crKernel)

cv.imwrite(argv.out, grayImg);
