const gulp = require('gulp');
const typedoc = require("gulp-typedoc");
var rename = require("gulp-rename");
const del = require('del');

const __coverageThreshold = 60;

gulp.task("typedoc", function () {
    return gulp
        .src([
            "./src/**/*.ts",
            "!./src/**/index.ts",
            "!./src/SN.ts",
            "!./src/SN.d.ts"
        ])
        .pipe(typedoc({
            module: "commonjs",
            target: "es2015",
            includeDeclarations: false,
            out: "./documentation/html",
            name: "sn-client-js",
            theme: "default",
            ignoreCompilerErrors: true,
            version: true,
            mode: "modules",
            readme: "sn-client-js/README.md",
            excludeExternals: true,
            excludePrivate: true,
            includes: "docs",
            experimentalDecorators: true
        }));
});


gulp.task("typedoc:md:generate", function () {
    return gulp
        .src([
            "./src/**/*.ts",
            "!./src/**/index.ts",
            "!./src/SN.ts",
            "!./src/SN.d.ts"
        ])
        .pipe(typedoc({
            module: "commonjs",
            target: "es2015",
            includeDeclarations: false,
            out: "./documentation/markdown",
            name: "sn-client-js",
            theme: "node_modules/typedoc-md-theme/bin",
            ignoreCompilerErrors: true,
            version: true,
            mode: "modules",
            readme: "sn-client-js/README.md",
            excludeExternals: true,
            excludePrivate: true,
            includes: "docs"
        }));
});

gulp.task('typedoc:md', ['typedoc:md:generate'], () => {
    gulp.src('./documentation/markdown/**/*.*')
        .pipe(rename((path) => {
            path.extname = path.extname === '.html' ? '.md' : path.extname;
        }))
        .pipe(gulp.dest('documentation/markdown_renamed'));
});