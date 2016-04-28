'use strict';

module.exports = {
  drawPictureElement: function(data, container) {
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
  }
};



