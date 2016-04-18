var gulp = require('gulp');
var karma = require('karma').server;
var $ = require('gulp-load-plugins')();
var sync = $.sync(gulp).sync;


function initGulpTasks() {
    gulp.task('tests', function(done) {
        return karma.start({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }, done);
    });
}

module.exports = {
    initGulpTasks: initGulpTasks
};