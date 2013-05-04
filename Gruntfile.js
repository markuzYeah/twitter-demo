'use strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    test: 'test',
    tmp: '.tmp'
  };

  try {
    yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['<%= yeoman.test %>/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      less: {
        files: ['<%= yeoman.app %>/styles{,*/}*.less'],
        tasks: ['less:dist']
      },
      jade: {
        files: ['<%= yeoman.app %>/{,*/}*.jade'],
        tasks: ['jade:dist']
      },
      //compass: {
      //  files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
      //  tasks: ['compass']
      //},

      livereload: {
        files: [
          '<%= yeoman.app %>/{,*/}*.{html,jade}',
          '<%= yeoman.app %>/styles/{,*/}*.{css,less}',
          '<%= yeoman.app %>/scripts/{,*/}*.{js,coffee}',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        //tasks: ['livereload', 'less:dist', 'coffee:dist', 'jade:dist']
        tasks: ['livereload', 'pre-compile-assets']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, yeomanConfig.tmp),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.tmp),
              mountFolder(connect, yeomanConfig.test)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.tmp %>',
            //'dist'
            '<%= yeoman.dist %>'
          ]
        }]
      },
      server: '<%= yeoman.tmp %>'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    coffee: {
      dist: {
        options: {
          bare: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        options: {
          bare: true
        },
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    /*
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    */
    less: {
      dist: {
        options: {
          debugInfo: true
        },
        files:[{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          src: 'main.less',
          dest: '<%= yeoman.tmp %>/styles',
          ext: '.css'
        }]
      }
    },

    jade: {
      dist: {
        options: {
          debugInfo: true,
          pretty: true
        },
        files:[{
          expand: true,
          cwd: '<%= yeoman.app %>/',
          src: '{,*/}*.jade',
          dest: '<%= yeoman.tmp %>/',
          ext: '.html'
        }]
      }
    },

    concat: {
      dist: {
        files: {
          //'<%= yeoman.dist %>/scripts/main-app.js': [
          //  '<%= yeoman.tmp %>/scripts/{,*/}*.js',
          //  '<%= yeoman.app %>/scripts/{,*/}*.js'
         // ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.tmp %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '<%= yeoman.tmp %>/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.tmp %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      options: {
        mangle: false
      }
      /*
      dist: {
        options:{
          beautify: {
            width: 76,
            beautify: true
          }
        },
        files: {
          '<%= yeoman.dist %>/scripts/main-app.js': [
            '<%= yeoman.dist %>/scripts/main-app.js'
          ],
        }
      }
      */
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      js: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.tmp %>',
          src: [
            'scripts/{,*/}*.js',
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.tmp %>',
          src: [
            'components/**/*'
          , 'img/**/*'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'components/**/*',
            'images/{,*/}*.{gif,webp}',
            'img/**/*'
          ]
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('pre-compile-assets', [
    'jade:dist',
    'coffee:dist',
    'less:dist',
    'copy:js'
  ]);

  grunt.registerTask('server', [
    'clean:server',
    'pre-compile-assets',
    'livereload-start',
    'connect:livereload',
    //'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:dist',
    'pre-compile-assets',
    //'jshint',
    //'connect:test',
    //'karma'
  ]);

  grunt.registerTask('build', [
    'test', // the test task already pre-compiled the assets
    'copy:dist',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    // the cdnify is buggy, not production ready.
    //'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);
};
