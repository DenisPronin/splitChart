var gulp = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var connect = require('gulp-connect');
var open = require('gulp-open');

var port = 5046;

var paths = {
    html: {
        src: ['index.html']
    },
    js: {
        src: ['js/**/*.js'],
        distPath: 'dist',
        distLib: 'dist/splitChart.js'
    }
};

gulp.task('connect', function() {
    connect.server({
        root: [__dirname],
        port: port,
        livereload: true
    });
});

gulp.task('open', function(){
    gulp.src('index.html')
        .pipe(open('', {
            url: 'http://localhost:' + port,
            app: 'google-chrome' // for linux
        }));
});

gulp.task('html', function() {
    return gulp.src(paths.html.src)
        .pipe(connect.reload());
});

gulp.task('js', function() {
    return gulp.src(paths.js.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(paths.js.distPath))
        .pipe(connect.reload());
});

gulp.task("jsMin", function() {
    return gulp.src(paths.js.distLib)
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js.distPath))
});

gulp.task('jsProd', ['js', 'jsMin']);

gulp.task('watch', function() {
    gulp.watch(paths.html.src, ['html']);
    gulp.watch(paths.js.src, ['js']);
});

gulp.task('default', ['connect', 'js', 'watch', 'open']);

gulp.task('prod', ['connect', 'jsProd', 'open']);
