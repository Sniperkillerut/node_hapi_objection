const gulp = require('gulp');
//const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const browserSync = require('browser-sync').create();
const del = require('del');
const runSequence = require('run-sequence');
const child = require('child_process');
var node;

gulp.task('styles', function(){
    return gulp.src('client/res/css/**/*.css') 
    // .pipe(sass()) // Passes it through a gulp-sass
    // read why not sass:
    // http://www.amberweinberg.com/why-im-still-against-sass-less/
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('client/static/css')) // Outputs it in the css folder
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('client/static/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function(){
    return gulp.src('client/res/scripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('client/static/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('client/static/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
// Lint Task
gulp.task('lint:client', function(){
    return gulp.src('client/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});
// Lint Task
gulp.task('lint:server', function(){
    return gulp.src(['server.js', 'server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

// Optimizing Images 
gulp.task('images', function(){
    return gulp.src('client/res/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('client/static/image'))
    .pipe(notify({ message: 'Images task complete' }));
});
// Copying fonts 
gulp.task('fonts', function(){
    return gulp.src('client/res/fonts/**/*')
    .pipe(gulp.dest('client/static/fonts'))
    .pipe(notify({ message: 'Fonts task complete' }));
});

gulp.task('clean', function(){
    return del(['client/static/css', 'client/static/js', 'client/static/image','client/static/fonts']);
});

gulp.task('browserSync', function(){
    browserSync.init(null,{
       // server: {
       //     // Serve files from the root of this project
       //     baseDir: "./client/",
       //     
       //     port: 4000,
       //     browser: ["google chrome", "firefox"],
       //     files: ["client/static/**/*.*","client/templates/**/*.*"]
       // },
        proxy: {
            target: 'localhost:5000', // original port
            ws: true // enables websockets
        },
        browser: ['chrome', 'firefox'],
        files : ['client/static/**/*','client/templates/**/*' ], //watch files to trigger browserSync.reload
    });
});

gulp.task('watch', function(){

    // Watch .scss files
    gulp.watch('client/res/css/**/*.css', ['styles']);

    // Watch .js files
    gulp.watch('client/res/js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('client/res/images/**/*', ['images']);

    // Watch font files
    gulp.watch('client/res/fonts/**/*', ['font']);

    gulp.watch(['./server.js', './server/**/*.js'], ['lint:server', 'server']);

});

gulp.task('build', function(callback){
    runSequence('clean','styles','scripts','images','fonts',callback);
});

gulp.task('default', function(callback){
    runSequence('server', 'browserSync', 'watch',callback);
});

gulp.task('server', function(){
    if (node) node.kill();
    node = child.spawn('node', ['server.js'], {stdio: 'inherit'});
    node.on('close', function(code){
        if (code === 8){
            gulp.log('Error detected, waiting for changes...');
        }
    });
});
gulp.task('debug', function(){
    if (node) node.kill();
    node = child.exec('node-debug server.js', {stdio: 'inherit'});
    node.on('close', function(code){
        if (code === 8){
            gulp.log('Error detected, waiting for changes...');
        }
    });
});