var gulp = require("gulp");
var concat = require('gulp-concat'); // 需要安装包
var rename = require("gulp-rename");
var fs = require('fs');
var through = require("through2")

var Rigger = require('./rigger.js');
var RiggerUtils = require('./riggerUtils.js')
var uglyfi = require("gulp-uglify");

var RiggerBuildUtils = {
    reConfig: function () {
        Rigger.init();
        if (!RiggerBuildUtils.checkBuild()) return;
        RiggerBuildUtils.buildConfigs();
    },

    build: function () {
        Rigger.init();
        if (!RiggerBuildUtils.checkBuild()) return;
        RiggerBuildUtils.buildConfigs();
        RiggerBuildUtils.buildBin();
        RiggerBuildUtils.buildDts();
    },

    buildConfigs: function () {
        // 初始化Rigger配置
        RiggerBuildUtils.buildRiggerConfigFile();
        // 将服务配置迁移到RiggerConfig中去了，不再零散的配置到各服务中
        // RiggerBuildUtils.buildServiceConfigFiles();
    },

    buildRiggerConfigFile: function () {
        if (!fs.existsSync(Rigger.configPath)) throw new Error(`build rigger config failed:can not find ${Rigger.configPath}`);
        var riggerConfigPath = RiggerBuildUtils.makeRiggerConfigBuildPath();

        return gulp.src(Rigger.configPath)
            .pipe(through.obj(function (file, encode, cb) {
                RiggerUtils.filterCommentsInFile(file);
                this.push(file);
                cb();
            })).pipe(gulp.dest(riggerConfigPath));
    },

    /**
     * 生成RiggerConfig的构建路径
     */
    makeRiggerConfigBuildPath: function () {
        configBuildRoot = RiggerBuildUtils.getConfigBuildPath();
        return `${configBuildRoot}/rigger/riggerConfigs`
    },

    /**
     * 生成各服务的配置构建路径
     */
    makeServiceConfigBuildPath: function () {
        configBuildRoot = RiggerBuildUtils.getConfigBuildPath();
        return `${configBuildRoot}/rigger/riggerConfigs/serviceConfigs`
    },

    getConfigBuildPath: function () {
        var configBuildRoot = Rigger.applicationConfig.configBuildRoot
        if (!configBuildRoot || configBuildRoot == "")
            configBuildRoot = Rigger.applicationConfig.binRoot;

        if (!configBuildRoot || configBuildRoot.length <= 0) return "./build"
        if (configBuildRoot[configBuildRoot.length - 1] == "/") {
            configBuildRoot = configBuildRoot.slice(-2)
        }

        return configBuildRoot
    },

    /**
     * 初始化Rigger的配置
     */
    initRiggerConfigFile: function () {
        if (!fs.existsSync(Rigger.configPath)) {
            return gulp.src("./rigger/RiggerConfig.config").pipe(rename("RiggerConfig.json")).pipe(gulp.dest(`./`));
        }
    },

    buildServiceConfigFiles: function () {
        RiggerBuildUtils.buildKernelServiceConfigFiles();
        RiggerBuildUtils.buildThirdServiceConfigFiles();
        RiggerBuildUtils.buildCustomServiceConfigFiles();
        RiggerBuildUtils.buildPackageConfigFiles();
    },

    buildPackageConfigFiles: function () {
        var pkgRoot = `./rigger/thirdPackages`;
        if (fs.existsSync(pkgRoot)) {
            var dirs = fs.readdirSync(pkgRoot);
            serviceConfigBuildPath = RiggerBuildUtils.makeServiceConfigBuildPath();
            for (var i = 0; i < dirs.length; ++i) {
                var dir = dirs[i];
                // console.log("config dir:" + Rigger.makeThirdServiceConfigPath(dir));
                let connectbinRoot = `./bin/rigger/riggerConfigs/serviceConfigs/rigger.service.ConnectService.json`;
                let mainLogicbinRoot = `./bin/rigger/riggerConfigs/serviceConfigs/rigger.service.MainLogicService.json`;
                if (fs.existsSync(connectbinRoot) && fs.existsSync(mainLogicbinRoot)) {
                    return; //bin文件夹下已经存在json文件时,则build命令不会写入新的json文件
                }
                else if (fs.existsSync(connectbinRoot) && !fs.existsSync(mainLogicbinRoot)) {
                    gulp.src(`${pkgRoot}/${dir}/customServiceConfigs/rigger.service.MainLogicService.json`)
                        .pipe(through.obj(function (file, encode, cb) {
                            RiggerUtils.filterCommentsInFile(file);
                            this.push(file);
                            cb();
                        }))
                        .pipe(gulp.dest(serviceConfigBuildPath));
                }
                else if (!fs.existsSync(connectbinRoot) && fs.existsSync(mainLogicbinRoot)) {
                    gulp.src(`${pkgRoot}/${dir}/customServiceConfigs/rigger.service.ConnectService.json`)
                        .pipe(through.obj(function (file, encode, cb) {
                            RiggerUtils.filterCommentsInFile(file);
                            this.push(file);
                            cb();
                        })).pipe(gulp.dest(serviceConfigBuildPath));
                }
                else {
                    gulp.src(`${pkgRoot}/${dir}/customServiceConfigs/*.json`)
                        .pipe(through.obj(function (file, encode, cb) {
                            RiggerUtils.filterCommentsInFile(file);
                            this.push(file);
                            cb();
                        }))
                        .pipe(gulp.dest(serviceConfigBuildPath));
                }
            }
        }
    },

    buildKernelServiceConfigFiles: function () {
        var ksRoot = Rigger.kernelServiceRoot;
        if (fs.existsSync(ksRoot)) {
            var serviceBuildPath = RiggerBuildUtils.makeServiceConfigBuildPath();
            gulp.src(`${Rigger.makeKernelConfigPath("rigger.service.EventService")}/*.json`)
                .pipe(through.obj(function (file, encode, cb) {
                    RiggerUtils.filterCommentsInFile(file);
                    this.push(file);
                    cb();
                }))
                .pipe(gulp.dest(serviceBuildPath));

            gulp.src(`${Rigger.makeKernelConfigPath("rigger.service.KernelService")}/*.json`)
                .pipe(through.obj(function (file, encode, cb) {
                    RiggerUtils.filterCommentsInFile(file);
                    this.push(file);
                    cb();
                }))
                .pipe(gulp.dest(serviceBuildPath));

            gulp.src(`${Rigger.makeKernelConfigPath("rigger.service.PoolService")}/*.json`).pipe(through.obj(function (file, encode, cb) {
                RiggerUtils.filterCommentsInFile(file);
                this.push(file);
                cb();
            }))
                .pipe(gulp.dest(serviceBuildPath));

            // gulp.src(`${ksRoot}/dts/kernelServices/*/*.json`).pipe(gulp.dest(`${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs`));
        }
    },

    buildThirdServiceConfigFiles: function () {
        var thirdRoot = Rigger.thirdServicesRoot;
        if (fs.existsSync(thirdRoot)) {
            var dirs = fs.readdirSync(thirdRoot);
            var serviceConfigBuildPath = RiggerBuildUtils.makeServiceConfigBuildPath();
            for (var i = 0; i < dirs.length; ++i) {
                var dir = dirs[i];
                // console.log("config dir:" + Rigger.makeThirdServiceConfigPath(dir));
                let dirbinRoot = `${Rigger.applicationConfig.binRoot}/rigger/riggerConfigs/serviceConfigs/${dir}.json`;
                if (fs.existsSync(dirbinRoot)) return; //bin文件夹下已经存在json文件时,则build命令不会写入新的json文件
                gulp.src(Rigger.makeThirdServiceConfigPath(dir)).pipe(through.obj(function (file, encode, cb) {
                    RiggerUtils.filterCommentsInFile(file);
                    this.push(file);
                    cb();
                }))
                    .pipe(gulp.dest(serviceConfigBuildPath));
            }
        }

    },

    /**
     * 构建自定义服务的配置文件
     */
    buildCustomServiceConfigFiles: function () {
        var root = Rigger.applicationConfig.customServicesRoot;
        if (!root || root.length <= 0) return;
        for (var i = 0; i < root.length; i++) {
            var element = root[i];
            RiggerBuildUtils.doBuildServiceConfigFiles(element, Rigger.applicationConfig.binRoot);
        }
    },

    buildBin: function () {
        var binRoot = Rigger.applicationConfig.binRoot;
        if (!binRoot || binRoot.length <= 0) return;
        var src = [];
        src.push(`./rigger/kernel/bin/rigger.js`);
        // var riggerBin = gulp.src(`./rigger/kernel/bin/rigger.js`);
        RiggerBuildUtils.collectServicesSrc(src);
        src.push(`./rigger/thirdPlugins/**/bin/*.js`);
        RiggerBuildUtils.collectPackagesSrc(src);
        // var pluginsBin = gulp.src(`./rigger/thirdPlugins/**/*.js`);
        return gulp.src(src).pipe(uglyfi()).pipe(concat("rigger.min.js")).pipe(gulp.dest(`${binRoot}/rigger`));
        // .pipe(gulp.dest(`${binRoot}/rigger`));
    },

    buildDts: function () {
        var dtsDirs = Rigger.applicationConfig.dtsPathes;
        if (dtsDirs && dtsDirs.length > 0) {
            for (var i = 0; i < dtsDirs.length; i++) {
                var dir = dtsDirs[i];
                RiggerBuildUtils.buildSingleDts(dir);
            }
        }
    },

    buildSingleDts: function (dir) {
        gulp.src("./rigger/**/*.ts").pipe(gulp.dest(`${dir}/rigger`));
    },

    // 
    collectServicesSrc: function (initSrc) {
        var config = Rigger.applicationConfig;
        var depServices = config.services;
        if (!depServices) return initSrc;

        var len = depServices.length;
        var handledServicesMap = {};
        // var bin;
        for (var i = 0; i < len; i++) {
            var sers = depServices[i];
            for (var j = 0; j < sers.length; j++) {
                var ser = sers[j];
                RiggerBuildUtils.collectSingleServiceSrc(ser.fullName, handledServicesMap, initSrc);
            }
        }

        return initSrc;
    },

    collectPackagesSrc: function (initSrc) {
        var config = Rigger.applicationConfig;
        var depPackages = config.packages;
        if (!depPackages) return initSrc;

        var len = depPackages.length;
        for (var i = 0; i < len; ++i) {
            // console.log(`./rigger/thirdPackages/${depPackages[i].fullName}/bin/*.js`);
            initSrc.push(`./rigger/thirdPackages/${depPackages[i].fullName}/bin/*.js`);
        }

        return initSrc;
    },

    collectSingleServiceSrc: function (serviceName, builtMap, src) {
        // 已经构建过了不再重复
        if (builtMap[serviceName]) return src;

        var thirdServicePath = "./rigger/thirdServices";
        var configPath = `${thirdServicePath}/${serviceName}/${serviceName}.json`;
        // 检查服务是否存在     
        if (fs.existsSync(configPath)) {
            // console.log("srvice config:" + configPath);
            // 读取服务的配置文件
            var config = RiggerUtils.readJson(configPath);
            var depServices = config.services;
            if (depServices) {
                for (var i = 0; i < depServices.length; i++) {
                    var sers = depServices[i];
                    for (var j = 0; j < sers.length; j++) {
                        var ser = sers[j];
                        RiggerBuildUtils.collectSingleServiceSrc(ser.fullName, builtMap, src);

                    }
                }
            }
        }
        // 检查BIN文件
        var binPath = `${thirdServicePath}/${serviceName}/bin/${serviceName}.min.js`;
        if (fs.existsSync(binPath)) {
            src.push(binPath);
        }
        builtMap[serviceName] = true;
        // 不存在的情况暂时不处理
        return src;
    },

    doBuildServiceConfigFiles(fromRoot, destRoot) {
        if (!fs.existsSync(fromRoot)) return;
        var dirs = fs.readdirSync(fromRoot);
        var binRoot = Rigger.applicationConfig.binRoot;
        if (!binRoot || binRoot.length <= 0) return;

        var configFilePath;
        var serviceConfigBuildPath = RiggerBuildUtils.makeServiceConfigBuildPath();
        for (var index = 0; index < dirs.length; index++) {
            var dir = dirs[index];
            // console.log(`dir:${dir}`);
            configFilePath = `${fromRoot}/${dir}/*.json`;
            gulp.src(configFilePath)
                .pipe(through.obj(function (file, encode, cb) {
                    RiggerUtils.filterCommentsInFile(file);
                    this.push(file);
                    cb();
                }))
                .pipe(gulp.dest(serviceConfigBuildPath));
        }
    },

    checkBuild: function () {
        if (!Rigger.applicationConfig) Rigger.init();
        if (Rigger.applicationConfig.projectType === "rigger") {
            throw new Error("Rigger Project can not be built!");
        }
        return true;
    }


};

module.exports = {
    build: RiggerBuildUtils.build,
    buildConfigs: RiggerBuildUtils.buildConfigs,
    initRiggerConfigFile: RiggerBuildUtils.initRiggerConfigFile,
    reConfig: RiggerBuildUtils.reConfig,
}