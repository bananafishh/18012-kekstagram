/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

var browserCookies = require('browser-cookies');

(function() {

  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    return true;
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Поля формы кадрирования изображений
   * @type {HTMLElement}
   */
  var leftDistance = document.querySelector('#resize-x');
  var topDistance = document.querySelector('#resize-y');
  var resizeSize = document.querySelector('#resize-size');
  var submitBtn = document.querySelector('#resize-fwd');

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Установление ограничений
   */
  function setConstraint(left, top, size) {
    left.max = currentResizer._image.naturalWidth - size.value;
    top.max = currentResizer._image.naturalWidth - size.value;

    if(currentResizer._image.naturalWidth > currentResizer._image.naturalHeight || currentResizer._image.naturalWidth === currentResizer._image.naturalHeight) {
      size.max = currentResizer._image.naturalWidth;
    } else if(currentResizer._image.naturalWidth > currentResizer._image.naturalHeight) {
      size.max = currentResizer._image.naturalHeight;
    }

    top.min = 0;
    left.min = 0;
  }

  /**
   * Создание контейнера для сообщения об ошибке
   */
  var messageContainer = document.createElement('div');
  resizeForm.appendChild(messageContainer);
  messageContainer.className = 'warning';

  /**
   * Вывод сообщения об ошибке
   */
  function displayMessage() {
    if(leftDistance.checkValidity() === false || topDistance.checkValidity() === false || resizeSize.checkValidity() === false) {
      submitBtn.disabled = true;
      for(var i = 0; i < resizeForm.length; i++) {
        var field = resizeForm.elements[i];

        if(field.validationMessage) {
          var fieldLabel = field.previousSibling.innerHTML;
          document.querySelector('.warning').innerHTML = 'В поле ' + fieldLabel + ' ' + field.validationMessage;
        }
      }
    } else {
      submitBtn.disabled = false;
      document.querySelector('.warning').innerHTML = '';
    }
  }

  /**
   * Отмена нативной валидации
   */
  resizeForm.noValidate = true;

  /**
   * Обработка изменения значений в полях формы
   */
  resizeSize.oninput = function() {
    setConstraint(leftDistance, topDistance, resizeSize);
    displayMessage();
  };

  leftDistance.oninput = function() {
    setConstraint(leftDistance, topDistance, resizeSize);
    displayMessage();
  };

  topDistance.oninput = function() {
    setConstraint(leftDistance, topDistance, resizeSize);
    displayMessage();
  };

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;
      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  };


  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Определение времени хранения cookie
   */
  var now = new Date();
  var birthday = new Date();

  birthday.setMonth(10);
  birthday.setDate(22);

  if(birthday >= now) {
    birthday.setFullYear(birthday.getFullYear() - 1);
  }

  var expireTime = now - birthday;


  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    var checkedFilter = document.querySelector('input[name="upload-filter"]:checked');
    var checkedFilterValue = checkedFilter.value;
    browserCookies.set('filter-value', checkedFilterValue, { expires: expireTime });

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Установка сохраненного в cookie фильтра по умолчанию
   */
  var filterVal = browserCookies.get('filter-value');
  if(filterVal) {
    document.querySelector('input[value=' + filterVal + ']').checked = true;
    filterImage.className = 'filter-image-preview filter-' + filterVal;
  }

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  };

  cleanupResizer();
  updateBackground();
})();
