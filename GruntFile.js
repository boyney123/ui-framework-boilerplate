module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    frameworkName:'simples',
    uglify: {
      options: {
        banner: '/*! <%= frameworkName %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src : 'app/scripts/**/*.js',
        dest: 'app/scripts/<%= frameworkName %>.<%= pkg.version %>.min.js'
      }
    },
   cssmin: {
      minify: {
        src: './app/components/**/*.css',
        dest: './app/styles/styles.min.css'
      }
    },
    nodemon: {
      dev: {
         options: {
          file: './server.js'
        }
      }
    },
    uncss: {
    dist: {
      files: grunt.file.readJSON('./components.json')
    }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-uncss');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'uncss', 'cssmin', 'nodemon']);

};