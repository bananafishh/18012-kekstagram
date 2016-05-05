'use strict';

var drawPictureElement = require('./get-picture');

function Photo(data, container) {
  this.data = data;
  this.element = drawPictureElement(this.data, container);

  this.onPhotoClick = function(event) {
    event.preventDefault();
    location.hash = 'photo/' + data.url;
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onPhotoClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onPhotoClick);
  container.appendChild(this.element);
}

exports.Photo = Photo;
