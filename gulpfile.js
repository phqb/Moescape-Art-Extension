const gulp = require('gulp');
const rollup = require('rollup');
const minifyCSS = require('gulp-csso');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const minifyJS = require('uglify-es').minify;
// Required to include libs from node_modules
const resolve = require('rollup-plugin-node-resolve');
const sass = require('gulp-sass');
const del = require('del');

var plugins = [];

plugins.push(resolve());

plugins.push(commonjs({
    include: [
        'node_modules/mustache/**'
    ],
    sourceMap: false
}));

if (process.env.BUILD === 'production') {
    plugins.push(uglify({
        output: {
            comments: function(node, comment) {
                var text = comment.value;
                var type = comment.type;
                if (type == "comment2") {
                    return /@preserve|@license|@cc_on/i.test(text);
                }
            }
        }
    }, minifyJS));
}

gulp.task('bundle-js', async function() {
	const bundle = await rollup.rollup({
		input: 'src/new-tab.js',
		plugins
	});

	await bundle.write({
		file: 'dist/new-tab.bundle.js',
		format: 'es',
		name: 'app',
		sourcemap: process.env.BUILD === 'development'
	});
});

gulp.task('clean', function() {
	return del(['dist/**/*']);
});

gulp.task('copy', function() {
	return gulp.src([
			'src/background.js', 
			'src/manifest.json',
			'src/new-tab.html',
			'src/fonts/*',
			'src/icons/*'
		])
		.pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
  	return gulp.src('src/sass/*.sass')
	    .pipe(sass({ indentedSyntax: true }).on('error', sass.logError))
	    .pipe(minifyCSS())
	    .pipe(gulp.dest('dist/css'));
});

gulp.task('build', ['bundle-js', 'sass', 'copy']);