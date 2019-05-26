import gulp from 'gulp';

export function copyIndex() {
    // eslint-disable-next-line indent
    return gulp.src('./index.html')
        .pipe(gulp.dest('./dist/'));
}

export function copyCSS() {
    // eslint-disable-next-line indent
    return gulp.src('./style.css')
        .pipe(gulp.dest('./dist/'));
}

export function copyScripts() {
    // eslint-disable-next-line indent
    return gulp.src('./scripts/*.js')
        .pipe(gulp.dest('./dist/scripts'));
}
