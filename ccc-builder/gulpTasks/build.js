var gulp = require("gulp");
var minimist = require("minimist");
var fs = require("fs");
var exec = require("child_process").exec
var http = require("http");
var queryString = require("querystring");

var meta = {}

var knownOptions = {
    string: ["path", "env", "configPath", "force"],
    default: { env: "pro", configPath: "./settings/builder.json", path: "./", "platform": "web-mobile" }
}

var options = minimist(process.argv.slice(2), knownOptions);


var buildConfigs;
var topConfigPath;
var versionReg = /"version"\s*:\s*"\d+.\d+.\d+"/g;
var uuids = [];


function checkUuids(cb) {
    var itemId = buildConfigs.itemId;
    var ver = buildConfigs.version;
    var uuidsStr = uuids.toString();
    var data = {
        "hStr": uuidsStr,
        "gameId": itemId,
        "version": ver
    };

    var content = queryString.stringify(data);
    // var content = JSON.stringify(data);
    var options = {
        hostname: "ccc-uuids-verify.jinpin.com",
        port: 9090,
        path: "/api/hFile/check",
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            var ret = JSON.parse(chunk);
            if (ret.ret) {
                console.log("+++ check uuids success +++");
                cb();
            }
            else {
                console.log("+++ check uuids failed +++");
            }
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.write(content);
    req.end();
}

gulp.task("test", function (cb) {
    // 1. 根据环境拷贝不同的constans文件
    // 2. 构建
    // 3. 生成热更信息,及元数据信息
    console.log(`env:${options.env}, test:${options.test}, cwd:${process.cwd()}`);
    cb();
})

gulp.task("build-init", function (cb) {
    var cwd = process.cwd();
    // 遍历env文件夹，初始化没有的配置
    var builderPath = `${cwd}/ccc-builder/env`;
    var path = `${cwd}/env`;
    var files = fs.readdirSync(builderPath);
    // var needCopy = [];
    files.forEach((file) => {
        // console.log(`temp path:${path}/${file}`)
        if (!fs.existsSync(`${path}/${file}`) || options.force) {
            var tempPath = `${builderPath}/${file}`;
            if (fs.statSync(tempPath).isDirectory()) {
                gulp.src(`${builderPath}/${file}/**/*`).pipe(gulp.dest(`${cwd}/env/${file}`));
            }
            else {
                gulp.src(`${builderPath}/${file}`).pipe(gulp.dest(`${cwd}/env/`));

            }
        }
    });


    // yml
    if (!fs.existsSync(`${cwd}/.gitlab-ci.yml`)) {
        gulp.src(`${cwd}/ccc-builder/.gitlab-ci.yml`).pipe(gulp.dest(`${cwd}`));
    }

    // build.json
    if (!fs.existsSync(`${cwd}/build.json`)) {
        gulp.src(`${cwd}/ccc-builder/build.json`).pipe(gulp.dest(`${cwd}`));
    }
    cb();
})

gulp.task("copyTemplates", function (cb) {
    copyTemplates(cb);
});

gulp.task("checkAssets", function (cb) {
    if(!buildConfigs) initBuildConfig();
    var assetsPath = `${options.path}assets`;
    var ret = checkAssets(assetsPath);
    printCheckAssetsResult(ret);
    if (ret.length > 0) {
        process.exit();
    }
    raiseVersion();
    checkUuids(cb)
    // cb();

});

function printCheckAssetsResult(ret) {
    if (ret.length > 0) {
        console.error("================= Assets Check Error =================")
    }
    else {
        console.log("check assets ok");
        return;
    }

    for (var i = 0; i < ret.length; ++i) {
        console.error(`check assets error:${ret[i][0]} ==> ${ret[i][1]}`)
    }

    if (ret.length > 0) {
        console.error("================= Assets Check Error =================")
    }

}

function checkAssets(path) {
    // uuids = [];
    var ret = [];
    var dirs = fs.readdirSync(path);
    for (var i = 0; i < dirs.length; ++i) {
        var file = `${path}/${dirs[i]}`;
        var st = fs.statSync(file);
        if (st.isFile()) {
            if (file.endsWith(".meta")) {
                // 检查有没对应的文件
                var fileName = file.substring(0, file.length - 5);
                // 文件是否存在
                if (!fs.existsSync(fileName)) {
                    ret.push([fileName, "missed file!"]);
                }

                // 获取其UUID
                var content = fs.readFileSync(file).toString();
                var uuid = JSON.parse(content).uuid
                if (uuid) {
                    uuids.push(uuid);
                }
                else {
                    throw new Error("faild to get uuid:" + file);
                }
            }
            else {
                // 检查有没对应的.meta文件
                var metaFileName = `${file}.meta`;
                if (!fs.existsSync(metaFileName)) {
                    ret.push([metaFileName, "missed .meta file!"]);
                }
            }
        }
        else {
            var tempRet = checkAssets(file);
            ret = ret.concat(tempRet);
        }
    }

    return ret;
}

// 复制一些构建
function copyTemplates(cb) {
    var root = `${options.path}`;
    var realEnvPath = `${root}/env/${options.env}/`;
    var preTemplatesPath = `${realEnvPath}pre-templates/`;
    console.log(`root:${root}, realEnvPath:${realEnvPath}`);
    if (fs.existsSync(preTemplatesPath)) {
        copy(preTemplatesPath, root);
    }
    cb();
}

function copy(src, dst) {
    var files = fs.readdirSync(src);
    var tempSrc, tempDst, readable, writable;
    for (var i = 0; i < files.length; ++i) {
        tempSrc = `${src}/${files[i]}`;
        tempDst = `${dst}/${files[i]}`;
        var st = fs.statSync(tempSrc);
        if (st.isFile()) {
            readable = fs.createReadStream(tempSrc);
            writable = fs.createWriteStream(tempDst);
            readable.pipe(writable);
        }
        else {
            makeExists(tempDst);
            copy(tempSrc, tempDst);
        }
    }
}

function makeExists(dst) {
    var ret = fs.existsSync(dst);
    if (ret) {
        return;
    }

    fs.mkdirSync(dst);
}

function cocosBuild(cb) {

    var path = options.path
    // 构建配置路径
    var configPath = options.configPath;
    var platform = options.platform;
    var extra = genBuildParams();

    // 生成构建参数列表
    console.log(`build args, path:${options.path}, configPath:${options.configPath}, env:${options.env}, platform:${platform}, extra:${extra}`);
    var cmd = `CocosCreator.exe --path ${path} --build "configPath=${configPath}${extra};platform=${platform}"`;
    console.log(`cmd:${cmd}`);
    exec(cmd, function (error, stdout, stdErr) {
        if (!error) {
            console.log(`build success, error:${stdout}`);
            // 打包完成，插入热更路径
            var buildPath = buildConfigs.realBuildPath;
            var mainPath = `${buildPath}/main.js`;
            if (fs.existsSync(mainPath)) {
                var oldContent = fs.readFileSync(mainPath).toString();
                var adding =
                    `
                if (window.jsb) {
                    var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
                    if (hotUpdateSearchPaths) {
                        jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
                    }
                }
                `;
                var newContent = adding + oldContent;
                fs.writeFileSync(mainPath, newContent);
            }
        }
        else {
            console.log(`build failed, out:${stdErr}`)
        }

        cb()
    })
}

function genBuildParams() {
    console.log(`now build parans:${buildConfigs}`);
    var ret = "";
    for (var k in buildConfigs) {
        var temp = `;${k}=${buildConfigs[k]}`
        ret += temp;
    }

    return ret;
}

function raiseVersion() {
    if ("sit" !== options.env) return;
    var version = buildConfigs.version;
    if (!version) throw new Error("version must be specified in build.json");
    var versionParts = version.split(".");
    if (versionParts.length < 3) {
        // 初始化
        buildConfigs.version = "0.0.1";
        return;
    }
    // 检查每一部分是否合法
    for (var i = 0; i < versionParts.length; ++i) {
        if (isNaN(parseInt(versionParts[i]))) {
            throw new Error("please make sure each part of version is valid number");
        }
    }

    var last = versionParts[2];
    var lastVNum = parseInt(last);
    last = lastVNum + 1 + "";

    buildConfigs.version = `${versionParts[0]}.${versionParts[1]}.${last}`.replace(/\s*/g, "");
    // cb();
}

function storeVersion(cb) {
    if ("sit" !== options.env) return cb();
    // 读取
    var old = fs.readFileSync(topConfigPath).toString();
    var newStr = `"version": "${buildConfigs.version}"`;
    console.log(`origin:${old}, old version:${buildConfigs.oldVersion}, new version:${buildConfigs.version}`);
    var finalStr = old.replace(/"version"\s*:\s*"\d+.\d+.\d+"/g, newStr);
    fs.writeFileSync(topConfigPath, finalStr);

    cb();
}

function genHotUpdateVersion(cb) {
    // `node version_generator.js -v ${version} -u http://119.23.238.216:9090/Public/items/2431/ -s build/web-mobile -d assets/resources`
    // `node version_generator.js -v ${version} -u ${remote} -s build/web-mobile -d ${dest}`
    // 提升版本号
    // raiseVersion();

    var version = buildConfigs.version;
    if (!version) throw new Error("version must be specified in build.json")

    var remoteRule = buildConfigs.remoteRule || ["remoteUrl"];

    // var dest = buildConfigs.manifestDest;
    var dest = `./dist/${buildConfigs.itemId}/`;
    if (!dest) throw new Error("manifestDest must be specified in build.json")
    // 确保目标路径
    if (!fs.existsSync("dist")) {
        fs.mkdirSync("dist");
    }
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }

    var remote = "";
    for (var i = 0; i < remoteRule.length; ++i) {
        var v = buildConfigs[remoteRule[i]];
        if (!v) v = remoteRule[i];
        remote += v;
    }

    var buildPath = buildConfigs.realBuildPath;
    if (!buildPath) throw new Error("buildPath must be specified in build.json");
    // buildPath = `${buildPath}/${options.platform}`

    console.log(`start to gen-version, version:${version}, remote:${remote}, buildPath:${buildPath}, dest:${dest}`)
    exec(`node ./ccc-builder/version_generator.js -v ${version} -u ${remote} -s ${buildPath} -d ${dest}`, function (err, stdOut, stdErr) {
        if (err) {
            console.log(`Gen Version Failed, error:${stdErr}`);
        }
        else {
            console.log(`Gen Version Success, out:${stdOut}`);
        }

        // 复制文件
        // gulp.src([`${dest}/version.manifest`, `${dest}/project.manifest`])
        //     .pipe(gulp.dest(`${buildPath}`)
        //         .pipe(gulp.dest(`./dist/${buildConfigs.itemId}/`))
        //     );
        cb();
    })
}

function pushVersion(cb) {
    var version = buildConfigs.version;
    // var orientation = buildConfigs.orientation || "";
    if (!meta) meta = {};
    meta.version = version;
    cb();
}

function pushEntrance(cb) {
    var buildPath = buildConfigs.realBuildPath;
    var srcPath = `${buildPath}/src`;
    var pa = fs.readdirSync(srcPath);
    var indexFileName, settingsFileName;
    pa.forEach(function (ele, index) {
        console.log(`file:${ele}`);
        var info = fs.statSync(`${srcPath}/${ele}`);
        if (info.isFile() && ele.endsWith(".js")) {
            if (ele.startsWith("project")) {
                indexFileName = ele;
            }

            if (ele.startsWith("settings")) {
                settingsFileName = ele;
            }
        }
    });
    if (!meta) meta = {};
    meta.index = indexFileName;
    meta.settings = settingsFileName;

    cb();
}

function saveMeta(cb) {
    if (!meta) return cb();

    var buildPath = buildConfigs.realBuildPath;
    var metaStr = JSON.stringify(meta, null, 2);
    fs.writeFileSync(`${buildPath}/meta.json`, metaStr);

    cb()
}

function saveMetaToProject(cb) {
    if (!meta) return cb();
    var path = buildConfigs.metaDest;
    if (!path) path = "assets/resources";
    var metaStr = JSON.stringify(meta, null, 2);
    fs.writeFileSync(`${path}/${buildConfigs.itemId}_meta.json`, metaStr);

    cb();
}

function moveBuildResult(cb) {
    var buildPath = buildConfigs.realBuildPath;
    gulp.src([`${buildPath}/**/*`,
    `!${buildPath}/frameworks`,
    `!${buildPath}/frameworks/**/*`,
    `!${buildPath}/jsb-adapter`,
    `!${buildPath}/jsb-adapter/**/*`,
    `!${buildPath}/subpackages`, `!${buildPath}/subpackages/**/*`])
        .pipe(gulp.dest(`./dist/${buildConfigs.itemId}/`));

    // 将资源描述文件复制一份放入对应版本
    var dest = `./dist/${buildConfigs.itemId}/`;
    gulp.src([`${dest}version.manifest`, `${dest}project.manifest`]).pipe(gulp.dest(`${dest}ver-${buildConfigs.version}`));
    cb();
}

function compile(cb) {
    var path = options.path
    // 构建配置路径
    var configPath = options.configPath;
    var platform = options.platform;
    var extra = genBuildParams();
    // 暂时任何情况下都不编译
    if (platform.startsWith("web")) {
        console.log(`>>>> web platform need not compile, so ignore`)
        cb();
    }
    else {
        var cmd = `CocosCreator.exe --path ${path} --compile "configPath=${configPath}${extra};platform=${platform};debug=false"`;
        console.log(`now start to compile, cmd:${cmd}`);
        exec(cmd, function (error, stdout, stdErr) {
            if (!error) {
                console.log(`compile success, error:${stdout}`)
            }
            else {
                console.log(`compile failed, out:${stdErr}`)
            }

            cb()
        })
    }
}

/**
 * 过滤掉JSON文本中的注释
 * @param json 
 */
function filterCommentsInJson(json) {
    return json.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
}

function initBuildConfig(cb) {
    var cwd = process.cwd();
    // buildConfigs = require(`${cwd}/build.json`);
    topConfigPath = `${cwd}/build.json`;
    if (fs.existsSync(topConfigPath)) {
        console.log(`raw:${fs.readFileSync(topConfigPath).toString()}, after:${filterCommentsInJson(fs.readFileSync(topConfigPath).toString())}`);
        var buildConfigStr = filterCommentsInJson(fs.readFileSync(topConfigPath).toString());
        buildConfigs = JSON.parse(buildConfigStr);
        if (!buildConfigStr.match(new RegExp(versionReg))) {
            throw new Error(`please make sure the version is valid: ${buildConfigs.version}`);
        }

        var env = options.env;
        // 获取并合并对应环境的build配置
        var envBuildPath = `${cwd}/env/${env}/build.json`;
        if (fs.existsSync(envBuildPath)) {
            console.log(`exist env build:${env}`);
            var envBuildStr = filterCommentsInJson(fs.readFileSync(envBuildPath).toString());
            var envBuild = JSON.parse(envBuildStr);
            for (var k in envBuild) {
                buildConfigs[k] = envBuild[k];
            }
        }
        // 设置构建路径
        buildConfigs["buildPath"] = "build";
        // 初始化真正的 buildPath,此路径根据发布平台有所不同
        // var buildPath = `${buildConfigs.buildPath}/${options.platform}`;
        var realBuildPath = `${buildConfigs.buildPath}/${options.platform == "web-mobile" ? "web-mobile" : "jsb-link"}`;
        buildConfigs["realBuildPath"] = realBuildPath;
        // 特殊处理appABIs
        var old = buildConfigs["appABIs"];
        if (old && old.length > 0) {
            var abisStr = "[";
            for (var i = 0; i < old.length; ++i) {
                abisStr += `'${old[i]}',`
            }
            // 移除多余的,
            abisStr = abisStr.substring(0, abisStr.length - 1);
            abisStr += "]"
            buildConfigs["appABIs"] = abisStr;
        }
        cb && cb();
    }
    else {
        throw new Error("should have a top build config");
    }
}


gulp.task("build", gulp.series(
    initBuildConfig,
    "checkAssets",
    copyTemplates,
    // raiseVersion,
    // checkUuids,
    pushVersion,
    saveMetaToProject,
    cocosBuild,
    pushEntrance,
    saveMeta,
    genHotUpdateVersion,
    storeVersion,
    moveBuildResult,
    compile
));

gulp.task("switchEnv", gulp.series(
    copyTemplates
));
