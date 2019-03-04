const cv = require('opencv4nodejs');

//const img = cv.imread('resources/cdy/14435B.bmp');
//const img = cv.imread('resources/cdy/5Q1273.bmp');
//const img = cv.imread('resources/lw-easy/333686.png');
//const img = cv.imread('resources/lw-hard/4j5ram.png');
//const img = cv.imread('resources/lw-hard/53tn4a.png');
//const img = cv.imread('resources/lw-hard/6e5yf3.png');
//const img = cv.imread('resources/lw-hard/8yhq89.png');
//const img = cv.imread('resources/lw-hard/942dhb.png');
const img = cv.imread('resources/lw-hard/bhafy3.png');
//const img = cv.imread('resources/lw-hard/nn2jg6.png');
//const img = cv.imread('resources/cdy/');
//const img = cv.imread('resources/cdymall/3Y4783.jpeg');
//const img = cv.imread('resources/cdymall/49364P.jpeg');
//const img = cv.imread('resources/cdymall/66Z896.jpeg');
//const img = cv.imread('resources/cdymall/896U84.jpeg');
//const img = cv.imread('resources/cdymall/98X493.jpeg');

// グレイスケール変換+モルフォロジー変換（ドット除去）
const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
const crKernel = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(2, 2));
const grayImg = img.bgrToGray()
      .morphologyEx(kernel, cv.MORPH_CLOSE)
      .erode(crKernel)

//cv.imshowWait('result', grayImg);
cv.imwrite('grayImg.jpg', grayImg);

// 大津の二値化+モルフォロジー変換
//const binImg = grayImg
//      .threshold(0, 255, cv.THRESH_BINARY+cv.THRESH_OTSU)
//      .morphologyEx(crKernel, cv.MORPH_CLOSE);

const binImg = grayImg.adaptiveThreshold(255, cv.ADAPTIVE_THRESH_MEAN_C,
                                         cv.THRESH_BINARY, 11, 2);

//cv.imshowWait('result', binImg);
cv.imwrite('binImg.jpg', binImg);

//const contours = binImg.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
//const contours = binImg.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
const contours = binImg.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

contours.sort((a, b) => {
  return (a.boundingRect().x - b.boundingRect().x);
});

console.log(999);

const rescaledImgs = []
contours.forEach((cnt, i) => {
  const rect = cnt.boundingRect();
  console.log(rect.width,img.cols);
  if (rect.width > (img.cols * 0.8) || rect.height > (img.rows * 0.8)) {
    return;
  }
  if (rect.height < (img.rows * 0.3)) {
    return;
  }
  console.log(rect);
  const croppedImg = grayImg.getRegion(rect.pad(1.1))
  console.log(888);
  //cv.imshowWait('result', croppedImg);

  //cv.imshowWait('result', croppedImg);
  //cv.imwrite('out2.jpg', croppedImg.rescale(img.rows/croppedImg.rows))
  img.drawRectangle(rect, new cv.Vec(0, 255, 0), 2);
  //img.drawContours(rect, new cv.Vec(0, 255, 0), 2);
  /*
  const center = rotRect.center;
  let angle = rotRect.angle;
  let rect_size = rotRect.size;
  if (rotRect.angle < -45.) {
    angle += 90.0;
    // swap
    rect_size = new cv.Size(rect_size.height, rect_size.width);
  }
  const M = cv.getRotationMatrix2D(rotRect.center, angle, 1.0);
  const rotatedImg = img.warpAffine(M, new cv.Size(img.cols, img.rows), cv.INTER_CUBIC);
  cv.imshowWait('result',rotatedImg);
  const cropRect = new cv.Rect(center.x - rect_size.width/2,
                               center.y - rect_size.height/2,
                               rect_size.width,
                               rect_size.height);
  console.log(cropRect);
  const croppedImg = rotatedImg.getRegion(cropRect.pad(1.1));
  */
  rescaledImgs.push(croppedImg.rescale(img.rows/croppedImg.rows));

  //cv.imshowWait('result', croppedImg);
});

console.log(rescaledImgs);

let height = 0;
let width = 0;
rescaledImgs.forEach((rImg, i) => {
  height = rImg.rows;
  width += rImg.cols;
});
//const newImg = new cv.Mat(height, width, cv.CV_8UC3);
const newImg = new cv.Mat(height, width, cv.CV_8UC1);

let x = 0
let y = 0;
rescaledImgs.forEach((rImg, i) => {
  rImg.copyTo(newImg.getRegion(new cv.Rect(x, y, rImg.cols, rImg.rows)));
  x += rImg.cols;
});

//cv.imshowWait('result', img);
//cv.imshowWait('result', newImg);

cv.imwrite('out2.jpg', newImg);
