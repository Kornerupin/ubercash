var gulp = require('gulp'),
    path = require('path'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    htmlImport = require('gulp-html-import'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    prefix = require('gulp-autoprefixer'),
    concatCss = require('gulp-concat-css');


//templates
gulp.task('templates', function() {
    return gulp.src('./dev/*.html')
        .pipe(htmlImport('./dev/html/'))
        .pipe(gulp.dest('./production'))
        .pipe(browserSync.reload({stream: true}))
});


//styles
gulp.task('styles', function () {
    return gulp.src('./dev/less/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(prefix("last 5 version"))
    .pipe(gulp.dest('./dev/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css-minify', ['styles'], function () {
    return gulp.src([
        'dev/css/normalize.css',
        'dev/css/style.css'
    ])
        .pipe(concatCss("style.css"))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('production/assets'))
        .pipe(browserSync.reload({stream: true}))
});

//browser-sync

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'production',
            index: "index.html"
        },
        notify: false
    })
});



//scripts
gulp.task('libs', function () {
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(concat('lib.js'))
        .pipe(uglify())
        .pipe(gulp.dest('production/assets'))
        .pipe(gulp.dest('./dev/js/libraries'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function () {
    gulp.src('dev/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('production/assets'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('images', function () {
    gulp.src('dev/images/*')
    .pipe(gulp.dest('production/assets/images'))
    .pipe(browserSync.reload({stream: true}))
});


gulp.task('watch', ['browser-sync', 'libs', 'css-minify', 'templates', 'scripts', 'images'], function () {
    gulp.watch('dev/less/**/*.less', ['styles']);
    gulp.watch('dev/js/*.js', ['scripts']);
    gulp.watch('dev/**/*.html', ['templates']);
    gulp.watch('dev/css/**/*.css', ['css-minify'])
    gulp.watch('dev/images/*', ['images'])
});


gulp.task('default', ['styles', 'scripts', 'templates', 'images']);
gulp.task('dev', ['default', 'watch']);
gulp.task('prod', ['default']);