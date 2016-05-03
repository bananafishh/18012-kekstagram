'use strict';
var Gallery = function() {
  var self = this;

  this.element = document.querySelector('.gallery-overlay');

  var galleryPicture = this.element.querySelector('.gallery-overlay-image');
  var galleryPictureLike = this.element.querySelector('.likes-count');
  var galleryPictureComment = this.element.querySelector('.comments-count');
  var galleryCloseButton = this.element.querySelector('.gallery-overlay-close');

  this.galleryPictures = [];
  this.picNum = 0;

  this._onCloseBtnClick = function() {
    self.closeGallery();
  };

  this._onPhotoClick = function() {
    self.setActivePicture(self.picNum + 1);
    self.picNum++;
  };

  this._onDocumentKeyDown = function() {
    if(event.keyCode === 27) {
      event.preventDefault();
      self.closeGallery();
    }
  };

  this.setGalleryPictures = function(galleryPicturesArray) {
    self.galleryPictures = galleryPicturesArray;
  };

  this.setActivePicture = function(index) {
    if (this.galleryPictures[index].url === 'failed') {
      this.galleryPictures.splice(this.galleryPictures[index], 1);
    }

    galleryPicture.src = this.galleryPictures[index].url;
    galleryPictureLike.innerHTML = this.galleryPictures[index].likes;
    galleryPictureComment.innerHTML = this.galleryPictures[index].comments;
  };

  this.showGallery = function(index) {
    self.element.classList.remove('invisible');
    self.picNum = index;
    self.setActivePicture(index);

    galleryPicture.addEventListener('click', self._onPhotoClick);
    document.addEventListener('keydown', self._onDocumentKeyDown);
    galleryCloseButton.addEventListener('click', self._onCloseBtnClick);
  };



  this.closeGallery = function() {
    this.element.classList.add('invisible');

    document.removeEventListener('keydown', this._onDocumentKeyDown);
    galleryCloseButton.removeEventListener('click', this._onCloseBtnClick);
    galleryPicture.removeEventListener('click', this._onPhotoClick);
  };
};

module.exports = new Gallery();






// exports.showGallery = showGallery;
// exports.setGalleryPictures = setGalleryPictures;

