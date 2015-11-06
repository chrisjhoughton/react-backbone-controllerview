
module.exports = function (grunt) {

  grunt.initConfig({

    // For testing. Testing is good.
    mochaTest: {
      test: {
        options: {
          reporter: 'mocha-unfunk-reporter'
        },
        src: ['./tests/*_test.js']
      }
    },

    // Building for examples
    browserify: {
      dist: {
        files: {
          'examples/js/app.built.js': ['examples/js/app.js']
        },
        options: {
          transform: ['reactify']
        }
      }
    },

    jshint: {
      all: [
        'Gruntfile.js', 
        'lib/*.js', 
        'tests/*.js'
      ]
    },


  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('dev', ['browserify']);
  grunt.registerTask('default', ['jshint', 'mochaTest', 'browserify']);

};