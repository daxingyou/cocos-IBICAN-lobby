var gulp = require("gulp");

var RiggerPublishUtils = require("./utils/riggerPublishUtils.js");
var Rigger = require("./utils/rigger.js");
gulp.task("initApplicationConfig", function(cb){
    Rigger.init();
    cb();
})

gulp.task("publish", gulp.series("initApplicationConfig", function(cb){
    RiggerPublishUtils.publish();     
    cb();
}));

