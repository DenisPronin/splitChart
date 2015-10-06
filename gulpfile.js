var gulp = require('gulp');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var connect = require('gulp-connect');
var open = require('gulp-open');

var port = 5046;

var paths = {
    html: {
        src: ['index.html']
    },
    scss: {
        main: 'scss/main.scss',
        src: ['scss/**/*.scss'],
        distPath: 'dist'
    },
    js: {
        src: ['js/**/*.js'],
        distPath: 'dist',
        distLib: 'dist/splitChart.js',
        vendors: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/flot/jquery.flot.js',
            'node_modules/flot/jquery.flot.crosshair.js',
            'node_modules/html2canvas/dist/html2canvas.js'
        ],
        distVendors: 'dist/vendors'
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

gulp.task('jsVendors', function() {
    return gulp.src(paths.js.vendors)
        .pipe(gulp.dest(paths.js.distVendors));
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

gulp.task('sass-lint', function() {
    gulp.src(paths.scss.src)
        .pipe(scsslint({
            config: 'scss/sassLint.yaml'
        }));
});

gulp.task('sass', function() {
    return gulp.src(paths.scss.main)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 10 version']
        }))
        .pipe(rename({
            basename: 'example'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scss.distPath))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(paths.html.src, ['html']);
    gulp.watch(paths.js.src, ['js']);
    gulp.watch(paths.scss.src, ['sass', 'sass-lint']);
});

gulp.task('default', ['connect', 'jsVendors', 'js', 'sass', 'sass-lint', 'watch', 'open']);

gulp.task('prod', ['connect', 'jsVendors', 'jsProd', 'sass', 'open']);
