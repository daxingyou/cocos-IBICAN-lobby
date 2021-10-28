var gulp = require("gulp");
var fs = require("fs");
var prog = require('child_process');

// var options = minimist(process.argv.slice(2), knownOptions);

function pull(cb) {
    var libPath = "./ccc-builder";
    prog.execFileSync("pull.bat", [], { cwd: `${libPath}` });
    cb();
}

gulp.task("test", function (cb) {
    // 1. 根据环境拷贝不同的constans文件
    // 2. 构建
    // 3. 生成热更信息,及元数据信息
    console.log(`env:${options.env}, test:${options.test}, cwd:${process.cwd()}`);
    cb();
})


gulp.task("build-update", gulp.series(
    pull,

));
