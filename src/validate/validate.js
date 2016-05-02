'use strict';

module.exports = {
  setConstraint: function(resizer, left, top, size) {
    left.max = resizer._image.naturalWidth - +size.value;
    top.max = resizer._image.naturalWidth - +size.value;

    if (resizer._image.naturalWidth > resizer._image.naturalHeight || resizer._image.naturalWidth === resizer._image.naturalHeight) {
      size.max = resizer._image.naturalWidth;
    } else if (resizer._image.naturalWidth < resizer._image.naturalHeight) {
      size.max = resizer._image.naturalHeight;
    }

    top.min = 0;
    left.min = 0;
  },

  createWarningContainer: function(parent, containerClass) {
    parent.appendChild(document.createElement('div')).className = containerClass;
  },

  displayMessage: function(field, containerClass) {
    if(field.checkValidity() === false) {
      var fieldLabel = field.previousSibling.innerHTML;
      var warningText = 'В поле ' + fieldLabel + ' ' + field.validationMessage;
      document.querySelector('.' + containerClass).innerHTML = '';
      document.querySelector('.' + containerClass).innerHTML = warningText;
    } else {
      document.querySelector('.' + containerClass).innerHTML = '';
    }
  }
};
