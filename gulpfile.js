/*global require*/
/* Require the gulp and node packages */
var gulp = require('gulp'),
    pkg = require('./package.json'),
    header = require('gulp-header'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    browserSync = require('browser-sync'),
    ghPages = require('gulp-gh-pages'),
    reload = browserSync.reload,
    runSequence = require('run-sequence');


/* Set up the banner */
var banner = [
    '/**',
    ' * @name <%= pkg.name %>: <%= pkg.description %>',
    ' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */'
].join('\n');

/* Error notificaton*/
var onError = function(err) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        message:  "Error: <%= error.message %>",
        sound:    "Beep"
    })(err);

    this.emit('end');
};

var componentName = function(){
	return pkg.name.split('-').map(function(w){ return w.substr(0, 1).toUpperCase() + w.substr(1); }).join();
};

/************************
 *  Task definitions 
 ************************/

gulp.task('js:copy', function() {
    return gulp.src('src/*.js')
        .pipe(header(banner, {pkg : pkg}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('js:async', function() {
    return gulp.src('src/*.js')
        .pipe(header(banner, {pkg : pkg}))
		.pipe(browserify({
          insertGlobals : true,
          debug : false,
		  standalone: componentName()
        }))
		.pipe(uglify())
  		.pipe(rename({suffix: '.async.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('js:compress', function() {
    return gulp.src('src/*.js')
		.pipe(header(banner, {pkg : pkg}))
		.pipe(uglify())
  		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('js', ['js:copy', 'js:compress', 'js:async']);

gulp.task('copy', function() {
    return gulp.src('dist/*.js')
		.pipe(gulp.dest('example/src/libs/'));
});

gulp.task('example', function() {
    return gulp.src('example/src/app.js')
		.pipe(browserify({
          insertGlobals : true,
          debug : true
        }))
		.pipe(gulp.dest('example/js'));
});

gulp.task('server', ['js', 'example'], function () {
      browserSync({
        notify: false,
        // https: true,
        server: ['example'],
        tunnel: false
      });

      gulp.watch(['src/*'], function(){
          runSequence('js', 'copy', 'example', reload);
      });
      gulp.watch(['example/**/*'], ['example', reload]);
});
 
gulp.task('deploy', ['example'], function() {
  return gulp.src('./example/**/*')
    .pipe(ghPages());
});


/************************
 *  Task collection API
 ************************/
gulp.task('default', ['server']);
gulp.task('serve', ['server']);