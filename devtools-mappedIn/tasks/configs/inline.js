'use strict';

module.exports.tasks = {
  inline: {
    target: {
      options: {
        tag: '.js'
      },
      src: '<%= param.src %>/bde/elements/**/*.html',
      dest: '<%= param.src %>/docelements/docelements/'
    }

  }
};
