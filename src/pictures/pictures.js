'use strict';

var picturesContainer = document.querySelector('.pictures');
var filtersContainer = document.querySelector('.filters');
var pictures = [];
var filteredPictures = [];
var Photo = require('./photo').Photo;
var PAGE_SIZE = 12;
var pageNumber = 0;
var renderedPictures = [];

// Скрываем фильтр изображений
filtersContainer.classList.add('hidden');

// Отрисовка данных из json файла на основе шаблона
var renderPictures = function(picturesArray, page, replace) {
  if (replace) {
    picturesContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  picturesArray.slice(from, to).forEach(function(picture) {
    renderedPictures.push(new Photo(picture, picturesContainer, filteredPictures));
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

// Фильтрация изображений
var filterModule = require('./filter');
var getFilteredPictures = filterModule.getFilteredPictures;

var enableFilters = function(filter) {
  filteredPictures = getFilteredPictures(pictures, filter);
  setGalleryPictures(filteredPictures);
  pageNumber = 0;
  renderPictures(filteredPictures, pageNumber, true);
  setPageFull();
};

var enableFiltration = function() {
  filtersContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('filters-radio')) {
      localStorage.setItem('picturesFilterValue', event.target.id);
      enableFilters(localStorage.getItem('picturesFilterValue'));
    }
  });
};

// Фотогалерея
var galleryModule = require('./gallery');
var setGalleryPictures = galleryModule.setGalleryPictures;

getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  picturesContainer.classList.remove('pictures-loading', 'pictures-failure');
  enableFiltration(true);
  if (localStorage.getItem('picturesFilterValue')) {
    enableFilters(localStorage.getItem('picturesFilterValue'));
    document.querySelector('#' + localStorage.getItem('picturesFilterValue')).checked = true;
  } else {
    enableFilters('filter-popular');
  }
  addScroll();
  restoreFromHash();
  window.addEventListener('hashchange', onHashChange);
}, function() {
  picturesContainer.classList.add('pictures-failure');
  picturesContainer.classList.remove('pictures-loading');
}, picturesContainer);

var returnFromHash = function() {
  if (location.hash.match(/#photo\/(\S+)/)) {
    galleryModule.showGallery(location.hash.replace('#photo/', ''));
  }
};

var onHashChange = function() {
  returnFromHash();
};

// Показываем фильтр изображений
filtersContainer.classList.remove('hidden');

