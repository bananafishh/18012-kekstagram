'use strict';

module.exports = {
  getPictures: function(success, error, container) {
    var xhr = new XMLHttpRequest();

    // Показываем прелоадер
    container.classList.add('pictures-loading');

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
  }
};
