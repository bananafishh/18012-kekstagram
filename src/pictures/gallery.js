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
    location.hash = '';
  };

  this._onPhotoClick = function() {
    var nextPicture = self.galleryPictures[++self.picNum];
    var url = nextPicture.url;
    location.hash = 'photo/' + url;
  };

  this._onDocumentKeyDown = function() {
    if(event.keyCode === 27) {
      event.preventDefault();
      location.hash = '';
    }
  };

  this.setGalleryPictures = function(galleryPicturesArray) {
    self.galleryPictures = galleryPicturesArray;
  };

  this.setActivePicture = function(index) {
    galleryPicture.src = this.galleryPictures[index].url;
    galleryPictureLike.innerHTML = this.galleryPictures[index].likes;
    galleryPictureComment.innerHTML = this.galleryPictures[index].comments;
  };

  this.showGallery = function(index) {
    self.element.classList.remove('invisible');
    if (typeof (index) === 'string') {
      this.galleryPictures.forEach(function(picture, picNum) {
        if (picture.url === index) {
          index = picNum;
        }
      });
    }
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

  this.onHashChange = function() {
    if (location.hash === '') {
      self.closeGallery();
    } else if (location.hash.match(/#photo\/(\S+)/)) {
      var pictureUrl = location.hash.match(/#photo\/(\S+)/)[1];
      self.showGallery(pictureUrl);
    }
  };

  window.addEventListener('hashchange', this.onHashChange);
};

module.exports = new Gallery();






// exports.showGallery = showGallery;
// exports.setGalleryPictures = setGalleryPictures;

