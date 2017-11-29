
module.exports = function(grunt) {

	'use strict';

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');

	grunt.initConfig({
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'dist/',
					src: ['*.css'],
					dest: 'dist',
					ext: '.min.css'
				}]
			}
		},
		concat: {
			dist: {
				src: [
					'node_modules/jquery/dist/jquery.min.js',
					'bower_components/jquery.hide-show/jquery.hideShow.min.js',
					'node_modules/dateformat/lib/dateformat.js',
					'src/js/flickr-api-scraper.js'
				],
				dest: 'dist/flickr-api-scraper.js',
			},
		},
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'dist/'
				}]
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: [
				'Gruntfile.js',
				'src/js/flickr-api-scraper.js'
			],
		},
        karma: {
            all: {
                configFile: 'karma.conf.js'
            }
        },
		sass: {
			options: {
			sourceMap: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'src/scss/',
					src: ['**/*.scss'],
					dest: 'dist',
					ext: '.css'
				}]
			}
		},
		scsslint: {
			allFiles: [
				'src/scss/components/*.scss',
				'src/scss/*.scss',
				'!src/scss/_resets.scss'
			],
			options: {
				reporterOutput: 'scss-lint-report.xml',
				config: '.scss-lint.yml'
			},
		},
		uglify: {
			options: {
				mangle: false,
				sourceMap: true,
				sourceMapName: 'dist/flickr-api-scraper.map'
			},
			my_target: {
				files: {
					'dist/flickr-api-scraper.min.js': ['src/js/flickr-api-scraper.js']
				}
			}
		},
		watch: {
			sass: {
				files: ['src/scss/components/*.scss', 'src/scss/*.scss'],
				tasks: ['scsslint', 'sass'],
				options: {
					spawn: false
				},
			},
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['jshint', 'concat'],
				options: {
					spawn: false
				},
			}
		}
	});

	// Development
	grunt.registerTask('serve', ['watch']);
	// Test
	grunt.registerTask('test', ['scsslint', 'jshint', 'karma']);
	// Production
	grunt.registerTask('production', ['scsslint', 'sass', 'jshint', 'uglify', 'imagemin']);
};