
module.exports = function(grunt) {

	'use strict';

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.initConfig({
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'dist/style.css': 'src/scss/style.scss'
				}
			}
		},
		'http-server': {
	 
	        'dev': {
	 
	            // the server root directory 
	            root: '',
	 
	            // the server port 
	            // can also be written as a function, e.g. 
	            // port: function() { return 8282; } 
	            port: 3003,
	 
	            // the host ip address 
	            // If specified to, for example, '127.0.0.1' the server will 
	            // only be available on that ip. 
	            // Specify '0.0.0.0' to be available everywhere 
	            host: '192.168.56.1',
	 
	            cache: 0,
	            showDir : true,
	            autoIndex: true,
	 
	            // server default file extension 
	            ext: 'html',
	 
	            // run in parallel with other tasks 
	            runInBackground: false,
	 
	            // Tell grunt task to open the browser 
	            openBrowser : false
	        }
	    },
		watch: {
			sass: {
				files: ['src/scss/*.scss'],
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
			},
		},
		jshint: {
		    options: {
		        globals: {
		            '$': true,
		            'jQuery': true
		        },
		        jshintrc: '.jshintrc'
		    },
		    files: [
		        'Gruntfile.js',
		        'src/js/flickr-api-scraper.js'
		    ],
		},	
		scsslint: {
			allFiles: [
				'src/scss/*.scss',
			],
			options: {
				bundleExec: true,
				reporterOutput: 'scss-lint-report.xml'
			},
		},
		concat: {
			dist: {
				src: ['src/js/flickr-api-scraper.js'],
				dest: 'dist/flickr-api-scraper.js',
			},
		},
	});

	grunt.registerTask('serve', ['http-server'], ['watch']);
};