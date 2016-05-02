'use strict';

module.exports = {
  isNextPageAvailable: function(picturesArray, page, pageSize) {
    return page < Math.floor(picturesArray.length / pageSize);
  },

  isPageBotttom: function(container) {
    var viewport = window.innerHeight + 20;
    var picturesBottom = container.getBoundingClientRect().bottom;

    return picturesBottom < viewport;
  },

  isPageNotFull: function(container) {
    var picturesBottom = container.getBoundingClientRect().bottom;

    return picturesBottom < window.innerHeight;
  }
};
