var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash-compat');
var config = require('./gulpfile-configuration');
var utils = require('./gulpfile-utils');
var path = require('path');
var fs = require('fs');
var del = require('del');
var webdav = require('gulp-webdav-sync');
var debug = require('gulp-debug');

var vmInfo = config.vmInfo;

module.exports = {
    gulpSendIfNewer: gulpSendIfNewer,
    getWebdavOptions: getWebdavOptions,
    syncExistingFile: syncExistingFile
};

gulp.task('clean-webdav', function() {
    var options = getWebdavOptions();
    options.clean = true;
    options.pathname = options.pathname + "application/";

    return webdav(options).clean();
});

function getWebdavOptions(site){
    if (_.isUndefined(site)) {
        site = config.SITES[0];
    }

    return {
        protocol: vmInfo.protocol + ":"
        , auth: vmInfo.username + ":" + vmInfo.password
        , hostname: vmInfo.host
        , port: vmInfo.port
        , pathname: vmInfo.pathname + site.name + '/'
        , log: 'log'
        , logAuth: true
        , base: config.BUILD_DIR
        , uselastmodified: 2000
    };
}

function gulpSendIfNewer() {
    for (var site of config.DISTINCT_SITES) {
        gulp.src(config.BUILD_APP_DIR + '**').pipe(webdav(getWebdavOptions(site)));
    }
}

function syncExistingFile(filePath) {
    return gulp.src(filePath, {base: config.BUILD_APP_DIR})
        .pipe(webdav(getWebdavOptions()));
}
