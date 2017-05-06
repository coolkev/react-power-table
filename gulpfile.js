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
    jest = require('gulp-jest').default;



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
//const babelOptions = require('./.babelrc');

//console.log('process.env.NODE_ENV=' + process.env.NODE_ENV);

gulp.task("build", function () {

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
    //let tsProject = typescript.createProject('./examples/tsconfig.json');

    return gulp.src(["./examples/src/boot.tsx"])
        //.pipe(sourcemaps.init())
        .pipe(gulpWebpack(require('./examples/webpack.config.js'), webpack))
        .pipe(gulp.dest("./examples/dist"));


});

gulp.task('start', function (c) {
    var myConfig = require('./examples/webpack.config.js');

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), myConfig.devServer).listen(myConfig.devServer.port, 'localhost', function (err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
    });
});


// gulp.task('jest', function () {

//     //var config = require('./package.json');
//     //process.env.NODE_ENV = 'test';

//     var config = {
//         "globals": {
//             "__TS_CONFIG__": {
//                 "module": "commonjs",
//                 "jsx": "react"
//             }
//         },
//         "testMatch": ["**/?(*.)(spec|test).ts?(x)"],
//         "testRegex": null,
//         "moduleFileExtensions": [
//             "ts",
//             "tsx",
//             "js"
//         ],
//         "transform": {
//             ".(ts|tsx)": "ts-jest/preprocessor.js"
//         },
//         "snapshotSerializers": [
//             "enzyme-to-json/serializer"
//         ]
//     }

//     return gulp.src('tests').pipe(jest({
//         config: config
//     }));
// });



// gulp.task("build:tests", ['clean:tests-dist'], function () {

//     let tsProject = typescript.createProject('./tsconfig.json', { declaration: false });
//     var config = require('./package.json');

//     let typescriptCompile = gulp.src(["./**/*.ts?(x)", "!node_modules/**/*", '!examples/**/*.tsx', 'examples/src/shared.ts'])
//         .pipe(sourcemaps.init())
//         .pipe(tsProject());

//     process.env.NODE_ENV = 'test';

//     return typescriptCompile.js
//         .pipe(babel())
//         //.pipe(concat("Scripts/script.js"))
//         //.pipe(sourcemaps.write("./", { sourceRoot: "/src" }))
//         .pipe(gulp.dest("./tests-dist"))

//         // .pipe(jest({
//         //     config: {
//         //         "transformIgnorePatterns": [
//         //             "<rootDir>/dist/", "<rootDir>/node_modules/"
//         //         ],
//         //         "automock": false
//         //     }
//         // }));
//         ;

// });


// gulp.task("test", function () {

//     // let tsProject = typescript.createProject('./tsconfig.json', { declaration: false, jsx:'react' });
//     // var config = require('./package.json');

//     // let typescriptCompile = gulp.src(["./**/*.ts?(x)"])
//     //     .pipe(sourcemaps.init())
//     //     .pipe(tsProject());

//     process.env.NODE_ENV = 'test';

//     return gulp.src(["./**/*.ts?(x)"])
//         //.pipe(babel())
//         //.pipe(concat("Scripts/script.js"))
//         //.pipe(sourcemaps.write("./", { sourceRoot: "/src" }))
//         //.pipe(gulp.dest("./tests-dist"))

//         .pipe(jest({
//             config: {
//                 "transformIgnorePatterns": [
//                     "<rootDir>/dist/", "<rootDir>/node_modules/"
//                 ],
//                 "automock": false
//             }
//         }));


// });







gulp.task('watch', function () {
    gulp.watch('./src/**/*', './examples/**/*', ['typescript']);
});






gulp.task('default', ['build']);