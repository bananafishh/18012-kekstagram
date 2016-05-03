'use strict';
var galleryContainer = document.querySelector('.gallery-overlay');
var galleryPicture = galleryContainer.querySelector('.gallery-overlay-image');
var galleryPictureLike = galleryContainer.querySelector('.likes-count');
var galleryPictureComment = galleryContainer.querySelector('.comments-count');
var galleryCloseButton = galleryContainer.querySelector('.gallery-overlay-close');
var galleryPictures = [];
var picNum = 0;

var setGalleryPictures = function(galleryPicturesArray) {
  galleryPictures = galleryPicturesArray;
};

var showGallery = function(index) {
  galleryContainer.classList.remove('invisible');
  picNum = index;
  setActivePicture(index);
};

galleryPicture.addEventListener('click', _onPhotoClick);
document.addEventListener('keydown', _onDocumentKeyDown);
galleryCloseButton.addEventListener('click', closeGallery);

function closeGallery() {
  galleryContainer.classList.add('invisible');
}

var setActivePicture = function(index) {
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
exports.setGalleryPictures = setGalleryPictures;

