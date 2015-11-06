
module.exports = function (grunt) {

  grunt.initConfig({

    // For testing. Testing is good.
    mochaTest: {
      test: {
        options: {
          reporter: 'mocha-unfunk-reporter'
        },
        src: ['tests/*_test.js']
      }
    },

    // Building for examples
    browserify: {
      dist: {
        files: {
          'examples/js/app.built.js': ['examples/js/app.js']
        },
        options: {
          transform: ['reactify'],
          watch: true,
          keepAlive: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('dev', ['browserify']);
  grunt.registerTask('default', ['mochaTest']);

};