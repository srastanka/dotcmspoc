var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('./gulpfile-configuration');
var webdav = require('./gulpfile-webdav');
var utils = require('./gulpfile-utils');
var path = require('path');
var webdavsync = require( 'gulp-webdav-sync' );
var es = require('event-stream');
var print = require('gulp-print');
var changed = require('gulp-changed');

var styleFiles = [
        config.SOURCE_APP_DIR + 'themes/bootstrap3/scss/ie9-and-below.scss',
        config.SOURCE_APP_DIR + 'themes/bootstrap3/scss/bootstrap.scss',
        config.SOURCE_APP_DIR + 'css/main.scss',
        config.SOURCE_APP_DIR + 'css/dotcms-edit-styles.scss'
];
styleFiles = utils.filterPathsByConfiguredSite(styleFiles);

var styleFilesToWatch = [
        config.SOURCE_APP_DIR + 'css/**/*.scss',
        config.SOURCE_APP_DIR + 'themes/bootstrap3/scss/**/*.scss'
];
styleFilesToWatch = utils.filterPathsByConfiguredSite(styleFilesToWatch);


var syncFiles = [
    config.BUILD_APP_DIR + '**/*.css',
    config.BUILD_APP_DIR + 'css/**'
];
syncFiles = utils.filterPathsByConfiguredSite(syncFiles);


module.exports = {
    initGulpTasks: initGulpTasks,
    styleFilesToWatch: styleFilesToWatch,
    runForChangedFileAndSync: runForChangedFileAndSync
};

function initGulpTasks() {
    gulp.task('styles', function() {
        return getSassTasks(styleFiles);
    });

    gulp.task('minify:styles', function() {
        return gulp.src(config.BUILD_APP_DIR + '**/*.css')
            .pipe(plugins.minifyCss())
            .pipe(plugins.changed(config.BUILD_DIR))
            .pipe(gulp.dest(config.BUILD_APP_DIR))
            .pipe(plugins.size());
    });

    gulp.task('send-everything:styles', function() {
        return syncFiles.map(function(file) {
            return webdav.syncExistingFile(file);
        });
    });
}

function getSassTasks(files, cb, suppressErrors ) {
    var sassFn = plugins.sass({ style: 'compressed' });
    if (suppressErrors)
        sassFn = sassFn.on('error', function(err) { console.warn(err.message); });

    if(!cb){
        cb = function(){
            return print(function(file) {
                console.log("Style result file:");
                console.log("     " + file);
            });
        }
    }

    return es.pipeline(
        gulp.src(files, {base: config.SOURCE_APP_DIR})
        ,plugins.changed(config.SOURCE_APP_DIR, { extension: '.css' })
        ,plugins.sourcemaps.init()
        ,sassFn
        ,plugins.autoprefixer('last 2 version', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 7', 'android 4')
        ,plugins.sourcemaps.write()
        ,gulp.dest(config.BUILD_APP_DIR)
        ,cb(files)
    );
}

//Called by the watcher
function runForChangedFileAndSync(filePath) {
    var theseFiles;
    if (!utils.endsWith(filePath, 'edit-styles.scss') && !utils.endsWith(filePath, 'ie9-and-below.scss')) {
        theseFiles = styleFiles.filter(function(file) { return utils.endsWith(file, '/main.scss')});
    } else {
        theseFiles = styleFiles;
    }
    return getSassTasks(theseFiles, function(fileArray){
        return es.through(function write(data) {
                    this.emit('data', data)
                }
                ,function end() {
                    for (var path of utils.transformSrcPathsToDestPaths(fileArray)) {
                        for (var site of config.DISTINCT_SITES) {
                            gulp.src(path.replace(".scss", ".css")).pipe(webdavsync(webdav.getWebdavOptions(site)))
                                .pipe(plugins.livereload());
                        }
                    }
                    this.emit('end');
                })
        }, true);
}
