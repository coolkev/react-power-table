var // appRoot = require('app-root-path'),
    typescript = require('typescript'),
    babelJest = require('babel-jest');

const tsConfig = require(`./tsconfig.json`);

        //console.log('typescript-babel-jest test');

module.exports = {
    process(src, path) {


        const isTypeScript = path.endsWith('.ts') || path.endsWith('.tsx');
        const isJavaScript = path.endsWith('.js') || path.endsWith('.jsx');

        if (isTypeScript) {
            src = typescript.transpile(
                src,
                tsConfig.compilerOptions,
                path,
                []
            );
        
            console.log('File Contents after TS transpile: ' + path, src);
            console.log('');
            console.log('');
            console.log('');
            console.log('');
        }

        if (isJavaScript || isTypeScript) {
            // babel-jest hack for transpile src without file
            const fileName = isJavaScript
                ? path
                : 'file.js';

            src = babelJest.process(
                src,
                fileName
            );

            console.log('File Contents after babelJest ' + path, src);
             console.log('');
            console.log('');
            console.log('');
            console.log('');
        }

        return src;
    },
};