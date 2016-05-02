'use strict';

module.exports = {
  getExpireTime: function() {
    var now = new Date();
    var birthday = new Date();

    birthday.setMonth(10);
    birthday.setDate(22);

    if(birthday >= now) {
      birthday.setFullYear(birthday.getFullYear() - 1);
    }

    var expireTime = now - birthday;

    return expireTime;
  }
};
