'use strict';

var picturesContainer = document.querySelector('.pictures');
var filters = document.querySelector('.filters');
filters.classList.add('hidden');

var drawPictureElement = function(data, container) {
  var templateElement = document.querySelector('#picture-template');

  if('content' in templateElement) {
    var element = templateElement.content.children[0].cloneNode(true);
  } else {
    element = templateElement.children[0].cloneNode(true);
  }

  var img = new Image();
  var elementImg = element.querySelector('img');

  img.onload = function() {
    elementImg.src = img.src;
    elementImg.width = 182;
    elementImg.height = 182;
  };

  img.onerror = function() {
    elementImg.classList.add('picture-load-failure');
  };

  img.src = data.url;

  container.appendChild(element);
  return element;
};

window.pictures.forEach(function(picture) {
  drawPictureElement(picture, picturesContainer);
});

filters.classList.remove('hidden');

