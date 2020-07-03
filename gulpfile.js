const gulp = require('gulp');
const imagemin = require('gulp-imagemin');


exports.default = () => (
    gulp.src('images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public'))
);
