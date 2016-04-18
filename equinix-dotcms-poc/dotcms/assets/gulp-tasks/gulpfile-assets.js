var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('./gulpfile-configuration');
var webdav = require('./gulpfile-webdav');
var utils = require('./gulpfile-utils');
var path = require('path');
var webdavsync = require( 'gulp-webdav-sync' );
var debug = require('gulp-debug');

//These files get copied to the build directory, and nothing else
var assetFiles = [
//        config.SOURCE_APP_DIR + 'themes/bootstrap3/**/*.vm',
//        config.SOURCE_APP_DIR + 'themes/bootstrap3/**/*.vtl',
//        config.SOURCE_APP_DIR + 'themes/bootstrap3/fonts/**',
//        config.SOURCE_APP_DIR + 'themes/bootstrap3/images/**',
//        config.SOURCE_APP_DIR + 'themes/bootstrap3/images-2x/**',
//        config.SOURCE_APP_DIR + 'themes/bootstrap3/images-svg/**',
//        config.SOURCE_APP_DIR + 'themes/bootstrap3/css/rss.css',
        config.SOURCE_APP_DIR + 'themes/equinix/**',
        config.SOURCE_APP_DIR + 'vtl/**/*.vm',
        config.SOURCE_APP_DIR + 'vtl/**/*.vtl'
//        config.SOURCE_APP_DIR + 'images/**',
//        config.SOURCE_APP_DIR + 'images-2x/**',
//        config.SOURCE_APP_DIR + 'images-svg/**',
//        config.SOURCE_APP_DIR + 'js/web-components/jquery-ui-1.10.3.custom.min.js',
//        config.SOURCE_APP_DIR + 'js/web-components/jquery.ui.datepicker-fr.min.js',
//        config.SOURCE_APP_DIR + 'lib/underscore-min.js',
//        config.SOURCE_APP_DIR + 'lib/html5shiv-printshiv.js',
//        config.SOURCE_APP_DIR + 'lib/jquery-1.9.1.min.js',
//        config.SOURCE_APP_DIR + 'lib/bootstrap.min.js',
//        config.SOURCE_APP_DIR + 'lib/respond.min.js',
//        config.SOURCE_APP_DIR + 'lib/tween.min.js',
//        config.SOURCE_APP_DIR + 'lib/jquery.placeholder.min.js'
];
assetFiles = utils.filterPathsByConfiguredSite(assetFiles);

// filets to be synced with *-everything
var syncFiles = [
    config.BUILD_APP_DIR + 'vtl/**',
    config.BUILD_APP_DIR + 'themes/**',
    config.BUILD_APP_DIR + 'images/**',
    config.BUILD_APP_DIR + 'images-2x/**',
    config.BUILD_APP_DIR + 'images-svg/**',
    config.BUILD_APP_DIR + 'lib/**'
];
syncFiles = utils.filterPathsByConfiguredSite(syncFiles);


module.exports = {
    initGulpTasks: initGulpTasks,
    assetFilesToWatch: assetFiles,
    runForChangedFileAndSync: runForChangedFileAndSync
};

function initGulpTasks() {
    gulp.task('assets', function() {
        return gulp.src( assetFiles, {base: config.SOURCE_DIR})
            .pipe(plugins.changed(config.BUILD_DIR))
            .pipe(gulp.dest(config.BUILD_DIR));
    });

    gulp.task('send-everything:assets', function() {
        return syncFiles.map(function(file) {
                return webdav.syncExistingFile(file);
        });
    });
}


//Called by the watcher
function runForChangedFileAndSync(filePath) {
    for (var site of config.DISTINCT_SITES) {
        gulp.src(filePath, {base: config.SOURCE_APP_DIR})
            .pipe(gulp.dest(config.BUILD_APP_DIR))
            .pipe(webdavsync(webdav.getWebdavOptions(site)))
            .pipe(plugins.livereload());
    }
}



