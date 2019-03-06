require('dotenv').config();
const yargs = require('yargs')
      .demandCommand(1)
      .usage('Usage: $0 [options] [file]')
      .option('output', {
        alias: 'o',
        default: 'out.png',
        describe: 'Write to FILE instead of stdout'
      })
      .help()
      .version('0.0.1')
      .locale('en');
const argv = yargs.argv;
const cv = require('opencv4nodejs');

const img = cv.imread((argv._)[0])

// グレイスケール変換+膨張処理（白黒反転してるので英語と逆）
const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
const grayImg = img.bgrToGray().erode(kernel);

// 二値化
const binImg = grayImg.adaptiveThreshold(255, cv.ADAPTIVE_THRESH_MEAN_C,
                                         cv.THRESH_BINARY, 11, 2);

// 輪郭抽出
const contours = binImg.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

let nOuterContours = 0;
let lastContourId = -1;
const rescaledImgs = []

// 第一階層の輪郭を取りだし
contours.forEach((cnt, i) => {
  const parentId = cnt.hierarchy.z;
  if (parentId >= 0) {
    return;
  }
  nOuterContours++;
  lastContourId = i;
  const rect = cnt.boundingRect();
  if (rect.width > (img.cols * 0.8) || rect.height > (img.rows * 0.8)) {
    return;
  }
  const croppedImg = grayImg.getRegion(rect.pad(1.1))
  rescaledImgs.push([rect.x, croppedImg.rescale(img.rows/croppedImg.rows)]);
});

// 第一階層の輪郭が1つかつ大きすぎる場合（おそらく画像外周が取れた）
// 第二階層を取り出す
if (rescaledImgs.length == 0) {
  contours.forEach((cnt, i) => {
    const parentId = cnt.hierarchy.z;
    if (parentId != lastContourId) {
      return;
    }
    const rect = cnt.boundingRect();
    if (rect.width > (img.cols * 0.8) || rect.height > (img.rows * 0.8)) {
      return;
    }
    const croppedImg = grayImg.getRegion(rect.pad(1.1))
    rescaledImgs.push([rect.x, croppedImg.rescale(img.rows/croppedImg.rows)]);
  });
}

let height = 0;
let width = 0;
for (let [k, rImg] of rescaledImgs) {
  if (height < rImg.rows) {
    height = rImg.rows
  }
  width += rImg.cols;
}
const newImg = new cv.Mat(height, width, cv.CV_8UC1);
let x = 0
let y = 0;

var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
rescaledImgs.sort(collator.compare).forEach(([k, rImg]) => {
  rImg.copyTo(newImg.getRegion(new cv.Rect(x, y, rImg.cols, rImg.rows)));
  x += rImg.cols;
});

cv.imwrite(argv.output, newImg);
