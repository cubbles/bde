'use strict';

module.exports.tasks = {
  folder_list: {
    default_options: {
      options: {
        folder: false,
        files: true
      },
      files: [{
        src: ['**'],
        dest: '<%= param.src %>/temp/paths.json',
        cwd: '<%= param.src %>/docelements/'
      }]
    }
  }
};
