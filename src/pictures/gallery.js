'use strict';
var galleryContainer = document.querySelector('.gallery-overlay');
var galleryPicture = galleryContainer.querySelector('.gallery-overlay-image');
var galleryPictureLike = galleryContainer.querySelector('.likes-count');
var galleryPictureComment = galleryContainer.querySelector('.comments-count');
var galleryCloseButton = galleryContainer.querySelector('.gallery-overlay-close');
var galleryPictures = [];
var picNum = 0;

galleryPicture.addEventListener('click', _onPhotoClick);
document.addEventListener('keydown', _onDocumentKeyDown);
galleryCloseButton.addEventListener('click', closeGallery);

var getGalleryPictures = function(galleryPicturesArray) {
  galleryPictures = galleryPicturesArray;
};

var showGallery = function(index) {
  galleryContainer.classList.remove('invisible');
  picNum = index;
  setActivePicture(index);
};

function closeGallery() {
  galleryContainer.classList.add('invisible');

  galleryPicture.addEventListener('click', _onPhotoClick);
  galleryCloseButton.addEventListener('click', closeGallery);
}

var setActivePicture = function(index) {
  if (galleryPictures[index].url === 'failed') {
    galleryPictures.splice(galleryPictures[index], 1);
  }

  galleryPicture.src = galleryPictures[index].url;
  galleryPictureLike.innerHTML = galleryPictures[index].likes;
  galleryPictureComment.innerHTML = galleryPictures[index].comments;
};

function _onPhotoClick() {
  setActivePicture(picNum + 1);
  picNum++;
}

function _onDocumentKeyDown(event) {
  if(event.keyCode === 27) {
    closeGallery();
  }
}

exports.showGallery = showGallery;
exports.getGalleryPictures = getGalleryPictures;

