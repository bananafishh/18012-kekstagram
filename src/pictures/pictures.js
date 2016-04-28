'use strict';

var picturesContainer = document.querySelector('.pictures');
var filtersContainer = document.querySelector('.filters');
var pictures = [];
var filteredPictures = [];

var PAGE_SIZE = 12;
var pageNumber = 0;

// Скрываем фильтр изображений
filtersContainer.classList.add('hidden');

// Отрисовка данных из json файла на основе шаблона
var renderModule = require('./render');
var drawPictureElement = renderModule.drawPictureElement;

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

