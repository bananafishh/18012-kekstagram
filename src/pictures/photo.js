'use strict';

var drawPictureElement = require('./get-picture');

var Photo = function(data, container) {
  this.data = data;
  this.element = drawPictureElement(this.data, container);

  this.onPhotoClick = this.onPhotoClick.bind(this);

  this.element.addEventListener('click', this.onPhotoClick);
  container.appendChild(this.element);
};

Photo.prototype.onPhotoClick = function(event) {
  event.preventDefault();
  location.hash = location.hash.indexOf('photo/' + this.data.url) !== -1 ? '' : 'photo/' + this.data.url;
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPhotoClick);
  this.element.parentNode.removeChild(this.element);
};

exports.Photo = Photo;
