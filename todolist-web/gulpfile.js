const gulp = require('gulp');
const eventStream = require('event-stream');
const streamqueue = require('streamqueue');
const flatten = require('gulp-flatten');
const concat = require('gulp-concat');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
//const karma = require('gulp-karma');
const livereload = require('gulp-livereload');

const app = 'app';
const components = 'bower_components';
const tmp = 'tmp';
const dist = 'dist';

const paths = {
    scripts: {
        libs: [
            {path: './' + components + '/angular/index.js', expose: 'angular'}
        ],
        src: [
            app + '/app-module.js',
            app + '/**/*.js'
            //'!' + app + '/**/*.spec.js'
        ]
    },
    css: [
        components + '/bootstrap/dist/css/bootstrap.css',
        app + '/**.css',
        app + '/**/*.css'
    ],
    images: app + '/**/*.{png,jpg,svg,gif}',
    fonts: components + '/**/*.ttf',
    misc: [{
        src: [app + '/index.html', app + '/**/*.html'],
        dest: dist + '/'
    }],
    clean: [tmp + '/js/**.js']
};

function handleError(err) {
    console.warn(err.message);
    this.emit('end');
}

gulp.task('libs', ['clean'], function () {
    const bundle = browserify({debug: true});
    paths.scripts.libs.forEach(function (path) {
        bundle.require(path.path, {expose: path.expose});
    });
    return bundle
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(gulp.dest(dist + '/js'));
});

gulp.task('scripts:precompile', ['libs'], () => gulp
        .src(paths.scripts.src)
        .pipe(gulp.dest(tmp + '/js/'))
);

gulp.task('scripts', ['scripts:precompile'], function () {
    const bundle = browserify({entries: [tmp + '/js/app-module.js'], extensions: ['.js']});
    paths.scripts.libs.forEach(function (path) {
        bundle.external(path.expose);
    });
    return bundle
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest(dist + '/js'));
});

gulp.task('styles', [], () => gulp
        .src(paths.css)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(dist + '/css'))
        .pipe(livereload())
);

gulp.task('images', [], () => gulp
        .src(paths.images)
        .pipe(gulp.dest(dist + '/img/'))
);

gulp.task('fonts', [], () => gulp
        .src(paths.fonts)
        .pipe(flatten())
        .pipe(gulp.dest(dist + '/fonts/'))
);

gulp.task('misc', [], function () {
    return eventStream.merge.apply(null, paths.misc.map(function (item) {
        return gulp.src(item.src)
            .pipe(gulp.dest(item.dest));
    }));
});

gulp.task('clean', [], () => del(paths.clean));

gulp.task('watch', [], function () {
    livereload.listen();
    [
        gulp.watch([paths.scripts.src], ['scripts']),
        gulp.watch(paths.css, ['styles']),
        gulp.watch(paths.images, ['images']),
        gulp.watch(paths.misc.map(function (item) {
            return item.src;
        }), ['misc'])
    ].forEach(function (watch) {
            watch.on('change', function (event) {
                console.log('File %s was %s, running tasks...', event.path, event.type);
            });
        });
});

//gulp.task('test', ['default'], function () {
//    return gulp.src('./fake') // fake is use for karma to load files from karma.conf.js
//        .pipe(karma({
//            configFile: 'karma.conf.js',
//            action: 'run'
//        }))
//        .on('error', handleError);
//});
//
//gulp.task('testWatch', ['default'], function () {
//    return gulp.src('./fake') // fake is use for karma to load files from karma.conf.js
//        .pipe(karma({
//            configFile: 'karma.conf.js',
//            action: 'watch'
//        }))
//        .on('error', handleError);
//});

gulp.task('default', [
    'scripts',
    'styles',
    'misc',
    'fonts',
    'images'
]);

//gulp.task('tdd', ['default', 'testWatch']);