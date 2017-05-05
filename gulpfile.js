var babel = require("gulp-babel"),
    //glob = require("glob"),
    gulp = require("gulp"),
    gutil = require('gulp-util'),
    //concat = require('gulp-concat'),
    //sourcemaps = require("gulp-sourcemaps"),
    del = require('del'),

    typescript = require("gulp-typescript"),
    merge = require('merge2'),
    gulpWebpack = require('gulp-webpack'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    jest = require('gulp-jest').default;



gulp.task("typescript", function () {

    let tsProject = typescript.createProject('./src/tsconfig.json', { declaration: true });

    let typescriptCompile = gulp.src(["./src/**/*.ts?(x)"])
        //.pipe(sourcemaps.init())
        .pipe(tsProject());
    return merge([typescriptCompile.js
        .pipe(babel({
            presets: ["es2015"],
            moduleIds: false
        }))
        //.pipe(concat("Scripts/script.js"))
        //.pipe(sourcemaps.write("./", { sourceRoot: "/src" }))
        .pipe(gulp.dest("./dist")),
    typescriptCompile.dts.pipe(gulp.dest('./@types')),

    ]);
});
gulp.task('clean', function () {
    return del([
        'dist',
        'docs', 'examples/dist', '@types'
    ]).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

gulp.task("examples", function () {
    //let tsProject = typescript.createProject('./examples/tsconfig.json');

    return gulp.src(["./examples/src/boot.tsx"])
        //.pipe(sourcemaps.init())
        .pipe(gulpWebpack(require('./examples/webpack.config.js'), webpack))
        .pipe(gulp.dest("./examples/dist"));


});

gulp.task('webpack-dev-server', function (c) {
    var myConfig =  require('./examples/webpack.config.js');

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), myConfig.devServer).listen(myConfig.devServer.port, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
    });
});


gulp.task('jest', function () {

    var config =  require('./package.json');
    
    return gulp.src('tests').pipe(jest({ config: config.jest }));
});










gulp.task('watch', function () {
    gulp.watch('./src/**/*', './examples/**/*', ['typescript']);
});






gulp.task('default', ['typescript']);