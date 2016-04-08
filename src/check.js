'use strict';

function getMessage(a, b) {
  var message;
  if(typeof (a) === 'boolean') {
    if(a) {
      message = 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      message = 'Переданное GIF-изображение не анимировано';
    }
  } else if( typeof(a) === 'number') {
    message = 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
  } else if((a instanceof Array) && !(b instanceof Array)) {
    var newSum = sumArray(a);
    message = 'Количество красных точек во всех строчках изображения: ' + newSum;
  } else if((a instanceof Array) && (b instanceof Array)) {
    var newSquare = multipleArray(a, b);
    message = 'Общая площадь артефактов сжатия: ' + newSquare + ' пикселей';
  }

  return message;
}

function sumArray(array) {
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function multipleArray(array1, array2) {
  var square = 0;
  for (var i = 0; i < array1.length; i++) {
    square += array1[i] * array2[i];
  }
  return square;
}





