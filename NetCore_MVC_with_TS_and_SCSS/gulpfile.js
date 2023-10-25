const gulp = require('gulp');
// const gulp_sass = require('gulp-sass');
const gulp_typescript = require('gulp-typescript');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

let siteCSS = [
    './wwwroot/scss/site.scss'
];

// build kendo.scss
gulp.task('build-kendo', () => (
    gulp.src('./wwwroot/scss/kendo.scss')
        .pipe(sass())
        .pipe(gulp.dest('./wwwroot/css'))
));

// build kendo.scss (minified)
gulp.task('build-kendo-minified', () => (
    gulp.src('./wwwroot/scss/kendo.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(csso())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./wwwroot/css'))
));

// build site.scss
gulp.task('build-site', () => (
    gulp.src(siteCSS)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('site.css'))
        .pipe(gulp.dest('./wwwroot/css'))
));

// build site.scss (minified)
gulp.task('build-site-minified', () => (
    gulp.src(siteCSS)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('site.css'))
        .pipe(csso())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./wwwroot/css'))
));

// build ts/modules/*.ts
function buildTsModules(env) {
    var autoGenText = '/* This is auto generated, go to Task Runner Explorer and run bundleJS */\n\n\n';

    // get the _tsconfig.json, we need to do this to control the ordering of modules
    // when we concat all modules into 1 file
    var ts = gulp_typescript.createProject('./wwwroot/ts/modules/_tsconfig.json');

    // create the pipeline
    var pipeline = ts.src()
        .pipe(ts())
        //.pipe(sourcemaps.init())
        .js
        .pipe(replace(/^import\s.*from.*$/gm, (match) => `// ${match}`))
        .pipe(replace(/export /gm, ''))
        .pipe(concat('site-modules.js'))
        ;

    if (env == 'Production') {
        pipeline = pipeline
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            ;
    }

    pipeline = pipeline
        .pipe(replace(/^/, autoGenText))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./wwwroot/js'));

    return pipeline;
}

// build ts/*.ts except modules/*.ts
function buildTs(env) {
    var pipeline = gulp.src([
        './wwwroot/ts/**/*.ts',
        '!./wwwroot/ts/modules/*.ts'
    ])
        //.pipe(sourcemaps.init())
        .pipe(gulp_typescript({
            noImplicitAny: false,
            target: 'es6',
            sourceMap: true
        }))
        .js
        .pipe(replace(/^import\s.*from.*$/gm, (match) => `// ${match}`))
        .pipe(replace(/export /gm, ''))
        .pipe(concat('site.js'))
        ;

    if (env == 'Production') {
        pipeline = pipeline
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            ;
    }

    pipeline = pipeline
        .pipe(replace(/^/, '/* This is auto generated, go to Task Runner Explorer and run bundleJS */\n\n\n'))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./wwwroot/js'));

    return pipeline;
}

// build *.ts under .cshtml
function buildCSHTMLTs(env) {
    var pipeline = gulp.src([
        './Areas/**/*.ts',
        './Views/**/*.ts'
    ])
        .pipe(sourcemaps.init())
        .pipe(gulp_typescript({
            noImplicitAny: false,
            target: 'es6',
            sourceMap: true,
            rootDir: './'
        }))
        .js
        .pipe(replace(/^import\s.*from.*$/gm, (match) => `// ${match}`))
        .pipe(replace(/^export /gm, (match) => `// ${match}`))
        .pipe(rename(function (path) {
            path.basename = path.basename.replace('.cshtml', '');
        }))
        ;

    if (env == 'Production') {
        pipeline = pipeline
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            ;
    }

    pipeline = pipeline
        .pipe(replace(/^/, '/* This is auto generated, go to Task Runner Explorer and run bundleJS */\n\n\n'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./wwwroot/js'));

    return pipeline;
}

gulp.task('build-ts', () => buildTs(/*'Production'*/));
gulp.task('build-ts-cshtml', () => buildCSHTMLTs(/*'Production'*/));
gulp.task('build-ts-modules', () => buildTsModules(/*'Production'*/));

exports.$bundleCSS = gulp.series
    (
        'build-kendo',
        'build-site',
        'build-kendo-minified',
        'build-site-minified'
    );

exports.$bundleJS = gulp.series
    (
        'build-ts-modules',
        'build-ts',
        'build-ts-cshtml'
    );