'use strict';

var picturesContainer = document.querySelector('.pictures');
var filtersContainer = document.querySelector('.filters');
var pictures = [];
var filteredPictures = [];

var PAGE_SIZE = 12;
var pageNumber = 0;

// Вывод данных из json файла на основе шаблона
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
  element.querySelector('.picture-likes').innerHTML = data.date;

  container.appendChild(element);
  return element;
};

// Скрываем фильтр изображений
filtersContainer.classList.add('hidden');


// Загрузка данных по XMLHttpRequest
var getPictures = function(success, error) {
  var xhr = new XMLHttpRequest();

  // Показываем прелоадер
  picturesContainer.classList.add('pictures-loading');

  // Обработчик загрузки
  xhr.onload = function(event) {
    var loadedData = JSON.parse(event.target.response);
    success(loadedData);
  };

  // Обработчик ошибки
  xhr.onerror = error;

  // Обработчик задержки ответа сервера
  xhr.timeout = 10000;
  xhr.ontimeout = error;

  // Создаем и отсылаем аякс запрос
  xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
  xhr.send();
};

var isNextPageAvailable = function(picturesArray, page) {
  return page < Math.floor(pictures.length / PAGE_SIZE);
};

var isPageBotttom = function() {
  var viewport = window.innerHeight + 20;
  var picturesBottom = picturesContainer.getBoundingClientRect().bottom;

  return picturesBottom < viewport;
};

var isPageNotFull = function() {
  var picturesBottom = picturesContainer.getBoundingClientRect().bottom;

  return picturesBottom < window.innerHeight;
};

var setPageFull = function() {
  while (isPageNotFull() &&
         isNextPageAvailable(filteredPictures, pageNumber)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber);
  }
};

var addScroll = function() {
  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (isPageBotttom() &&
          isNextPageAvailable(filteredPictures, pageNumber)) {
        pageNumber++;
        renderPictures(filteredPictures, pageNumber);
      }
    }, 100);
  });
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

var getFilteredPictures = function(picturesArray, filter) {
  var picturesToFilter = picturesArray.slice(0);

  switch (filter) {
    case 'filter-popular':
      break;

    case 'filter-new':
      var now = new Date();
      var twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

      var newPictures = picturesToFilter.filter(function(picture) {
        var pictureDate = new Date(picture.date);
        return pictureDate >= twoWeeksAgo;
      });

      picturesToFilter = newPictures;

      picturesToFilter.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      break;

    case 'filter-discussed':
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }

  return picturesToFilter;
};

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
});

// Показываем фильтр изображений
filtersContainer.classList.remove('hidden');

