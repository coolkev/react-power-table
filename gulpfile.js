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
    coveralls = require('gulp-coveralls'),
    fs = require('fs'),
    tslint = require("gulp-tslint");

gulp.task("build", ['lint'],function () {

    // const babelOptions = {
    //     "presets": [
    //         [
    //             "latest",
    //             {
    //               "es2015": {
    //                 "modules": false
    //               }
    //             }
    //         ]
    //     ]
    // };

    let tsProject = typescript.createProject('./tsconfig.json', { declaration: true, declarationDir: '@types' });

    let typescriptCompile = gulp.src(["./src/**/*.ts?(x)"])
        //.pipe(sourcemaps.init())
        .pipe(tsProject());
    return merge([typescriptCompile.js
        .pipe(babel())
        //.pipe(concat("Scripts/script.js"))
        //.pipe(sourcemaps.write("./", { sourceRoot: "/src" }))
        .pipe(gulp.dest("./dist")),
    typescriptCompile.dts.pipe(gulp.dest('./@types')),

    ]);
});



gulp.task("lint", function () {
   
    return gulp.src(["./src/**/*.ts?(x)"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());

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

    //process.env.NODE_ENV = 'production';
    const webpackConfig = require('./examples/webpack.config.js');

    return gulp.src(["./examples/src/boot.tsx"])
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest("./examples/dist"));


});


function runJest(options, cb) {
    jestCli.runCLI(options, [__dirname], function (result) {

        if (result.numFailedTests || result.numFailedTestSuites) {
            cb(new gutil.PluginError('gulp-jest', { message: 'Tests Failed' }));
        }
        else {
            cb();
        }
    });

}



gulp.task('start', (cb) => {

    runJest({ watch: true, silent: true, coverage: true }, cb);


    var webpackConfig = require('./examples/webpack.config.js');
    return new WebpackDevServer(webpack(webpackConfig), webpackConfig.devServer).listen(webpackConfig.devServer.port, 'localhost', function (err) {
        if (err) {
            cb(new gutil.PluginError('webpack-dev-server', err));
        }
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
    }).on('close', () => {
        cb();
    });


});

gulp.task('start:web', (cb) => {
    
        var webpackConfig = require('./examples/webpack.config.js');
        return new WebpackDevServer(webpack(webpackConfig), webpackConfig.devServer).listen(webpackConfig.devServer.port, 'localhost', function (err) {
            if (err) {
                cb(new gutil.PluginError('webpack-dev-server', err));
            }
            gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
        }).on('close', () => {
            cb();
        });
    
    
    });
    
// });
// this is not working because each time it reloads, it compiles an additional time
// gulp.task('start', (cb)=> {

//     process.env.NODE_ENV = 'development';

//     function startDevServer() {

//         var webpackConfig = require('./examples/webpack.config.js');

//         return new WebpackDevServer(webpack(webpackConfig), webpackConfig.devServer).listen(webpackConfig.devServer.port, 'localhost', function (err) {
//             if (err) {
//                 cb(new gutil.PluginError('webpack-dev-server', err));
//             }
//             gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
//         });

//     }

//     var devServer = startDevServer();
//     gulp.watch('./examples/webpack.config.js', function () {

//         gutil.log('[webpack-dev-server]', 'webpack.config.js changed.... reloading webpack-dev-server');
//         delete require.cache[require.resolve('./examples/webpack.config.js')]
//         gutil.log('[webpack-dev-server]', 'stopping webpack-dev-server');
//         devServer.close();
//         gutil.log('[webpack-dev-server]', 'stopped webpack-dev-server');
//         gutil.log('[webpack-dev-server]', 'starting webpack-dev-server');
//         devServer = startDevServer();


//     });

// });

gulp.task("test", function (cb) {

    runJest({ silent: true }, cb);

});

gulp.task("test:coverage", function (cb) {

    //process.env.NODE_ENV = 'test';
    runJest({ silent: true, coverage: true }, cb);

});



gulp.task("coveralls", ['test:coverage'], function () {
    return gulp.src('tests/coverage/lcov.info')
        .pipe(coveralls());
});


gulp.task("gh-pages", ['examples'], function () {
    return gulp
        .src(['examples/index.html', 'examples/dist/*.js?(.map)'], { base: 'examples' })
        .pipe(gulp.dest('gh-pages/'));
});



// gulp.task('watch', function () {
//     gulp.watch('./src/**/*', './examples/**/*', ['typescript']);
// });


//cat ./tests/coverage/remapped/lcov.info | ./node_modules/.bin/coveralls



gulp.task('default', ['build']);