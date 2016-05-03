'use strict';

module.exports = {
  getFilteredPictures: function(picturesArray, filter) {
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
  }
};
