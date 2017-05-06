var babel = require("gulp-babel"),
    //glob = require("glob"),
    gulp = require("gulp"),
    gutil = require('gulp-util'),
    //concat = require('gulp-concat'),
    sourcemaps = require("gulp-sourcemaps"),
    del = require('del'),

    typescript = require("gulp-typescript"),
    merge = require('merge2'),
    gulpWebpack = require('gulp-webpack'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    jestCli = require('jest-cli'),
    coveralls = require('gulp-coveralls');



gulp.task("build", function () {

    const babelOptions = {
        "presets": [
            [
                "latest", {
                    "es2015": {
                        "modules": false
                    }
                }
            ]
        ],
        "plugins": [
            "transform-es2015-modules-commonjs"
        ]
    };
    let tsProject = typescript.createProject('./tsconfig.json', { declaration: true, declarationDir: '@types' });

    let typescriptCompile = gulp.src(["./src/**/*.ts?(x)"])
        //.pipe(sourcemaps.init())
        .pipe(tsProject());
    return merge([typescriptCompile.js
        .pipe(babel(babelOptions))
        //.pipe(concat("Scripts/script.js"))
        //.pipe(sourcemaps.write("./", { sourceRoot: "/src" }))
        .pipe(gulp.dest("./dist")),
    typescriptCompile.dts.pipe(gulp.dest('./@types')),

    ]);
});

const buildFolders = ['dist', 'docs', 'examples/dist', '@types', 'tests-dist'];

buildFolders.forEach(f => {
    gulp.task('clean:' + f, function () {
        return del([f]).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'));
        });
    });

});

gulp.task('clean', function () {
    return del(buildFolders).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

gulp.task("examples", function () {

    return gulp.src(["./examples/src/boot.tsx"])
        .pipe(gulpWebpack(require('./examples/webpack.config.js'), webpack))
        .pipe(gulp.dest("./examples/dist"));


});

gulp.task('start', function (cb) {
    var myConfig = require('./examples/webpack.config.js');

    // jestCli.runCLI({ watch: true }, __dirname, function (result) {
    //     gutil.log('[jestCli]', result);
    //     cb();
    //     // if (result.numFailedTests || result.numFailedTestSuites) {
    //     //     return new gutil.PluginError('gulp-jest', { message: 'Tests Failed' });
    //     // } 
    // });


    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), myConfig.devServer).listen(myConfig.devServer.port, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
        cb();
    });
});

gulp.task("test", function (cb) {

    //process.env.NODE_ENV = 'test';
    jestCli.runCLI({  }, __dirname, function (result) {


        if (result.numFailedTests || result.numFailedTestSuites) {
            cb(new gutil.PluginError('gulp-jest', { message: 'Tests Failed' }));
        }
        else {
            cb();
        }
    });

});

gulp.task("test:coverage", function (cb) {

    //process.env.NODE_ENV = 'test';
    jestCli.runCLI({ coverage: true }, __dirname, function (result) {


        if (result.numFailedTests || result.numFailedTestSuites) {
            cb(new gutil.PluginError('gulp-jest', { message: 'Tests Failed' }));
        }
        else {
            cb();
        }
    });

});



gulp.task("coveralls", ['test:coverage'], function () {
    return gulp.src('tests/coverage/remapped/**/lcov.info')
        .pipe(coveralls());
});


gulp.task("docs", function () {
    return gulp
    .src([ 'examples/index.html','examples/dist/*.js?(.map)'], { base: 'examples' })
    .pipe(gulp.dest('docs/'));
});



// gulp.task('watch', function () {
//     gulp.watch('./src/**/*', './examples/**/*', ['typescript']);
// });


//cat ./tests/coverage/remapped/lcov.info | ./node_modules/.bin/coveralls



gulp.task('default', ['build']);