'use strict';

var picturesContainer = document.querySelector('.pictures');
var filtersContainer = document.querySelector('.filters');
var pictures = [];

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
picturesContainer.classList.add('pictures-loading');

// Загрузка данных по XMLHttpRequest
var getPictures = function(success, error) {
  var xhr = new XMLHttpRequest();

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

  xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
  xhr.send();
};

var renderPictures = function(picturesArray) {
  picturesContainer.innerHTML = '';

  picturesArray.forEach(function(picture) {
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
  var filteredPictures = getFilteredPictures(pictures, filter);
  renderPictures(filteredPictures);
};

var enableFiltration = function() {
  var filters = filtersContainer.querySelectorAll('.filters-radio');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      enableFilters(this.id);
    };
  }
};

getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  picturesContainer.classList.remove('pictures-loading', 'pictures-failure');
  enableFiltration(true);
  enableFilters('filter-popular');

}, function() {
  picturesContainer.classList.add('pictures-failure');
  picturesContainer.classList.remove('pictures-loading');
});

// Показываем фильтр изображений
filtersContainer.classList.remove('hidden');

