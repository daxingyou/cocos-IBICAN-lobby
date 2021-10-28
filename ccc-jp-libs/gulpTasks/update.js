var gulp = require("gulp");
var fs = require("fs");
var prog = require('child_process');
function pull(cb) {
    var libPath = "./ccc-jp-libs";
    prog.execFileSync("pull.bat", [], { cwd: `${libPath}` });
    cb();
}

function applyFiles(cb) {
    gulp.src(["./ccc-jp-libs/libs/**/*",
        "!./ccc-jp-libs/libs/common/scenes/**/*"]).pipe(gulp.dest("./assets/libs"));
    // 检测是否有场景
    var libScenesDir = `./ccc-jp-libs/libs/common/scenes`;
    var projSceneDir = `./assets/libs/common/scenes`;
    var libFiles = fs.readdirSync(libScenesDir);
    libFiles.forEach((file) => {
        if (!fs.existsSync(`${projSceneDir}/${file}`)) {
            gulp.src(`${libScenesDir}/${file}`).pipe(gulp.dest(`${projSceneDir}/`));
        }
    })
    cb()
}

function clearDir(path, exception) {
    var files = fs.readdirSync(path);
    for (var i = 0; i < files.length; ++i) {
        var temp = `${path}/${files[i]}`;
        // console.log(temp);
        if (exception && temp == exception) continue;
        var st = fs.statSync(temp);
        if (st.isDirectory()) {
            clearDir(temp, exception);
            if(fs.readdirSync(temp).length <= 0){
                fs.rmdirSync(temp);
            }
        }
        else {
            if(temp.endsWith(".meta")) continue;
            fs.unlinkSync(temp);
        }
    }
}

gulp.task("libs-clear", function (cb) {
    var dest = "./assets/libs"
    // var exception = `${dest}/common/scenes`;
    // console.log(`excp:` + exception);
    clearDir(dest, `${dest}/common/scenes`);
    cb();
})

gulp.task("libs-update", gulp.series(
    pull,
    "libs-clear",
    applyFiles
))

gulp.task("libs-apply", function (cb) {
    applyFiles(cb);
})
