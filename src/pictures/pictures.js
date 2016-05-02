'use strict';

var picturesContainer = document.querySelector('.pictures');
var filtersContainer = document.querySelector('.filters');
var galleryContainer = document.querySelector('.gallery-overlay');
var pictures = [];
var filteredPictures = [];

var PAGE_SIZE = 12;
var pageNumber = 0;

// Скрываем фильтр изображений
filtersContainer.classList.add('hidden');

// Отрисовка данных из json файла на основе шаблона
// var renderModule = require('./render');
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

    element.querySelector('.picture-comments').innerHTML = data.comments;
    element.querySelector('.picture-likes').innerHTML = data.likes;

    getGalleryPictures(data.url);

    element.addEventListener('click', function(event) {
      event.preventDefault();
      showGallery(filteredPictures.indexOf(data));
    });


    container.appendChild(element);
    return element;
  };



var renderPictures = function(picturesArray, page, replace) {
  if (replace) {
    picturesContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  picturesArray.slice(from, to).forEach(function(picture) {
    drawPictureElement(picture, picturesContainer);
  });
};

// Загрузка данных по XMLHttpRequest
var loadModule = require('./load');
var getPictures = loadModule.getPictures;

// Постраничный вывод изображений при прокрутке
var scrollModule = require('./scroll');
var isNextPageAvailable = scrollModule.isNextPageAvailable;
var isPageBotttom = scrollModule.isPageBotttom;
var isPageNotFull = scrollModule.isPageNotFull;

var setPageFull = function() {
  while (isPageNotFull(picturesContainer) &&
         isNextPageAvailable(filteredPictures, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber);
  }
};

var addScroll = function() {
  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (isPageBotttom(picturesContainer) &&
          isNextPageAvailable(filteredPictures, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderPictures(filteredPictures, pageNumber);
      }
    }, 100);
  });
};

var galleryPictures = [];
var indexpic = 0;

var galleryPicture = galleryContainer.querySelector('.gallery-overlay-image');

var activeGalleryPicture = 0;

var getGalleryPictures = function(galleryPicturesArray) {
  galleryPictures = galleryPicturesArray;
  console.log(galleryPictures[5]);
};

var showGallery = function(index) {
  galleryContainer.classList.remove('invisible');

  indexpic = index;
}

var setActivePicture = function(index) {
  galleryPicture.src = galleryPictures[index];
};

// Фильтрация изображений
var filterModule = require('./filter');
var getFilteredPictures = filterModule.getFilteredPictures;

var enableFilters = function(filter) {
  filteredPictures = getFilteredPictures(pictures, filter);
  pageNumber = 0;
  renderPictures(filteredPictures, pageNumber, true);
  setPageFull();
};

var enableFiltration = function() {
  filtersContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('filters-radio')) {
      enableFilters(event.target.id);
    }
  });
};

getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  picturesContainer.classList.remove('pictures-loading', 'pictures-failure');
  enableFiltration(true);
  enableFilters('filter-popular');
  addScroll();
}, function() {
  picturesContainer.classList.add('pictures-failure');
  picturesContainer.classList.remove('pictures-loading');
}, picturesContainer);

// Показываем фильтр изображений
filtersContainer.classList.remove('hidden');

