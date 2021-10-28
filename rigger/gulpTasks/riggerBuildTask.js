var gulp = require("gulp");
var RiggerBuildUtils = require("./utils/riggerBuildUtils.js");
var RiggerUpdateUtils = require("./utils/riggerUpdateUtils.js");
var RiggerInitUtils = require("./utils/riggerInitUtils.js");


gulp.task("init-rigger-config", function(cb){
    RiggerBuildUtils.initRiggerConfigFile();
    cb();
})


gulp.task("rigger-update-plugin", function(cb){
    RiggerUpdateUtils.updatePlugins();
    cb();
})

gulp.task("rigger-update-group", function(cb){
    RiggerUpdateUtils.updateGroups();
    cb();
})

gulp.task("rigger-build", gulp.series("init-rigger-config", function(cb){
    RiggerBuildUtils.build();
    cb()
}));


gulp.task("rigger-config", gulp.series("init-rigger-config", function(cb){
    RiggerBuildUtils.reConfig();
    cb();
}));

gulp.task("rigger-update", gulp.series("rigger-update-plugin","rigger-update-group", function(cb){
    RiggerUpdateUtils.updateServices();
    cb();
}))





gulp.task("rigger-init", gulp.series("init-rigger-config", function(){
    return RiggerInitUtils.init();
}));