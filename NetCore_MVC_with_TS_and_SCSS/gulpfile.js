const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const gulp_typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');


// build ts/modules/*.ts
function buildTsModules(env) {
    var autoGenText = '/* This is auto generated, go to Task Runner Explorer and run bundleJS */\n\n\n';

    // get the _tsconfig.json, we need to do this to control the ordering of modules
    // when we concat all modules into 1 file
    var ts = gulp_typescript.createProject('./wwwroot/ts/modules/_tsconfig.json');

    // create the pipeline
    var pipeline = ts.src()
        .pipe(ts())
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
        .pipe(gulp.dest('./wwwroot/js'));

    return pipeline;
}


gulp.task('build-ts-modules', () => buildTsModules(/*'Production'*/));