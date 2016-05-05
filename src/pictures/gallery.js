'use strict';

var Gallery = function() {
  this.element = document.querySelector('.gallery-overlay');

  this.galleryPicture = this.element.querySelector('.gallery-overlay-image');
  this.galleryPictureLike = this.element.querySelector('.likes-count');
  this.galleryPictureComment = this.element.querySelector('.comments-count');
  this.galleryCloseButton = this.element.querySelector('.gallery-overlay-close');

  this.galleryPictures = [];
  this.picNum = 0;

  this._onPhotoClick = this._onPhotoClick.bind(this);
  this.setGalleryPictures = this.setGalleryPictures.bind(this);
  this.onHashChange = this.onHashChange.bind(this);

  window.addEventListener('hashchange', this.onHashChange);
};

Gallery.prototype._onCloseBtnClick = function() {
  location.hash = '';
};

Gallery.prototype._onPhotoClick = function() {
  var nextPicture = this.galleryPictures[++this.picNum];
  var url = nextPicture.url;
  location.hash = 'photo/' + url;
};

Gallery.prototype._onDocumentKeyDown = function() {
  if(event.keyCode === 27) {
    event.preventDefault();
    location.hash = '';
  }
};

Gallery.prototype.setGalleryPictures = function(galleryPicturesArray) {
  this.galleryPictures = galleryPicturesArray;
};

Gallery.prototype.setActivePicture = function(index) {
  this.galleryPicture.src = this.galleryPictures[index].url;
  this.galleryPictureLike.innerHTML = this.galleryPictures[index].likes;
  this.galleryPictureComment.innerHTML = this.galleryPictures[index].comments;
};

Gallery.prototype.showGallery = function(index) {
  this.element.classList.remove('invisible');
  if (typeof (index) === 'string') {
    this.galleryPictures.forEach(function(picture, picNum) {
      if (picture.url === index) {
        index = picNum;
      }
    });
  }

  this.picNum = index;
  this.setActivePicture(index);

  this.galleryPicture.addEventListener('click', this._onPhotoClick);
  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.galleryCloseButton.addEventListener('click', this._onCloseBtnClick);
};

Gallery.prototype.closeGallery = function() {
  this.element.classList.add('invisible');

  document.removeEventListener('keydown', self._onDocumentKeyDown);
  this.galleryCloseButton.removeEventListener('click', self._onCloseBtnClick);
  this.galleryPicture.removeEventListener('click', self._onPhotoClick);
};

Gallery.prototype.onHashChange = function() {
  if (location.hash === '') {
    this.closeGallery();
    return;
  }

  var matches = location.hash.match(/#photo\/(\S+)/);
  if (matches) {
    this.showGallery(matches[1]);
  }
};

module.exports = new Gallery();

