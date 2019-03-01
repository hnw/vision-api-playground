// モジュール読み込み
const cv = require('opencv4nodejs');

//const img = cv.imread('resources/cdy/14435B.bmp');
const img = cv.imread('resources/cdy/5Q1273.bmp');

const binImg = img.threshold(100, 255, cv.THRESH_BINARY_INV).cvtColor(cv.COLOR_BGR2GRAY);

const contours = binImg.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

contours.forEach((cnt, i) => {
  const rect = cnt.boundingRect();
  img.drawRectangle(rect, new cv.Vec(0, 255, 0), 2);
});

cv.imwrite('out.jpg', img);
