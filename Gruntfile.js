
module.exports = function(grunt) {

	'use strict';

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
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
		watch: {
			sass: {
				files: ['src/scss/components/*.scss', 'src/scss/*.scss'],
				tasks: ['sass'],
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
		scsslint: {
			allFiles: ['src/scss/components/*.scss', 'src/scss/*.scss'],
			options: {
				bundleExec: true,
				reporterOutput: 'scss-lint-report.xml'
			},
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
		}
	});

	grunt.registerTask('serve', ['watch']);
};