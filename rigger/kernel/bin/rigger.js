/**
* name
*/
var rigger;
(function (rigger) {
    var config;
    (function (config) {
        var ApplicationConfig = /** @class */ (function () {
            function ApplicationConfig() {
                /**
                 * 应用名称
                 */
                this.applicationName = "Untitled App";
                /**
                 * 发布服务时，服务源码所在根目录
                 */
                this.srcRoot = "./src";
                /**
                 * 库路径
                 * gulp 会读取此路径中的源文件，所以应写成如下形式:
                 * ["./libs/*.ts"]
                 */
                this.libPathes = [];
                /**
                 * 包含路径
                 * 发布时 gulp会拷贝些路径下的文件到发布项目目录, 形式如下：
                 * ["./libs/*.ts"]
                 */
                this.includingPathes = [];
                /**
                 * Rigger 定义文件需要发布到的路径
                 * 某些情况下可能需要将Rigger的定义文件发布到指定目录以便某些引擎进行编译
                 */
                this.dtsPathes = [];
                /**
                 * 输出目录根路径,主要用于发布Rigger或服务
                 */
                this.outRoot = "./dist";
                /**
                 * 构建项目时，服务执行文件的目标位置,构建项目时会将相关配置复制到此目录下
                 */
                this.binRoot = "./bin";
                /**
                 * 配置的构建目录，如果未设置或为空字串，则同binRoot
                 */
                this.configBuildRoot = "";
            }
            return ApplicationConfig;
        }());
        config.ApplicationConfig = ApplicationConfig;
    })(config = rigger.config || (rigger.config = {}));
})(rigger || (rigger = {}));

/**
* 依赖的组件的信息
*/
var rigger;
(function (rigger) {
    var config;
    (function (config) {
        var DependentComponentInfo = /** @class */ (function () {
            function DependentComponentInfo() {
            }
            return DependentComponentInfo;
        }());
        config.DependentComponentInfo = DependentComponentInfo;
    })(config = rigger.config || (rigger.config = {}));
})(rigger || (rigger = {}));

/**
* name
*/
var rigger;
(function (rigger) {
    var config;
    (function (config) {
        var PackageConfig = /** @class */ (function () {
            function PackageConfig() {
                /**
                 * 包的全名
                 */
                this.fullName = "";
                // 包依赖的自定义服务所在的根目录
                this.customServicesRoot = [];
            }
            return PackageConfig;
        }());
        config.PackageConfig = PackageConfig;
    })(config = rigger.config || (rigger.config = {}));
})(rigger || (rigger = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* name
*/
var rigger;
(function (rigger) {
    var config;
    (function (config) {
        // export class DependentService{
        // 	public fullName:string;
        // 	public src:string;		
        // 	public dest:string;
        // }
        /**
         * 服务配置
         */
        var ServiceConfig = /** @class */ (function (_super) {
            __extends(ServiceConfig, _super);
            function ServiceConfig() {
                return _super.call(this) || this;
            }
            return ServiceConfig;
        }(config.DependentComponentInfo));
        config.ServiceConfig = ServiceConfig;
    })(config = rigger.config || (rigger.config = {}));
})(rigger || (rigger = {}));

/**
* name
*/
var rigger;
(function (rigger) {
    var service;
    (function (service) {
        var AbsService = /** @class */ (function () {
            function AbsService() {
                this.messageListenerMap = {};
                /**
                 * 是否就绪的标志位
                 */
                this.readyFlag = false;
                /**
                 * 服务状态
                 */
                this._serviceStatus = rigger.ServiceStatus.Starting;
                this.plugins = [];
            }
            /**
             * 获取应用
             */
            AbsService.prototype.getApplication = function () {
                return this.application;
            };
            /**
             * 设置应用
             * @param app
             */
            AbsService.prototype.setApplication = function (app) {
                this.application = app;
                AbsService.setApplication(app);
            };
            AbsService.setApplication = function (app) {
                AbsService.application = app;
            };
            /**
             * 获取正在运行的服务
             * @param serviceName
             */
            AbsService.getRunningService = function (serviceName) {
                return AbsService.application.getRunningService(serviceName);
            };
            /**
             * 启动服务
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @param {any[]} startupArgs 启动参数
             *
             * @example resultHandler.runWith([true]) 启动成功
             */
            AbsService.prototype.start = function (resultHandler, serviceConfig, startupArgs) {
                this.mConfig = serviceConfig;
                // 启动插件
                this.startPlugins(new rigger.RiggerHandler(this, this.onAllPluginsStartComplete, [resultHandler, startupArgs]), 0, startupArgs);
            };
            /**
             * 停止服务
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 服务停用成功
             */
            AbsService.prototype.stop = function (resultHandler) {
                this.stopPlugins(resultHandler);
                this.setApplication(null);
                this.clearMessages();
            };
            /**
             * 启动服务
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 重启
             */
            AbsService.prototype.reStart = function (resultHandler) {
                this.onReStart(resultHandler);
            };
            /**
             * 订阅消息
             * @param msg
             * @param caller
             * @param method
             * @param args
             */
            AbsService.prototype.onMessage = function (msg, caller, method) {
                var args = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    args[_i - 3] = arguments[_i];
                }
                var mgr = this.messageListenerMap[msg];
                if (!mgr) {
                    mgr = this.messageListenerMap[msg] = new rigger.utils.ListenerManager();
                }
                mgr.on(caller, method, args);
            };
            /**
             * 取消消息的订阅
             * @param msg
             * @param caller
             * @param method
             */
            AbsService.prototype.offMessage = function (msg, caller, method) {
                var mgr = this.messageListenerMap[msg];
                if (mgr) {
                    mgr.off(caller, method);
                }
            };
            /**
             * 关闭指定消息中所有指定句柄的订阅
             * @param msg
             * @param caller
             * @param method
             */
            AbsService.prototype.offAllMessages = function (msg, caller, method) {
                var mgr = this.messageListenerMap[msg];
                if (mgr) {
                    mgr.offAll(caller, method);
                }
            };
            /**
             * 清除所有的消息订阅
             */
            AbsService.prototype.clearMessages = function () {
                for (var key in this.messageListenerMap) {
                    this.messageListenerMap[key].clear();
                    delete this.messageListenerMap[key];
                }
                this.messageListenerMap = {};
            };
            /**
             * 派发消息
             * @param msg
             * @param args
             */
            AbsService.prototype.dispatchMessage = function (msg) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var mgr = this.messageListenerMap[msg];
                if (mgr) {
                    mgr.execute.apply(mgr, args);
                }
            };
            /**
             *
             * @param methodName
             */
            AbsService.prototype.extendMethod = function (methodName) {
                // 初始化对象的可扩展方法映射表
                var map = this.extendedMethodMap;
                if (!map)
                    map = this.extendedMethodMap = {};
                if (!map[methodName])
                    map[methodName] = { prefixPlugins: [], suffixPlugins: [] };
            };
            /**
             *
             * @param methodName
             * @param args
             */
            AbsService.prototype.executeMethodPrefixExtension = function (methodName, args) {
                // 获取所有的前置插件
                var pluginInfo = this.extendedMethodMap[methodName];
                var plugins = pluginInfo.prefixPlugins;
                // 执行插件                      			
                return this.executeMethodExtension(plugins, methodName, args);
            };
            /**
             *
             * @param methodName
             * @param args
             * @param initResult
             */
            AbsService.prototype.executeMethodSuffixExtension = function (methodName, args, initResult) {
                // 获取所有的后置插件
                var pluginInfo = this.extendedMethodMap[methodName];
                var plugins = pluginInfo.suffixPlugins;
                // 执行
                return this.executeMethodExtension(plugins, methodName, args, initResult);
            };
            AbsService.prototype.hasAnyPlugins = function (methodName) {
                return this.extendedMethodMap[methodName] && (this.extendedMethodMap[methodName].prefixPlugins.length > 0 || this.extendedMethodMap[methodName].suffixPlugins.length > 0);
            };
            /**
             * 服务是否就绪
             */
            AbsService.prototype.isReady = function () {
                return this.readyFlag;
            };
            /**
             * 设置服务状态
             * @param status
             */
            AbsService.prototype.setServiceStatus = function (status) {
                return this._serviceStatus = status;
            };
            /**
             * 获取服务状态
             */
            AbsService.prototype.getServiceStatus = function () {
                return this._serviceStatus;
            };
            Object.defineProperty(AbsService.prototype, "config", {
                /**
                 * 服务的配置
                 */
                get: function () {
                    return this.mConfig;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取服务的配置
             */
            AbsService.prototype.getConfig = function () {
                return this.mConfig;
            };
            /**
             * 启动服务依赖的所有插件
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @param {any} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             *
             * @example resultHandler.runWith([true]) 启动成功
             */
            AbsService.prototype.startPlugins = function (resultHandler, index, startupArgs) {
                if (!this.mConfig)
                    return resultHandler.success();
                var infos = this.mConfig.plugins;
                if (!infos)
                    return resultHandler.success();
                if (index >= infos.length)
                    return resultHandler.success();
                var pluginClass = this.makePluginClass(infos[index].fullName);
                var inst = new pluginClass();
                inst.setOwner(this);
                inst.start(new rigger.RiggerHandler(this, this.onPluginStartComplete, [resultHandler, index + 1, startupArgs, inst]), startupArgs);
            };
            /**
             * 单个插件启动成功
             * @param resultHandler
             * @param index
             * @param startupArgs
             * @param retCode
             */
            AbsService.prototype.onPluginStartComplete = function (resultHandler, index, startupArgs, plugin, retCode) {
                if (0 === retCode) {
                    this.plugins.push(plugin);
                    this.addPluginToMap(plugin);
                    this.startPlugins(resultHandler, index, startupArgs);
                }
                else {
                    throw new Error("failed to start plugin!");
                }
            };
            /**
             * 所有的插件都启动成功了
             * @param resultHandler
             * @param startupArgs
             */
            AbsService.prototype.onAllPluginsStartComplete = function (resultHandler, startupArgs) {
                this.onStart(resultHandler, startupArgs);
            };
            AbsService.prototype.stopPlugins = function (resultHandler) {
                if (this.plugins.length <= 0) {
                    delete this.extendedMethodMap;
                    this.onAllPluginsStopComplete(resultHandler);
                    return;
                }
                var plugin = this.plugins.pop();
                plugin.stop(new rigger.RiggerHandler(this, this.onPluginStopComplete, [plugin, resultHandler]));
            };
            AbsService.prototype.onPluginStopComplete = function (plugin, resultHandler, retCode) {
                plugin.setOwner(null);
                if (0 !== retCode) {
                    console.log("error when stop plugin, error code:" + retCode);
                }
                this.stopPlugins(resultHandler);
            };
            /**
             * 所有插件都停止了
             * @param resultHandler
             */
            AbsService.prototype.onAllPluginsStopComplete = function (resultHandler) {
                this.onStop(resultHandler);
            };
            AbsService.prototype.addPluginToMap = function (plugin) {
                //获取所有的扩展方法集
                var map = this.extendedMethodMap;
                if (!map)
                    return;
                var info;
                for (var key in map) {
                    if (map.hasOwnProperty(key) && typeof this[key] === "function" && typeof plugin[key] === "function") {
                        info = map[key];
                        if (rigger.PluginMode.Prefix === plugin.getPluginMode()) {
                            info.prefixPlugins.push(plugin);
                        }
                        else {
                            info.suffixPlugins.push(plugin);
                        }
                    }
                }
            };
            AbsService.prototype.executeMethodExtension = function (extensions, methodName, args, initRet) {
                if (initRet === void 0) { initRet = null; }
                var plugin;
                for (var i = 0; i < extensions.length; ++i) {
                    plugin = extensions[i];
                    initRet = plugin[methodName].apply(plugin, args.concat([initRet]));
                }
                return initRet;
            };
            AbsService.prototype.makePluginClass = function (fullName) {
                // 优先从注册信息中查找
                if (rigger.BaseApplication.pluginFullNameDefinitionMap && rigger.BaseApplication.pluginFullNameDefinitionMap[fullName])
                    return rigger.BaseApplication.pluginFullNameDefinitionMap[fullName];
                // 动态计算
                return eval(fullName);
            };
            /**
             * 服务名
             */
            AbsService.serviceName = undefined;
            AbsService.application = null;
            return AbsService;
        }());
        service.AbsService = AbsService;
    })(service = rigger.service || (rigger.service = {}));
})(rigger || (rigger = {}));

/**
* 服务插件的抽象基类
* 服务插件默认为后置插件
*/
var rigger;
(function (rigger) {
    var AbsServicePlugin = /** @class */ (function () {
        function AbsServicePlugin() {
            /**
             * 插件模式
             */
            this.pluginMode = rigger.PluginMode.Suffix;
        }
        /**
         * 开始插件（添加插件时调用)
         */
        AbsServicePlugin.prototype.start = function (resultHandler, startupArgs) {
            this.onStart(resultHandler, startupArgs);
        };
        /**
         * 停止插件（卸载插件时调用)
         */
        AbsServicePlugin.prototype.stop = function (resultHandler) {
            this.onStop(resultHandler);
        };
        AbsServicePlugin.prototype.reStart = function (resultHandler) {
            this.onRestart(resultHandler);
        };
        /**
         * 设置插件所有者
         */
        AbsServicePlugin.prototype.setOwner = function (owner) {
            this.owner = owner;
        };
        /**
         * 获取插件所有者
         */
        AbsServicePlugin.prototype.getOwner = function () {
            return this.owner;
        };
        /**
         * 获取插件模式（前置或后置）
         */
        AbsServicePlugin.prototype.getPluginMode = function () {
            return this.pluginMode;
        };
        return AbsServicePlugin;
    }());
    rigger.AbsServicePlugin = AbsServicePlugin;
})(rigger || (rigger = {}));

/**
* name
*/
var rigger;
(function (rigger) {
    var ServiceStatus;
    (function (ServiceStatus) {
        /**
         * 启动中
         */
        ServiceStatus[ServiceStatus["Starting"] = 1] = "Starting";
        /**
         * 运行中
         */
        ServiceStatus[ServiceStatus["Running"] = 2] = "Running";
    })(ServiceStatus = rigger.ServiceStatus || (rigger.ServiceStatus = {}));
    // export class ServiceInfo {
    // 	constructor() {
    // 	}
    // }
    var BaseApplication = /** @class */ (function () {
        function BaseApplication() {
            /**
             * 所有的服务映射
             */
            this._serviceMap = {};
        }
        Object.defineProperty(BaseApplication, "instance", {
            /**
             * 应用的单例
             */
            get: function () {
                if (!BaseApplication.mInstance)
                    BaseApplication.mInstance = new BaseApplication();
                return BaseApplication.mInstance;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         * @param resultHandler
         * @param config 应用配置
         */
        BaseApplication.prototype.start = function (resultHandler, startUpArgs) {
            // 启动核心服务
            this.startKernelService(new rigger.RiggerHandler(this, this.onAllServicesReady, [resultHandler]), startUpArgs);
        };
        /**
         * 停止应用
         */
        BaseApplication.prototype.stop = function () {
        };
        /**
         * 设置配置文件
         */
        BaseApplication.prototype.setConfig = function (cfg) {
            this.applicationConfig = cfg;
        };
        /**
         * 获取配置文件
         */
        BaseApplication.prototype.getConfig = function () {
            return this.applicationConfig;
        };
        /**
         *
         * @param serviceCls
         * @param cb
         */
        BaseApplication.prototype.startService = function (serviceCls, cb, config, startUpArgs) {
            if (config === void 0) { config = null; }
            // 检查是否已经注册过
            var serviceName = serviceCls.serviceName;
            var service = this.getService(serviceName);
            // 服务是否在运行
            if (service)
                return service.getServiceStatus() === ServiceStatus.Running;
            // 服务还没注册,新建服务并注册
            service = new serviceCls();
            // 设置服务状态
            service.setServiceStatus(ServiceStatus.Starting);
            // 注册服务			
            this.registerService(serviceName, service);
            if (config) {
                this.startServiceWithConfig(serviceCls, service, cb, config, startUpArgs);
            }
            else {
                // 获取配置,为启动服务作准备
                var configService = this.getRunningService(rigger.service.ConfigService.serviceName);
                if (configService) {
                    var serConfig = configService.getServiceConfig(serviceName);
                    this.startServiceWithConfig(serviceCls, service, cb, serConfig, startUpArgs);
                    // if(serConfig){
                    // 	this.startServiceWithConfig(serviceCls, service, cb, serConfig);
                    // }
                    // else{
                    // 	throw new Error(`Can Not Get Service Config for ${serviceName}`);
                    // }
                    // configService.getServiceConfig(serviceName, new RiggerHandler(this, this.startServiceWithConfig, [serviceCls, service, cb]));
                }
                // 配置服务特殊处理
                else if (serviceName === rigger.service.ConfigService.serviceName || serviceName === this.newConfigServiceName) {
                    this.startServiceWithConfig(serviceCls, service, cb, null, startUpArgs);
                }
                else {
                    throw new Error("Non-kernel service should be start after ConfigService");
                }
            }
            return false;
        };
        /**
         *
         * @param service
         * @param cb
         * @param config
         * @param startUpArgs?
         */
        BaseApplication.prototype.startServiceWithConfig = function (cls, ser, cb, config, startUpArgs) {
            if (config) {
                if (!rigger.utils.Utils.isNullOrEmpty(config.fullName)) {
                    cls.serviceName = config.fullName;
                }
                else {
                    config.fullName = cls.serviceName;
                }
            }
            var deps = config ? config.services : [];
            if (deps && deps.length > 0) {
                for (var i = 0; i < deps.length; ++i) {
                    var serviceCls = this.makeServiceClass(deps[i].fullName);
                    if (!this.startService(serviceCls, new rigger.RiggerHandler(this, this.startServiceWithConfig, [cls, ser, cb, config, startUpArgs]), null, startUpArgs)) {
                        return;
                    }
                }
            }
            // 准备好了，直接启动
            this.doStartService(cls, ser, config, cb, startUpArgs);
        };
        /**
         * 根据服务名获取服务
         * @param serviceName
         */
        BaseApplication.prototype.getService = function (serviceName) {
            serviceName = this.getRealServiceName(serviceName);
            return this._serviceMap[serviceName];
        };
        /**
         * 根据服务名获取运行中的服务
         * @param serviceName 服务名
         */
        BaseApplication.prototype.getRunningService = function (serviceName) {
            var service = this.getService(serviceName);
            if (!service)
                return null;
            if (service.getServiceStatus() === ServiceStatus.Running)
                return service;
            return null;
        };
        /**
         *
         * @param serviceName
         * @param service
         */
        BaseApplication.prototype.registerService = function (serviceName, service) {
            if (this.isServiceRegistered(serviceName))
                return false;
            this._serviceMap[serviceName] = service;
            return true;
        };
        /**
         *
         * @param serviceName
         */
        BaseApplication.prototype.unregisterService = function (serviceName) {
            if (!this.isServiceRegistered(serviceName))
                return false;
            delete this._serviceMap[serviceName];
            return true;
        };
        /**
         * 服务是否注册过
         * @param serviceName
         */
        BaseApplication.prototype.isServiceRegistered = function (serviceName) {
            return !!this.getService(serviceName);
        };
        /**
         * 服务是否在运行
         * @param serviceName
         */
        BaseApplication.prototype.isServiceRunning = function (serviceName) {
            var service = this.getService(serviceName);
            if (!service)
                return false;
            return service.getServiceStatus() === ServiceStatus.Running;
        };
        /**
         * 所有服务就绪时的回调
         * @param resultHandler
         */
        BaseApplication.prototype.onAllServicesReady = function (resultHandler) {
            resultHandler.success();
        };
        BaseApplication.prototype.makeServiceClass = function (serviceName) {
            // 没有替换信息，直接生成服务类
            if (!BaseApplication.replacedServiceMap)
                return this.doMakeServiceClass(serviceName);
            var newService = BaseApplication.replacedServiceMap[serviceName];
            // 没有指定服务的替换信息，直接生成服务类
            if (rigger.utils.Utils.isNullOrUndefined(newService))
                return this.doMakeServiceClass(serviceName);
            if (rigger.service.ConfigService.serviceName === serviceName)
                this.newConfigServiceName = newService.serviceName;
            return newService;
        };
        BaseApplication.prototype.doMakeServiceClass = function (serviceName) {
            // 没有服务注册信息,直接尝试动态计算
            if (!BaseApplication.serviceFullNameDefinitionMap)
                return eval(serviceName);
            // 查找是否直接有映射
            var Def = BaseApplication.serviceFullNameDefinitionMap[serviceName];
            // 检查是否有指定服务的注册信息
            if (Def) {
                return Def;
            }
            else {
                return eval(serviceName);
            }
        };
        /**
         * 获取真正的服务名(可以将服务名转换成被替换后的服务名)
         * @param serviceName
         */
        BaseApplication.prototype.getRealServiceName = function (serviceName) {
            if (!BaseApplication.replacedServiceMap)
                return serviceName;
            var newService = BaseApplication.replacedServiceMap[serviceName];
            if (rigger.utils.Utils.isNullOrUndefined(newService))
                return serviceName;
            return newService.serviceName;
        };
        BaseApplication.prototype.onKernelServiceReady = function (cb, startUpArgs) {
            console.log("KernelService Ready!");
            this.startNonKernelService(cb, startUpArgs);
        };
        /**
         * 启动核心服务
         */
        BaseApplication.prototype.startKernelService = function (cb, startUpArgs) {
            // 构造核心服务配置
            var kernelConfig = new rigger.config.ServiceConfig();
            // 配置服务
            var depService1 = new rigger.config.ServiceConfig();
            depService1.fullName = rigger.service.ConfigService.serviceName;
            // 对象池服务
            var depService2 = new rigger.config.ServiceConfig();
            depService2.fullName = rigger.service.PoolService.serviceName;
            // 事件服务
            var depService3 = new rigger.config.ServiceConfig();
            depService3.fullName = rigger.service.EventService.serviceName;
            // 先启动配置服务,再启动其它依赖服务
            kernelConfig.services = [depService1, depService2, depService3];
            this.startService(this.makeServiceClass(rigger.service.KernelService.serviceName), new rigger.RiggerHandler(this, this.onKernelServiceReady, [cb, startUpArgs]), kernelConfig, startUpArgs);
        };
        /**
         * 启动非核心服务（用户自己配置的）
         * @param cb
         */
        BaseApplication.prototype.startNonKernelService = function (cb, startUpArgs) {
            var configService = this.getRunningService(rigger.service.ConfigService.serviceName);
            configService.getApplicationConfig(new rigger.RiggerHandler(this, this.startApplicationDependentService, [0, cb, startUpArgs]));
        };
        /**
         * 启动应用依赖的各项服务
         * @param index
         * @param appConfig
         */
        BaseApplication.prototype.startApplicationDependentService = function (index, cb, startUpArgs, appConfig) {
            if (!appConfig)
                throw new Error("faild to get application config.");
            var serviceList = appConfig.services;
            if (serviceList.length <= index)
                return cb.run();
            var ready = true;
            var serviceCls;
            for (var i = 0; i < serviceList[index].length; ++i) {
                serviceCls = this.makeServiceClass(serviceList[index][i].fullName);
                serviceCls.serviceName = serviceList[index][i].fullName;
                if (!this.startService(serviceCls, new rigger.RiggerHandler(this, this.startApplicationDependentService, [index, cb, startUpArgs, appConfig]), null, startUpArgs)) {
                    ready = false;
                }
            }
            if (ready) {
                this.startApplicationDependentService(index + 1, cb, startUpArgs, appConfig);
            }
        };
        /**
         * 启动服务
         * @param service
         * @param cb
         * @param {...any[]} startUpArgs
         */
        BaseApplication.prototype.doStartService = function (cls, service, config, cb, startUpArgs) {
            service.setApplication(this);
            console.log("starting " + cls.serviceName);
            service.start(new rigger.RiggerHandler(this, this.onServiceStartComplete, [cls, service, cb]), config, startUpArgs);
        };
        /**
         * 服务启动完成
         * @param service
         * @param cb
         * @param resutlCode
         */
        BaseApplication.prototype.onServiceStartComplete = function (cls, service, cb, resutlCode) {
            if (0 === resutlCode) {
                service.setServiceStatus(ServiceStatus.Running);
                console.log(cls.serviceName + " is ready.");
                cb.run();
            }
        };
        BaseApplication.replacedServiceMap = {};
        /**
         * 服务全名与其定义的映射
         */
        BaseApplication.serviceFullNameDefinitionMap = {};
        /**
         * 插件命名及其定义的映射
         */
        BaseApplication.pluginFullNameDefinitionMap = {};
        return BaseApplication;
    }());
    rigger.BaseApplication = BaseApplication;
})(rigger || (rigger = {}));

/**
* name
*/
var rigger;
(function (rigger) {
    var PluginMode;
    (function (PluginMode) {
        /**
         * 前置插件
         */
        PluginMode[PluginMode["Prefix"] = 1] = "Prefix";
        /**
         * 后置插件
         */
        PluginMode[PluginMode["Suffix"] = 2] = "Suffix";
    })(PluginMode = rigger.PluginMode || (rigger.PluginMode = {}));
})(rigger || (rigger = {}));

/**
* name
*/
var rigger;
(function (rigger) {
    var RiggerHandler = /** @class */ (function () {
        function RiggerHandler(caller, func, args, once) {
            if (args === void 0) { args = null; }
            if (once === void 0) { once = false; }
            this._once = true;
            this._caller = caller;
            this._method = func;
            this._args = args;
            this._once = once;
        }
        Object.defineProperty(RiggerHandler.prototype, "caller", {
            get: function () {
                return this._caller;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RiggerHandler.prototype, "method", {
            get: function () {
                return this._method;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RiggerHandler.prototype, "once", {
            get: function () {
                return this._once;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RiggerHandler.prototype, "args", {
            get: function () {
                return this._args;
            },
            enumerable: true,
            configurable: true
        });
        RiggerHandler.prototype.dispose = function () {
            this._caller = null;
            this._method = null;
            this._args = null;
        };
        RiggerHandler.create = function (caller, fun, args, once) {
            if (args === void 0) { args = null; }
            if (once === void 0) { once = true; }
            var ret = rigger.service.PoolService.getItem(RiggerHandler.riggerHandlerSign);
            if (ret) {
                ret._caller = caller;
                ret._method = fun;
                ret._args = args;
                ret._once = once;
                return ret;
            }
            return new RiggerHandler(caller, fun, args, once);
        };
        /**
         * 将一个RiggerHandler回收到对象池
         * @param handler
         */
        RiggerHandler.recover = function (handler) {
            handler.dispose();
            rigger.service.PoolService.recover(RiggerHandler.riggerHandlerSign, handler);
        };
        /**
         * 将自身回收至对象池
         */
        RiggerHandler.prototype.recover = function () {
            RiggerHandler.recover(this);
        };
        /**
         * 无参执行
         */
        RiggerHandler.prototype.run = function () {
            if (this._method) {
                return this._method.apply(this._caller, this._args);
            }
        };
        /**
         * 带参执行
         * @param args
         */
        RiggerHandler.prototype.runWith = function (args) {
            if (!args)
                return this.run();
            if (this._method) {
                if (this._args) {
                    return this._method.apply(this._caller, this._args.concat(args));
                }
                else {
                    return this._method.apply(this._caller, args);
                }
            }
            return null;
        };
        RiggerHandler.prototype.success = function () {
            this.runWith([0]);
        };
        RiggerHandler.prototype.fail = function () {
            this.runWith([1]);
        };
        RiggerHandler.riggerHandlerSign = "_riggerHandlerSign";
        return RiggerHandler;
    }());
    rigger.RiggerHandler = RiggerHandler;
})(rigger || (rigger = {}));

var rigger;
(function (rigger) {
    var utils;
    (function (utils) {
        var Byte = /** @class */ (function () {
            function Byte(data) {
                this._dataView = null;
                this._allocated = 8;
                this._pos = 0;
                this._length = 0;
                this._u8d = null;
                this.littleEndian = false;
                this._allocated = 8;
                this._pos = 0;
                this._length = 0;
                this.littleEndian = false;
                if (data) {
                    this._u8d = new Uint8Array(data);
                    this._dataView = new DataView(this._u8d.buffer);
                    this._length = this._dataView.byteLength;
                }
                else {
                    this.resizeBuffer(this._allocated);
                }
            }
            Byte.getSystemEndian = function () {
                if (!Byte.sysEndian) {
                    var buffer = new ArrayBuffer(2);
                    new DataView(buffer).setInt16(0, 256, true);
                    Byte.sysEndian = (new Int16Array(buffer))[0] === 256 ? /*CLASS CONST:laya.utils.Byte.LITTLE_ENDIAN*/ "littleEndian" : /*CLASS CONST:laya.utils.Byte.BIG_ENDIAN*/ "bigEndian";
                }
                return Byte.sysEndian;
            };
            Byte.prototype.clear = function () {
                this._pos = 0;
                this.length = 0;
            };
            Object.defineProperty(Byte.prototype, "byteLength", {
                /**
                 * 有效内容的字节长度
                 */
                // public contentLength: number = 0;
                /**
                 * 占用内存的字节长度
                 */
                get: function () {
                    return this._length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Byte.prototype, "pos", {
                /**
                 * 当前位置(字节)
                 */
                get: function () {
                    return this._pos;
                },
                /**
                 *
                 */
                set: function (value) {
                    this._pos = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Byte.prototype, "length", {
                /**
                 * 长度（字节）
                 */
                get: function () {
                    return this._length;
                },
                set: function (len) {
                    if (this._allocated < len) {
                        this.resizeBuffer(this._allocated = Math.floor(Math.max(len, this._allocated * 2)));
                    }
                    else if (this._allocated > len) {
                        this.resizeBuffer(this._allocated = len);
                    }
                    this._length = len;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Byte.prototype, "bytesAvailable", {
                /**
                 * 可用字节数（从当前位置到终点）
                 */
                get: function () {
                    return this._length - this._pos;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Byte.prototype, "buffer", {
                /**
                 * 缓冲区
                 */
                get: function () {
                    var rstBuffer = this._dataView.buffer;
                    if (rstBuffer.byteLength == this.length)
                        return rstBuffer;
                    return rstBuffer.slice(0, this.length);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Byte.prototype, "endian", {
                /**
                 * 大小端标示
                 */
                get: function () {
                    return this.littleEndian ? "littleEndian" : "bigEndian";
                },
                set: function (endianStr) {
                    this.littleEndian = (endianStr == "littleEndian");
                },
                enumerable: true,
                configurable: true
            });
            /**
            *<p>常用于解析固定格式的字节流。</p>
            *<p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串,此方法不会导致位置移动。</p>
            *@return 读取的字符串。
            */
            Byte.prototype.getString = function () {
                return this.rUTF(this.readUint16());
            };
            /**
            *读取 <code>len</code> 参数指定的长度的字符串。
            *@param len 要读取的字符串的长度。
            *@return 指定长度的字符串。
            */
            Byte.prototype.readCustomString = function (len) {
                var v = "", ulen = 0, c = 0, c2 = 0, f = String.fromCharCode;
                var u = this._u8d, i = 0;
                while (len > 0) {
                    c = u[this._pos];
                    if (c < 0x80) {
                        v += f(c);
                        this._pos++;
                        len--;
                    }
                    else {
                        ulen = c - 0x80;
                        this._pos++;
                        len -= ulen;
                        while (ulen > 0) {
                            c = u[this._pos++];
                            c2 = u[this._pos++];
                            v += f((c2 << 8) | c);
                            ulen--;
                        }
                    }
                }
                return v;
            };
            /**
            *从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象,此方法不会导致POS发生改变。
            *@param start 开始位置。
            *@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
            *@return 读取的 Float32Array 对象。
            */
            Byte.prototype.getFloat32Array = function (start, len) {
                var end = start + len;
                end = (end > this._length) ? this._length : end;
                var v = new Float32Array(this._dataView.buffer.slice(start, end));
                return v;
            };
            /**
             *
             * @param start
             * @param len
             */
            Byte.prototype.getUint8Array = function (start, len) {
                var end = start + len;
                end = (end > this._length) ? this._length : end;
                return new Uint8Array(this._dataView.buffer.slice(start, end));
            };
            Byte.prototype.getUint16Array = function (start, len) {
                var end = start + len;
                end = (end > this._length) ? this._length : end;
                return new Uint16Array(this._dataView.buffer.slice(start, end));
            };
            Byte.prototype.getInt16Array = function (start, len) {
                var end = start + len;
                end = (end > this._length) ? this._length : end;
                return new Int16Array(this._dataView.buffer.slice(start, end));
            };
            /**
            *从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。
            *@param start 开始位置。
            *@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
            *@return 读取的 Float32Array 对象。
            */
            Byte.prototype.readFloat32Array = function (start, len) {
                var end = start + len;
                var ret = this.getFloat32Array(start, len);
                this._pos = end;
                return ret;
            };
            Byte.prototype.readUint8Array = function (start, len) {
                var ret = this.getUint8Array(start, len);
                this._pos = start + len;
                return ret;
            };
            Byte.prototype.readUint16Array = function (start, len) {
                var ret = this.getUint16Array(start, len);
                this._pos = start + len;
                return ret;
            };
            Byte.prototype.readInt16Array = function (start, len) {
                var ret = this.getInt16Array(start, len);
                this._pos = start + len;
                return ret;
            };
            /**
             * 从字节流当前位置读取8位整型值，此方法不会导致位置移动
             */
            Byte.prototype.getInt8 = function () {
                if (this._pos + 1 > this._length)
                    throw new Error("getInt8 error - Out of bounds");
                return this._dataView.getInt8(this.pos);
            };
            /**
             * 从字节流当前位置读取16位整型值，此方法不会导致位置移动
             */
            Byte.prototype.getInt16 = function () {
                if (this._pos + 2 > this._length)
                    throw new Error("getInt16 error - Out of bounds");
                return this._dataView.getInt16(this.pos, this.littleEndian);
            };
            /**
             * 从字节流当前位置读取32位整型值，此方法不会导致位置移动
             */
            Byte.prototype.getInt32 = function () {
                return this._dataView.getInt32(this.pos, this.littleEndian);
            };
            /**
             * 从字节流当前位置读取64位整型值，此方法不会导致位置移动
             */
            Byte.prototype.getInt64 = function () {
                var n1 = this.readInt32();
                var n2 = this.readInt32();
                this._pos -= 8;
                return rigger.utils.Utils.combineInt64([n1, n2]);
            };
            Byte.prototype.getFloat32 = function () {
                if (this._pos + 4 > this._length)
                    throw "getFloat32 error - Out of bounds";
                return this._dataView.getFloat32(this._pos, this.littleEndian);
            };
            Byte.prototype.getFloat64 = function () {
                if (this._pos + 8 > this._length)
                    throw "getFloat64 error - Out of bounds";
                return this._dataView.getFloat64(this._pos, this.littleEndian);
            };
            /**
             * 从字节流当前位置读取8位无符号整型值，此方法不会导致位置移动
             */
            Byte.prototype.getUint8 = function () {
                if (this._pos + 1 > this._length)
                    throw new Error("getUint8 error - Out of bounds");
                return this._dataView.getUint8(this.pos);
            };
            /**
             * 从字节流当前位置读取16位无符号整型值，此方法不会导致位置移动
             */
            Byte.prototype.getUint16 = function () {
                if (this._pos + 2 > this._length)
                    throw new Error("getUint16 error - Out of bounds");
                return this._dataView.getUint16(this._pos, this.littleEndian);
            };
            /**
             * 从字节流当前位置读取32位无符号整型值，此方法不会导致位置移动
             */
            Byte.prototype.getUint32 = function () {
                return this._dataView.getUint32(this.pos, this.littleEndian);
            };
            /**
             * 从字节流当前位置读取64位无符号整型值，此方法不会导致位置移动
             */
            Byte.prototype.getUint64 = function () {
                var n1 = this.readUint32();
                var n2 = this.readUint32();
                this._pos -= 8;
                return rigger.utils.Utils.combineInt64([n1, n2]);
            };
            /**
             * 从字节流当前位置读取8位整型值，并使当前位置向后移动8位
             */
            Byte.prototype.readInt8 = function () {
                var ret = this.getInt8();
                this._pos += 1;
                return ret;
            };
            /**
             * 从字节流当前位置读取16位整型值，并使当前位置向后移动16位
             */
            Byte.prototype.readInt16 = function () {
                var ret = this.getInt16();
                this._pos += 2;
                return ret;
            };
            /**
             * 从字节流当前位置读取32位整型值，并使当前位置向后移动32位
             */
            Byte.prototype.readInt32 = function () {
                var ret = this.getInt32();
                this._pos += 4;
                return ret;
            };
            /**
             * 从字节流当前位置读取64位整型值，并使当前位置向后移动64位
             */
            Byte.prototype.readInt64 = function () {
                var ret = this.getInt64();
                this._pos += 8;
                return ret;
            };
            /**
             * 从字节流当前位置读取8位无符号整型值，并使当前位置向后移动8位
             */
            Byte.prototype.readUint8 = function () {
                var ret = this.getUint8();
                this._pos += 1;
                return ret;
            };
            /**
             * 从字节流当前位置读取16位无符号整型值，并使当前位置向后移动16位
             */
            Byte.prototype.readUint16 = function () {
                var ret = this.getUint16();
                this._pos += 2;
                return ret;
            };
            /**
             * 从字节流当前位置读取32位无符号整型值，并使当前位置向后移动32位
             */
            Byte.prototype.readUint32 = function () {
                var ret = this.getUint32();
                this._pos += 4;
                return ret;
            };
            /**
             * 从字节流当前位置读取64位无符号整型值，并使当前位置向后移动32位
             */
            Byte.prototype.readUint64 = function () {
                var ret = this.getUint64();
                this._pos += 8;
                return ret;
            };
            Byte.prototype.readFloat32 = function () {
                var ret = this.getFloat32();
                this._pos += 4;
                return ret;
            };
            Byte.prototype.readFloat64 = function () {
                var ret = this.getFloat64();
                this._pos += 8;
                return ret;
            };
            /**
             * 写入一个8位的有符号值，并且使位置向后移动8位
             * @param v 写入的值
             */
            Byte.prototype.writeInt8 = function (v) {
                this.ensureWrite(this._pos + 1);
                this._dataView.setInt8(this.pos, v);
                this._pos += 1;
                return this;
            };
            /**
             * 写入一个16位的有符号值，并且使位置向后移动16位
             * @param v 写入的值
             */
            Byte.prototype.writeInt16 = function (v) {
                this.ensureWrite(this._pos + 2);
                this._dataView.setInt16(this.pos, v, this.littleEndian);
                this._pos += 2;
                return this;
            };
            /**
             * 写入一个32位的有符号值，并且使位置向后移动32位
             * @param v 写入的值
             */
            Byte.prototype.writeInt32 = function (v) {
                this.ensureWrite(this._pos + 4);
                this._dataView.setInt32(this.pos, v, this.littleEndian);
                this._pos += 4;
                return this;
            };
            /**
             * 写入一个64位的有符号值，并且使位置向后移动64位
             * @param v 写入的值
             */
            Byte.prototype.writeInt64 = function (v) {
                this.ensureWrite(this._pos + 8);
                // 将一个数字拆成2个数字
                var arr = rigger.utils.Utils.resoleInt64(v);
                // 将其作为两个32位有符号整型写入
                this.writeInt32(arr[0]).writeInt32(arr[1]);
                // this._pos += 8;
                return this;
            };
            /**
             * 写入一个8位的无符号值，并且使位置向后移动8位
             * @param v 写入的值
             */
            Byte.prototype.writeUint8 = function (v) {
                this.ensureWrite(this._pos + 1);
                this._dataView.setUint8(this.pos, v);
                this._pos += 1;
                return this;
            };
            Byte.prototype.writeByte = function (value) {
                this.ensureWrite(this._pos + 1);
                this._dataView.setInt8(this._pos, value);
                this._pos += 1;
                return this;
            };
            Byte.prototype.getByte = function () {
                return this.getInt8();
            };
            Byte.prototype.readByte = function () {
                var ret = this.getByte();
                this._pos += 1;
                return ret;
            };
            /**
             * 写入一个16位的无符号值，并且使位置向后移动16位
             * @param v 写入的值
             */
            Byte.prototype.writeUint16 = function (v) {
                this.ensureWrite(this._pos + 2);
                this._dataView.setUint16(this.pos, v, this.littleEndian);
                this._pos += 2;
                return this;
            };
            /**
             * 写入一个32位的无符号值，并且使位置向后移动32位
             * @param v 写入的值
             */
            Byte.prototype.writeUint32 = function (v) {
                this.ensureWrite(this._pos + 4);
                this._dataView.setUint32(this.pos, v, this.littleEndian);
                this._pos += 4;
                return this;
            };
            /**
             * 写入一个64位的无符号值，并且使位置向后移动64位
             * @param v 写入的值
             */
            Byte.prototype.writeUint64 = function (v) {
                this.ensureWrite(this._pos + 8);
                // 将一个数字拆成2个数字
                var arr = rigger.utils.Utils.resoleInt64(v);
                // 将其作为两个32位无符号整型写入
                this.writeUint32(arr[0]).writeUint32(arr[1]);
                // this.pos += 8;
                return this;
            };
            Byte.prototype.writeFloat32 = function (v) {
                this.ensureWrite(this._pos + 4);
                this._dataView.setFloat32(this.pos, v, this.littleEndian);
                this._pos += 4;
                return this;
            };
            Byte.prototype.writeFloat64 = function (v) {
                this.ensureWrite(this._pos + 8);
                this._dataView.setFloat64(this.pos, v, this.littleEndian);
                this._pos += 8;
                return this;
            };
            Byte.prototype.writeUTFBytes = function (v) {
                var value = v + "";
                for (var i = 0, sz = value.length; i < sz; i++) {
                    var c = value.charCodeAt(i);
                    if (c <= 0x7F) {
                        this.writeByte(c);
                    }
                    else if (c <= 0x7FF) {
                        this.ensureWrite(this._pos + 2);
                        this._u8d.set([0xC0 | (c >> 6), 0x80 | (c & 0x3F)], this._pos);
                        this._pos += 2;
                    }
                    else if (c <= 0xFFFF) {
                        this.ensureWrite(this._pos + 3);
                        this._u8d.set([0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], this._pos);
                        this._pos += 3;
                    }
                    else {
                        this.ensureWrite(this._pos + 4);
                        this._u8d.set([0xF0 | (c >> 18), 0x80 | ((c >> 12) & 0x3F), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], this._pos);
                        this._pos += 4;
                    }
                }
                return this;
            };
            Byte.prototype.writeUTFString = function (value) {
                var tPos = this.pos;
                this.writeUint16(1);
                this.writeUTFBytes(value);
                var dPos = this.pos - tPos - 2;
                if (dPos >= 65536) {
                    throw new Error("writeUTFString byte len more than 65536");
                }
                this._dataView.setUint16(tPos, dPos, this.littleEndian);
                return this;
            };
            Byte.prototype.readUTFBytes = function (len) {
                if (len === void 0) { len = -1; }
                // (len === void 0) && (len = -1);
                if (len == 0)
                    return "";
                var lastBytes = this.bytesAvailable;
                if (len > lastBytes)
                    throw "readUTFBytes error - Out of bounds";
                len = len > 0 ? len : lastBytes;
                return this.rUTF(len);
            };
            Byte.prototype.readUTFString = function () {
                return this.readUTFBytes(this.readUint16());
            };
            /**
             * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
             * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
             * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
             * $NEXTBIG 由于没有判断length和arraybuffer的合法性，当开发者填写了错误的length值时，会导致写入多余的空白数据甚至内存溢出，为了避免影响开发者正在使用此方法的功能，下个重大版本会修复这些问题。
             * @param	arraybuffer	需要写入的 Arraybuffer 对象。
             * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
             * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
             */
            Byte.prototype.writeArrayBuffer = function (arraybuffer, offset, length) {
                if (offset === void 0) { offset = 0; }
                // let leftBytes: number = rigger.utils.Utils.isNullOrUndefined(length) ? arraybuffer.byteLength - offset : length;
                if (utils.Utils.isNullOrUndefined(length) || length == 0)
                    length = arraybuffer.byteLength - offset;
                if (offset < 0 || length < 0)
                    throw new Error("writeArrayBuffer error - Out of bounds");
                // if (length == 0) length = arraybuffer.byteLength - offset;
                this.ensureWrite(this._pos + length);
                var uint8array = new Uint8Array(arraybuffer);
                this._u8d.set(uint8array.subarray(offset, offset + length), this._pos);
                this._pos += length;
                return this;
            };
            /**
             * 将字节流重置为指定长度，重置后，所有内容清空
             * @param byteLen
             */
            // public reset(byteLen?: number): void {
            // 	if (rigger.utils.Utils.isNullOrUndefined(byteLen)) byteLen = Byte.defaultLenth;
            // 	if (!this.dataView) {
            // 		this.init(byteLen)
            // 	}
            // 	else{
            // 		this.dataView = new DataView(this.dataView.buffer.slice(0, Math.min(this.dataView.byteLength, byteLen)));
            // 		// this.contentLength = 0;
            // 		this.pos = 0;
            // 	}
            // }
            // protected ensureBuffer(needByteLen: number) {
            //     // let pos: number = this.dataView.byteOffset;
            //     let has: number = this.byteLength - this.pos;
            //     if (has < needByteLen) {
            //         // let temp: DataView = new DataView(new ArrayBuffer(this.byteLength + needByteLen - has));
            //         // 扩展缓冲
            //         this.dataView =
            //             new DataView(
            //                 rigger.utils.Utils.transferArrayBuffer(this.dataView.buffer, this.byteLength + needByteLen - has)
            //             );
            //     }
            // }
            Byte.prototype.ensureWrite = function (lengthToEnsure) {
                if (this._length < lengthToEnsure)
                    this._length = lengthToEnsure;
                if (this._allocated < lengthToEnsure)
                    this.length = lengthToEnsure;
            };
            // protected init(byteLenOrBuffer: number | ArrayBuffer): void {
            //     if (rigger.utils.Utils.isNumber(byteLenOrBuffer)) {
            //         this.dataView = new DataView(new ArrayBuffer(byteLenOrBuffer));
            //     }
            //     else {
            //         this.dataView = new DataView(byteLenOrBuffer);
            //     }
            //     this.pos = 0;
            // }
            Byte.prototype.resizeBuffer = function (len) {
                try {
                    var newByteView = new Uint8Array(len);
                    if (this._u8d != null) {
                        if (this._u8d.length <= len) {
                            newByteView.set(this._u8d);
                        }
                        else {
                            newByteView.set(this._u8d.subarray(0, len));
                        }
                    }
                    this._u8d = newByteView;
                    this._dataView = new DataView(newByteView.buffer);
                }
                catch (err) {
                    throw "___resizeBuffer err:" + len;
                }
            };
            Byte.prototype.rUTF = function (len) {
                var v = "", max = this._pos + len, c = 0, c2 = 0, c3 = 0, f = String.fromCharCode;
                var u = this._u8d, i = 0;
                while (this._pos < max) {
                    c = u[this._pos++];
                    if (c < 0x80) {
                        if (c != 0) {
                            v += f(c);
                        }
                    }
                    else if (c < 0xE0) {
                        v += f(((c & 0x3F) << 6) | (u[this._pos++] & 0x7F));
                    }
                    else if (c < 0xF0) {
                        c2 = u[this._pos++];
                        v += f(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (u[this._pos++] & 0x7F));
                    }
                    else {
                        c2 = u[this._pos++];
                        c3 = u[this._pos++];
                        v += f(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (u[this._pos++] & 0x7F));
                    }
                    i++;
                }
                return v;
            };
            Byte.prototype.getBuffer = function () {
                return this._dataView.buffer;
            };
            Byte.BIG_ENDIAN = "bigEndian";
            Byte.LITTLE_ENDIAN = "littleEndian";
            Byte.sysEndian = null;
            /**
             * 默认长度
             */
            Byte.defaultLenth = 0;
            return Byte;
        }());
        utils.Byte = Byte;
    })(utils = rigger.utils || (rigger.utils = {}));
})(rigger || (rigger = {}));

/**
 * Decorator
 */
var rigger;
(function (rigger) {
    var utils;
    (function (utils) {
        var DecoratorUtil = /** @class */ (function () {
            function DecoratorUtil(parameters) {
            }
            /**
             * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
             */
            DecoratorUtil.retrievAble = function (v) {
                return DecoratorUtil.retrievAble(v);
            };
            /**
             * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
             */
            DecoratorUtil.retrievable = function (v) {
                return function (target, keyStr) {
                    // console.log(`key str:${keyStr}, v:${v}`);
                    v = v || target[keyStr];
                    target[v] = keyStr;
                };
            };
            /**
             * 替换服务
             * @param oldServiceName 被替换的服务名
             */
            DecoratorUtil.replaceService = function (oldServiceName) {
                return function (ctor, attrName) {
                    rigger.BaseApplication.replacedServiceMap[oldServiceName] = ctor;
                };
            };
            /**
             * 类装饰器
             * 对服务或插件进行注册,此接口主要用于无法动态使用eval函数根据全名获取其类定义的情形
             * 使用此装饰器进行注册时，类应该至少定义了有效的"pluginName"或"serviceName"静态成员之一
             * @param ct
             * @throws 如果被装饰的类中没有定义有效的"pluginName"或"serviceName"静态成员之一,会抛出错误
             * @example @register export default class TestPlugin {}
             */
            DecoratorUtil.register = function (ct) {
                // 检查是否就可注册插件
                if (!utils.Utils.isNullOrEmpty(ct["pluginName"])) {
                    rigger.BaseApplication.pluginFullNameDefinitionMap[ct["pluginName"]] = ct;
                }
                else {
                    // 是否是可注册服务
                    if (!utils.Utils.isNullOrEmpty(ct["serviceName"])) {
                        rigger.BaseApplication.serviceFullNameDefinitionMap[ct["serviceName"]] = ct;
                    }
                    else {
                        // 都不是，报错
                        throw new Error("not a registable service or plugin, please check, constructor:" + ct);
                    }
                }
            };
            DecoratorUtil.makeExtendable = function (beReplacable) {
                if (beReplacable === void 0) { beReplacable = false; }
                return DecoratorUtil.makeExtenasionMethod(beReplacable);
            };
            DecoratorUtil.makeExtenasionMethod = function (replace) {
                return function (target, methodName, value) {
                    // 扩展对象的方法
                    target.extendMethod(methodName);
                    // 扩展方法
                    return {
                        value: function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            // 执行前置插件
                            var obj = this;
                            var preRet = obj.executeMethodPrefixExtension(methodName, args);
                            // 执行原方法
                            var tempRet;
                            if (replace && obj.hasAnyPlugins(methodName)) {
                                tempRet = preRet;
                            }
                            else {
                                tempRet = value.value.apply(this, args);
                            }
                            // 执行后置插件
                            return obj.executeMethodSuffixExtension(methodName, args, tempRet);
                        }
                    };
                };
            };
            /**
             * 将方法申明为可扩展的（可以被插件扩展)
             * @param target 被扩展方法所在对象
             * @param methodName 被扩展的方法
             * @param value 属性描述符
             */
            DecoratorUtil.doExtend = function (target, methodName, value) {
            };
            DecoratorUtil.extendableMethodMapKey = "_$extendableMethodMapKey";
            return DecoratorUtil;
        }());
        utils.DecoratorUtil = DecoratorUtil;
    })(utils = rigger.utils || (rigger.utils = {}));
})(rigger || (rigger = {}));

/**
* name
*/
var rigger;
(function (rigger) {
    var utils;
    (function (utils) {
        var ListenerManager = /** @class */ (function () {
            function ListenerManager() {
            }
            ListenerManager.prototype.dispose = function () {
                this.clear();
            };
            ListenerManager.prototype.on = function (caller, method, args, once) {
                if (once === void 0) { once = false; }
                if (!this.handlers)
                    this.handlers = [];
                this.handlers.push(new rigger.RiggerHandler(caller, method, args, once));
            };
            /**
             * 解除回调
             * @param caller
             * @param method
             */
            ListenerManager.prototype.off = function (caller, method) {
                if (!this.handlers || this.handlers.length <= 0)
                    return;
                var tempHandlers = [];
                for (var i = 0; i < this.handlers.length; i++) {
                    var handler = this.handlers[i];
                    if (handler.caller === caller && handler.method === method) {
                        handler.recover();
                        break;
                    }
                    else {
                        tempHandlers.push(handler);
                    }
                }
                // 把剩下的放回
                ++i;
                for (; i < this.handlers.length; ++i) {
                    tempHandlers.push(this.handlers[i]);
                }
                this.handlers = tempHandlers;
            };
            /**
             * 解除所有回调
             * @param caller
             * @param method
             */
            ListenerManager.prototype.offAll = function (caller, method) {
                if (!this.handlers || this.handlers.length <= 0)
                    return;
                var temp = [];
                var handlers = this.handlers;
                var len = handlers.length;
                for (var i = 0; i < len; ++i) {
                    if (caller !== handlers[i].caller || method !== handlers[i].method) {
                        temp.push(handlers[i]);
                    }
                    else {
                        handlers[i].recover();
                    }
                }
                this.handlers = temp;
            };
            /**
             * 清除所有回调
             */
            ListenerManager.prototype.clear = function () {
                if (!this.handlers || this.handlers.length <= 0)
                    return;
                for (var i = 0; i < this.handlers.length; i++) {
                    var handler = this.handlers[i];
                    handler.recover();
                }
                this.handlers = null;
            };
            // public executeByArray(args:any[]){
            // 	let handlers:RiggerHandler[] = this.handlers;
            // 	let len:number = handlers.length;
            // 	for(var i:number = 0; i < len; ++i){
            // 		handlers[i].runWith(args);
            // 	}
            // }
            ListenerManager.prototype.execute = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!this.handlers || this.handlers.length <= 0)
                    return;
                // this.executeByArray(args);
                var handlers = this.handlers;
                var len = handlers.length;
                for (var i = 0; i < len; ++i) {
                    handlers[i].runWith(args);
                }
            };
            return ListenerManager;
        }());
        utils.ListenerManager = ListenerManager;
    })(utils = rigger.utils || (rigger.utils = {}));
})(rigger || (rigger = {}));

/**
 * Utils
 */
var rigger;
(function (rigger) {
    var utils;
    (function (utils) {
        var Utils = /** @class */ (function () {
            function Utils() {
            }
            /**
             * 截取数字的整数部分，直接丢弃其小数部分
             * @param v
             */
            Utils.trunc = function (v) {
                if (Math.trunc)
                    return Math.trunc(v);
                v = +v;
                return (v - v % 1) || (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
            };
            /**
             * 将一个64位整型转换成一个int型数组(高低位分离)
             * @public
             * @static
             * @method resoleInt64
             * @param {number} int64 需要转换的64位整型
             * @return {number[]} 一个包含两个32位整型的数组
             */
            Utils.resoleInt64 = function (int64) {
                var s = Math.pow(2, 32);
                var r = int64 % s;
                var d = (int64 - r) / s;
                return [d, r];
            };
            /**
             * 将一个int数据组(高低位)转成一个long型
             * @public
             * @static
             * @method combineInt64
             * @param {number[]} ints 一个包含两个32位整型的数组
             *
             */
            Utils.combineInt64 = function (ints) {
                var s = Math.pow(2, 32);
                return ints[0] * s + ints[1];
            };
            Utils.transferArrayBuffer = function (oldBuffer, newByteLength) {
                if (ArrayBuffer.transfer) {
                    return ArrayBuffer.transfer(oldBuffer, newByteLength);
                }
                oldBuffer = Object(oldBuffer);
                var dest = new ArrayBuffer(newByteLength);
                // 是否分配内存失败
                if (!(dest instanceof ArrayBuffer)) {
                    throw new TypeError("Source and destination must be ArrayBuffer instances");
                }
                Utils.copyArrayBuffer(oldBuffer, 0, dest, 0, oldBuffer.byteLength);
                return dest;
            };
            /**
             * 复制ArrayBuffer
             * @param source
             * @param sourceStartByte
             * @param dest
             * @param destStartByte
             * @param copyBytes
             */
            Utils.copyArrayBuffer = function (source, sourceStartByte, dest, destStartByte, copyBytes, considerTraint) {
                if (considerTraint === void 0) { considerTraint = true; }
                if (dest.byteLength - destStartByte >= copyBytes) {
                    var wordSizes = [8, 4, 2, 1];
                    var leftBytes = copyBytes;
                    var ViewClass = Uint8Array;
                    var wordSize = 1;
                    for (var i = 0; i < wordSizes.length; ++i) {
                        wordSize = wordSizes[i];
                        if (leftBytes >= wordSize) {
                            switch (wordSize) {
                                // 同时要检查对齐
                                case 8:
                                    if (sourceStartByte % 8 == 0 && destStartByte % 8 == 0) {
                                        ViewClass = Float64Array;
                                    }
                                    break;
                                case 4:
                                    if (sourceStartByte % 4 == 0 && destStartByte % 4 == 0) {
                                        ViewClass = Float32Array;
                                    }
                                    break;
                                case 2:
                                    if (sourceStartByte % 2 == 0 && destStartByte % 2 == 0) {
                                        ViewClass = Uint16Array;
                                    }
                                    break;
                                case 1:
                                    ViewClass = Uint8Array;
                                    break;
                                default:
                                    ViewClass = Uint8Array;
                                    break;
                            }
                            var viewSource = new ViewClass(source, sourceStartByte, Utils.trunc(leftBytes / wordSize));
                            var viewDest = new ViewClass(dest, destStartByte, viewSource.length);
                            for (var i_1 = 0; i_1 < viewSource.length; ++i_1) {
                                viewDest[i_1] = viewSource[i_1];
                            }
                            leftBytes -= viewSource.byteLength;
                            sourceStartByte += viewSource.byteLength;
                            destStartByte += viewSource.byteLength;
                        }
                    }
                }
                else {
                    throw new Error("Dest ArrayBuffer space not enough!");
                }
            };
            /**
             * 从数组中移除某一个元素
             * @public
             * @static
             * @method removeFromArray
             * @param {any[]} arr 需要操作的数组
             * @param {any} ele 需要移除的元素
             * @return {any[]} 移除元素后的新数组
             */
            Utils.removeFromArray = function (arr, ele) {
                var idx = arr.indexOf(ele);
                if (idx >= 0) {
                    return Utils.removeAtFromArray(arr, idx);
                }
                return arr;
            };
            /**
             * 从数组查找并返回符合条件的第一个元素的索引，只返回最先查找到的满足条件的元素的索引,如果没找到则返回-1
             * @param arr 要查找的数组
             * @param conditionFun 过滤条件函数,当返回true时，则返回，否则继续查找,该函数第一个参数是数组的元素，第二个参数是当前元素的索引，第三个参数是数组本身
             * @param startIndex 开始查找的索引
             */
            Utils.findIndexFromArray = function (arr, conditionFun, startIndex) {
                if (startIndex === void 0) { startIndex = 0; }
                if (startIndex >= arr.length) {
                    return -1;
                }
                for (; startIndex < arr.length; ++startIndex) {
                    if (conditionFun(arr[startIndex], startIndex, arr)) {
                        return startIndex;
                    }
                }
                return -1;
            };
            /**
             * 从数组中移除指定位置的元素
             */
            Utils.removeAtFromArray = function (arr, idx) {
                arr.splice(idx, 1);
                return arr;
            };
            Utils.stackTrace = function (count) {
                if (count === void 0) { count = 10; }
                var i = 0;
                var fun = arguments.callee;
                console.log("***----------------------------------------** " + (i + 1));
                while (fun && i < count) {
                    fun = fun.arguments.callee.caller;
                    console.log(fun);
                    i++;
                    console.log("***---------------------------------------- ** " + (i + 1));
                }
            };
            /**
             * 随机:[min, max]
             */
            Utils.random = function (min, max) {
                var range = max - min;
                var rand = Math.random();
                return min + Math.round(rand * range);
            };
            /** 保留n位小数，不四舍五入，9.8 -> 9.80 */
            Utils.toFixed = function (val, decimalNum) {
                if (decimalNum == 0)
                    return val.toString();
                var s = val.toFixed(decimalNum + 1);
                return s.substr(0, s.length - 1);
            };
            /** 取数字文本,向下取整，789 -> 78.9, 4567 -> "456" */
            Utils.getValStrMax3 = function (val) {
                var val2 = val % 10;
                var val1 = Math.floor(val / 10);
                if (val1 >= 100)
                    return val1.toString();
                else
                    return val1 + "." + val2;
            };
            Utils.getQueryString = function (name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
                var r = window.location.search.substr(1).match(reg);
                // var r = "?openid=xxxx&openkey=yyyyyy&platform=1".substr(1).match(reg);
                if (r != null) {
                    return r[2];
                }
                return null;
            };
            /**
             * 判断参数是否是一个字符串
             */
            Utils.isString = function (str) {
                return typeof str === "string";
            };
            /**
             * 是否是数组
             */
            Utils.isArray = function (arr) {
                return arr instanceof Array;
            };
            /**
             * 检查是否为空或未定义
             */
            Utils.isNullOrUndefined = function (obj) {
                return obj === null || obj === undefined;
            };
            /**
             * 字符串是否为空或空串
             */
            Utils.isNullOrEmpty = function (str) {
                return utils.Utils.isNullOrUndefined(str) || str.length <= 0;
            };
            /**
             * 判断值是否是一个数字(而不管是否可以转化成一个数字)
             * @param {any} value
             */
            Utils.isNumber = function (value) {
                if (Utils.isNullOrUndefined(value))
                    return false;
                if (Utils.isString(value))
                    return false;
                return !isNaN(value);
            };
            /**
             * 判断一人数字是否是整数
             * @param {number} num 需要进行判断的数字
             */
            Utils.isInteger = function (num) {
                return 0 === num % 1;
            };
            /**
             * 判断是不是一个有效的资源url对象
             *
             */
            Utils.isAssetsUrlObject = function (url) {
                return url.hasOwnProperty("url") && url.hasOwnProperty("type");
                // return url["url"] && url["type"];
            };
            /**
             * 从数组中获取ID为指定值的对象
             * @param arr
             * @param id
             */
            Utils.getById = function (arr, id) {
                var idx = Utils.findIndexFromArray(arr, function (ele, i, array) {
                    return ele.id === id;
                });
                if (idx < 0)
                    return null;
                return arr[idx];
            };
            /**
             * 过滤掉JSON文本中的注释
             * @param json
             */
            Utils.filterCommentsInJson = function (json) {
                return json.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
            };
            return Utils;
        }());
        utils.Utils = Utils;
    })(utils = rigger.utils || (rigger.utils = {}));
})(rigger || (rigger = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
* name
*/
var rigger;
(function (rigger) {
    var service;
    (function (service) {
        var ConfigInfo = /** @class */ (function () {
            function ConfigInfo() {
                this.status = ConfigStaus.None;
                // this.handlers = [];
                this.data = null;
                // this.url = null;
            }
            return ConfigInfo;
        }());
        service.ConfigInfo = ConfigInfo;
        var ConfigStaus;
        (function (ConfigStaus) {
            ConfigStaus[ConfigStaus["None"] = 1] = "None";
            ConfigStaus[ConfigStaus["Loading"] = 2] = "Loading";
            ConfigStaus[ConfigStaus["Ready"] = 3] = "Ready";
        })(ConfigStaus = service.ConfigStaus || (service.ConfigStaus = {}));
        var ConfigService = /** @class */ (function (_super) {
            __extends(ConfigService, _super);
            function ConfigService() {
                var _this = _super.call(this) || this;
                _this._serviceConfigMap = {};
                _this.applicationConfigHandlers = [];
                return _this;
            }
            /**
             * 启动服务
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @param {any} startupArgs 启动参数
             *
             * @example resultHandler.runWith([true]) 启动成功
             */
            ConfigService.prototype.start = function (resultHandler, serviceConfig, startupArgs) {
                this.initApplicationConfig(resultHandler, serviceConfig, startupArgs);
            };
            /**
             * 服务启动时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @param {any[]} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             *
             * @example resultHandler.runWith([true]) 启动成功
             */
            ConfigService.prototype.onStart = function (resultHandler, startupArgs) {
                resultHandler.success();
                // 初始化应用的配置
                // if(!this.applicationConfig) {
                // 	this.applicationConfigHandlers.push(new rigger.RiggerHandler(this, this.onApplicationConfigInit, [resultHandler]));								
                // 	this.loadApplicationConfig();			
                // }
            };
            /**
             * 停止服务时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 服务停用成功
             */
            ConfigService.prototype.onStop = function (resultHandler) {
                resultHandler.success();
            };
            /**
             * 启动服务时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 重启
             */
            ConfigService.prototype.onReStart = function (resultHandler) {
                resultHandler.success();
            };
            /**
             * 获取应用的配置
             * @param cb 获取到配置后，会以配置数据作为第一个附加参数回调句柄
             */
            ConfigService.prototype.getApplicationConfig = function (cb) {
                if (this.applicationConfig)
                    return cb.runWith([this.applicationConfig]);
                this.applicationConfigHandlers.push(cb);
                this.loadConfig(this.makeApplicationConfigUrl(), this, this.onApplicationConfigLoad);
            };
            /**
             * 获取服务配置
             * @param serviceName
             */
            ConfigService.prototype.getServiceConfig = function (serviceName) {
                var configInfo = this.getServiceConfigInfo(serviceName);
                if (configInfo && configInfo.status === ConfigStaus.Ready)
                    return configInfo.data;
                return null;
            };
            ConfigService.prototype.onApplicationConfigInit = function (startCb) {
                console.log("App Config Inited");
                startCb.success();
            };
            // private applicationConfigUrl:string;
            ConfigService.prototype.onApplicationConfigLoad = function (data) {
                if (rigger.utils.Utils.isString(data)) {
                    this.applicationConfig = JSON.parse(rigger.utils.Utils.filterCommentsInJson(data));
                }
                else {
                    this.applicationConfig = data;
                }
                // 处理应用配置
                this.treateApplicationConfig();
                // 回调
                for (var i = 0; i < this.applicationConfigHandlers.length; ++i) {
                    this.applicationConfigHandlers[i].runWith([this.applicationConfig]);
                }
                // 清除回调
                this.applicationConfigHandlers = [];
            };
            ConfigService.prototype.treateApplicationConfig = function () {
                // 从应用配置中获取所有的服务配置
                this.initServiceConfigs();
            };
            ConfigService.prototype.initServiceConfigs = function () {
                if (!this._serviceConfigMap)
                    this._serviceConfigMap = {};
                var appConfig = this.applicationConfig;
                var serviceArrOfArr = appConfig.services;
                for (var i = 0; i < serviceArrOfArr.length; ++i) {
                    for (var j = 0; j < serviceArrOfArr[i].length; ++j) {
                        var serConfig = serviceArrOfArr[i][j];
                        var configInfo = this.getServiceConfigInfo(serConfig.fullName);
                        configInfo.data = serConfig;
                        configInfo.status = ConfigStaus.Ready;
                    }
                }
            };
            ConfigService.prototype.getServiceConfigInfo = function (serviceName) {
                var info = this._serviceConfigMap[serviceName];
                if (!info) {
                    info = new ConfigInfo();
                    this._serviceConfigMap[serviceName] = info;
                }
                return info;
            };
            // private setServiceConfigInfo(serviceName: string, info: ConfigInfo) {
            // 	this._serviceConfigMap[serviceName] = info;
            // }
            /**
             * 初始化应用的配置
             * @param resultHandler
             * @param serviceConfig
             * @param startupArgs
             */
            ConfigService.prototype.initApplicationConfig = function (resultHandler, serviceConfig, startupArgs) {
                this.getApplicationConfig(new rigger.RiggerHandler(this, this.doStart, [resultHandler, serviceConfig, startupArgs]));
            };
            /**
             * @plugin rigger.utils.DecoratorUtil.makeExtendable(true)
             * 生成应用的配置的路径
             *
            */
            ConfigService.prototype.makeApplicationConfigUrl = function () {
                return "rigger/riggerConfigs/RiggerConfig.json?" + Math.random();
            };
            // @rigger.utils.DecoratorUtil.makeExtendable(true)
            // protected makeServiceConfigUrl(serviceName: string): string {
            // 	if (rigger.utils.Utils.isNullOrUndefined(serviceName) || rigger.utils.Utils.isNullOrEmpty(serviceName)) {
            // 		return null;
            // 	}
            // 	// let strArr:string[] = serviceName.split(".");
            // 	// if(strArr.length <= 0) return null;
            // 	// return `rigger/riggerConfigs/serviceConfigs/${strArr[strArr.length - 1]}Config.json?${Math.random()}`;
            // 	return `rigger/riggerConfigs/serviceConfigs/${serviceName}.json?${Math.random()}`;
            // }
            ConfigService.prototype.doStart = function (resultHandler, serviceConfig, startupArgs, cfg) {
                this.getApplication().setConfig(cfg);
                _super.prototype.start.call(this, resultHandler, serviceConfig, startupArgs);
            };
            /**
             * 服务名
             */
            ConfigService.serviceName = "rigger.service.ConfigService";
            __decorate([
                rigger.utils.DecoratorUtil.makeExtendable(true),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", String)
            ], ConfigService.prototype, "makeApplicationConfigUrl", null);
            return ConfigService;
        }(service.AbsService));
        service.ConfigService = ConfigService;
    })(service = rigger.service || (rigger.service = {}));
})(rigger || (rigger = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 事件服务
 */
var rigger;
(function (rigger) {
    var service;
    (function (service) {
        var EventService = /** @class */ (function (_super) {
            __extends(EventService, _super);
            function EventService() {
                var _this = _super.call(this) || this;
                _this.HANDLER_FIELD_TYPE_CALLER = 1;
                _this.HANDLER_FIELD_TYPE_HANDLER = 2;
                _this.HANDLER_FIELD_TYPE_INSTANCE = 3;
                _this._handlerMap = {};
                return _this;
            }
            Object.defineProperty(EventService, "instance", {
                get: function () {
                    return EventService.getRunningService(EventService.serviceName);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 服务启动时的回调
             * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @param {any[]} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             *
             * @example resultHandler.runWith([true]) 启动成功
             */
            EventService.prototype.onStart = function (resultHandler, startupArgs) {
                resultHandler.success();
            };
            /**
             * 停止服务时的回调
             * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 服务停用成功
             */
            EventService.prototype.onStop = function (resultHandler) {
                this._handlerMap = null;
                resultHandler.success();
            };
            /**
             * 启动服务时的回调
             * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 重启
             */
            EventService.prototype.onReStart = function (resultHandler) {
                resultHandler.success();
            };
            // public addProtocolListener(protocolId: number, caller: any, handler: GameEventHandler) {
            // 	this.addEventListener(protocolId, NetworkManager.instance, caller, handler);
            // }
            // public removeProtocolListener(protocolId: number, caller: any, handler: GameEventHandler) {
            // 	this.removeEventListener(protocolId, NetworkManager.instance, caller, handler);
            // }
            /**
             * 注册事件监听
             */
            EventService.prototype.addEventListener = function (eventName, obj, caller, handler) {
                if (obj === void 0) { obj = null; }
                try {
                    var oldHandlers = this._handlerMap[eventName];
                    if (oldHandlers) {
                        oldHandlers.push({ 1: caller, 2: handler, 3: obj });
                    }
                    else {
                        this._handlerMap[eventName] = [{ 1: caller, 2: handler, 3: obj }];
                    }
                }
                catch (error) {
                    console.log("error when add event listener:" + error);
                    console.log(error.stack);
                }
            };
            /**
             * 移除事件监听
             */
            EventService.prototype.removeEventListener = function (eventName, obj, caller, handler) {
                var hadHandlers = this._handlerMap[eventName];
                var newHandlers = [];
                if (hadHandlers) {
                    for (var index = 0; index < hadHandlers.length; index++) {
                        if (obj != hadHandlers[index][3] || caller != hadHandlers[index][1] || handler != hadHandlers[index][2]) {
                            newHandlers.push(hadHandlers[index]);
                        }
                    }
                    this._handlerMap[eventName] = newHandlers;
                }
            };
            /**
             * 派发事件注册了的事件将被触发
             */
            EventService.prototype.dispatchEvent = function (eventName, obj) {
                if (obj === void 0) { obj = null; }
                var data = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    data[_i - 2] = arguments[_i];
                }
                var hadHandlers = this._handlerMap[eventName];
                if (!hadHandlers) {
                    return;
                }
                var fun;
                for (var index = 0; index < hadHandlers.length; index++) {
                    // 检查是不是监听的实例
                    if (obj != hadHandlers[index][3]) {
                        continue;
                    }
                    // 遍历回调列表
                    fun = hadHandlers[index][2];
                    try {
                        fun.apply(hadHandlers[index][1], data);
                        // if (!data) {
                        // 	fun.apply(hadHandlers[index][1]);
                        // }
                        // else {
                        // 	fun.apply(hadHandlers[index][1], [data]);
                        // }
                    }
                    catch (error) {
                        console.log("error when dispatchEvent, EventName:" + eventName + ",Error:" + error);
                        // Utils.stackTrace();
                        console.log(error.stack);
                    }
                }
            };
            /**
             * 服务名
             */
            EventService.serviceName = "rigger.service.EventService";
            return EventService;
        }(service.AbsService));
        service.EventService = EventService;
    })(service = rigger.service || (rigger.service = {}));
})(rigger || (rigger = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* name
*/
var rigger;
(function (rigger) {
    var service;
    (function (service) {
        var PoolService = /** @class */ (function (_super) {
            __extends(PoolService, _super);
            function PoolService() {
                var _this = _super.call(this) || this;
                _this.objectPool = {};
                _this.objectPool = {};
                return _this;
            }
            Object.defineProperty(PoolService, "instance", {
                get: function () {
                    return PoolService.getRunningService(PoolService.serviceName);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 根据对象类型标识字符，获取对象池。
             * @param sign 对象类型标识字符。
             * @return 对象池。
             */
            PoolService.getPoolBySign = function (sign) {
                return PoolService.instance.getPoolBySign(sign);
            };
            /**
             * 清除对象池的对象。
             * @param sign 对象类型标识字符。
             */
            PoolService.clearBySign = function (sign) {
                PoolService.instance.clearBySign(sign);
            };
            /**
             * 将对象放到对应类型标识的对象池中。
             * @param sign 对象类型标识字符。
             * @param item 对象。
             */
            PoolService.recover = function (sign, item) {
                PoolService.instance.recover(sign, item);
            };
            /**
             * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
             * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
             * @param sign 对象类型标识字符。
             * @param cls 用于创建该类型对象的类。
             * @return 此类型标识的一个对象。
             */
            PoolService.getItemByClass = function (sign, cls) {
                return PoolService.instance.getItemByClass(sign, cls);
            };
            /**
             * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
             * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
             * @param sign 对象类型标识字符。
             * @param createFun 用于创建该类型对象的方法。
             * @return 此类型标识的一个对象。
             */
            PoolService.getItemByCreateFun = function (sign, createFun) {
                return PoolService.instance.getItemByCreateFun(sign, createFun);
            };
            /**
             * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
             * @param sign 对象类型标识字符。
             * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
             */
            PoolService.getItem = function (sign) {
                return PoolService.instance.getItem(sign);
            };
            /**
             * 根据对象类型标识字符，获取对象池。
             * @param sign 对象类型标识字符。
             * @return 对象池。
             */
            PoolService.prototype.getPoolBySign = function (sign) {
                var arr = this.objectPool[sign];
                if (!arr) {
                    this.objectPool[sign] = arr = [];
                }
                return arr;
            };
            /**
             * 清除对象池的对象。
             * @param sign 对象类型标识字符。
             */
            PoolService.prototype.clearBySign = function (sign) {
                delete this.objectPool[sign];
            };
            /**
             * 将对象放到对应类型标识的对象池中。
             * @param sign 对象类型标识字符。
             * @param item 对象。
             */
            PoolService.prototype.recover = function (sign, item) {
                var old = this.getPoolBySign(sign);
                old.push(item);
            };
            /**
             * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
             * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
             * @param sign 对象类型标识字符。
             * @param cls 用于创建该类型对象的类。
             * @return 此类型标识的一个对象。
             */
            PoolService.prototype.getItemByClass = function (sign, cls) {
                var obj = this.getItem(sign);
                if (obj)
                    return obj;
                return new cls();
            };
            /**
             * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
             * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
             * @param sign 对象类型标识字符。
             * @param createFun 用于创建该类型对象的方法。
             * @return 此类型标识的一个对象。
             */
            PoolService.prototype.getItemByCreateFun = function (sign, createFun) {
                var obj = this.getItem(sign);
                if (obj)
                    return obj;
                return createFun();
            };
            /**
             * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
             * @param sign 对象类型标识字符。
             * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
             */
            PoolService.prototype.getItem = function (sign) {
                var pool = this.getPoolBySign(sign);
                if (pool.length <= 0)
                    return null;
                return pool.pop();
            };
            /**
             * 服务被唤醒时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @param {any[]} startupArgs 启动参数
             *
             * @example resultHandler.runWith([true]) 启动成功
             */
            PoolService.prototype.onStart = function (resultHandler, startupArgs) {
                this.objectPool = {};
                resultHandler.success();
            };
            /**
             * 停止服务时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 服务停用成功
             */
            PoolService.prototype.onStop = function (resultHandler) {
                this.objectPool = null;
                resultHandler.success();
            };
            /**
             * 启动服务时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 重启
             */
            PoolService.prototype.onReStart = function (resultHandler) {
                this.objectPool = {};
                resultHandler.success();
            };
            /**
             * 服务名
             */
            PoolService.serviceName = "rigger.service.PoolService";
            return PoolService;
        }(service.AbsService));
        service.PoolService = PoolService;
    })(service = rigger.service || (rigger.service = {}));
})(rigger || (rigger = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* 核心服务
*/
var rigger;
(function (rigger) {
    var service;
    (function (service) {
        var KernelService = /** @class */ (function (_super) {
            __extends(KernelService, _super);
            function KernelService() {
                return _super.call(this) || this;
            }
            /**
             * 服务启动时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @param {any[]} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             *
             * @example resultHandler.runWith([true]) 启动成功
             */
            KernelService.prototype.onStart = function (resultHandler, startupArgs) {
                resultHandler.success();
            };
            /**
             * 停止服务时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 服务停用成功
             */
            KernelService.prototype.onStop = function (resultHandler) {
                resultHandler.success();
            };
            /**
             * 启动服务时的回调
             * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
             * @example resultHandler.runWith([true]) 重启
             */
            KernelService.prototype.onReStart = function (resultHandler) {
                resultHandler.success();
            };
            /**
             * 服务名
             */
            KernelService.serviceName = "rigger.service.KernelService";
            return KernelService;
        }(service.AbsService));
        service.KernelService = KernelService;
    })(service = rigger.service || (rigger.service = {}));
})(rigger || (rigger = {}));

/**
* 有限状态机类
*/
var rigger;
(function (rigger) {
    var FSM = /** @class */ (function () {
        function FSM() {
            this.mNowStateName = null;
            this.stateMap = {};
            this.paramsMap = {};
            this.triggerMap = {};
        }
        Object.defineProperty(FSM.prototype, "nowState", {
            /**
             * 状态机的当前状态名
             */
            get: function () {
                return this.mNowStateName;
            },
            enumerable: true,
            configurable: true
        });
        FSM.prototype.dispose = function () {
            for (var k in this.paramsMap) {
                // (<FSMState>this.paramsMap[k]).dispose();
                delete this.paramsMap[k];
            }
            this.stateMap = null;
            this.paramsMap = null;
            this.triggerMap = null;
        };
        /**
         * 启动状态机，一般在设置好所有参数，设置后再调用，只需要调用一次
         */
        FSM.prototype.start = function () {
            this.checkNowState();
        };
        /**
         * 检查当前状态（是否可以迁移当前状态)
         */
        FSM.prototype.checkNowState = function () {
            var state = this.stateMap[this.mNowStateName];
            if (!state)
                throw new Error("can not find state in checkNowState:" + this.mNowStateName);
            var newStateName = state.checkAllTransitions(this);
            if (newStateName) {
                this.transitToState(state, this.getState(newStateName));
            }
        };
        /**
         * 给状态机添加一个状态，添加成功后会返回新添加的状态
         * 如果原来已经有些STATE了则直接使用已有的
         * @param stateName
         */
        FSM.prototype.addState = function (stateName, ifDefault) {
            if (ifDefault === void 0) { ifDefault = false; }
            var state = this.stateMap[stateName];
            if (!state)
                state = new rigger.FSMState(stateName);
            this.stateMap[stateName] = state;
            if (ifDefault || !this.mNowStateName)
                this.mNowStateName = stateName;
            return state;
        };
        /**
         * 根据状态名或状态标识获取状态数据
         * @param stateName
         */
        FSM.prototype.getState = function (stateName) {
            return this.stateMap[stateName];
        };
        /**
         * 获取参数值
         * @param params
         */
        FSM.prototype.getValue = function (params) {
            return this.paramsMap[params];
        };
        /**
         * 设置参数值
         * @param params
         * @param value
         * @param ifTrigger 是否是触发器模式 ,此模式下，当参数关联的transition发生后，会将参数值置回原值
         *
         */
        FSM.prototype.setValue = function (params, value, ifTrigger) {
            if (ifTrigger === void 0) { ifTrigger = false; }
            if (ifTrigger) {
                this.triggerMap[params] = { oldValue: this.paramsMap[params] };
            }
            this.paramsMap[params] = value;
            this.onParamsChange(params);
        };
        /**
         * 当参数发生改变时调用
         * @param params
         */
        FSM.prototype.onParamsChange = function (params) {
            var state = this.stateMap[this.mNowStateName];
            if (!state)
                throw new Error("can not find state:" + this.mNowStateName);
            // 检查当前状态所有的迁移
            var newStateName = state.onParamsChange(this, params);
            if (!rigger.utils.Utils.isNullOrUndefined(newStateName)) {
                this.transitToState(state, this.getState(newStateName));
            }
        };
        /**
         * 迁移到新状态
         * @param oldState
         * @param newState
         */
        FSM.prototype.transitToState = function (oldState, newState) {
            if (!newState)
                throw new Error("trying to transit to a invalid new state");
            var oldStateName = oldState.stateName;
            var newStateName = newState.stateName;
            // 回复trigger的状态
            var transition = oldState.getTransition(newStateName);
            var conditions = transition.conditions;
            var len = conditions.length;
            var params;
            var condition;
            var trigger;
            for (var i = 0; i < len; i++) {
                condition = conditions[i];
                params = condition.paramsName;
                trigger = this.triggerMap[params];
                if (trigger) {
                    // 如果有trigger信息，则重置参数值,重置后可能再次引起状态迁移
                    delete this.triggerMap[params];
                    this.setValue(params, trigger.oldValue);
                }
            }
            // 执行旧状态的leave回调		
            oldState.executeLeaveAction(newStateName);
            this.mNowStateName = newStateName;
            // 执行新状态的enter回调
            this.getState(newStateName).executeEnterAction(oldStateName);
            if (oldState.stateName !== newState.stateName) {
                // 检查当前状态
                // 判断新旧状态是否相同，防止死循环
                this.checkNowState();
            }
        };
        return FSM;
    }());
    rigger.FSM = FSM;
})(rigger || (rigger = {}));

/**
* 有限状态机的状态类
*/
var rigger;
(function (rigger) {
    /**
     * 状态机的状态数据
     */
    var FSMState = /** @class */ (function () {
        /**
         *
         * @param state 状态名或标示符
         */
        function FSMState(state) {
            this.mParamsStateRelationMap = {};
            this.mStateName = state;
            this.transitionsMap = {};
            this.mParamsStateRelationMap = {};
        }
        FSMState.prototype.dispose = function () {
            this.mStateName = null;
            this.transitionsMap = null;
            this.mParamsStateRelationMap = null;
            this.enterActionManager.dispose();
            this.leaveActionManager.dispose();
        };
        /**
         * 添加进入此状态时的动作,可以重复调用以增加多个动作
         * 动作回调时会将旧状态与新状态名附加在传入参数末尾，如：
         * function onEnter(extraArg..., oldState, newState){}
         * @param whenEnterCaller
         * @param whenEnterMethod
         * @param whenEnterArgs
         */
        FSMState.prototype.addEnterAction = function (whenEnterCaller, whenEnterMethod) {
            var whenEnterArgs = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                whenEnterArgs[_i - 2] = arguments[_i];
            }
            if (!this.enterActionManager)
                this.enterActionManager = new rigger.utils.ListenerManager();
            this.enterActionManager.on(whenEnterCaller, whenEnterMethod, whenEnterArgs);
            return this;
        };
        /**
         * 添加离开此状态时的动作,可以重复调用以增加多个动作
         * 动作回调时会将旧状态与新状态名附加在传入参数末尾，如：
         * function onEnter(extraArg..., oldState, newState){}
         * @param whenLeaveCaller
         * @param whenLeaveMethod
         * @param whenLeaveArgs
         */
        FSMState.prototype.addLeaveAction = function (whenLeaveCaller, whenLeaveMethod) {
            var whenLeaveArgs = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                whenLeaveArgs[_i - 2] = arguments[_i];
            }
            if (!this.leaveActionManager)
                this.leaveActionManager = new rigger.utils.ListenerManager();
            this.leaveActionManager.on(whenLeaveCaller, whenLeaveMethod, whenLeaveArgs);
            return this;
        };
        /**
         * 执行进入动作
         * @param oldState
         * @param newState
         */
        FSMState.prototype.executeEnterAction = function (fromState) {
            if (this.enterActionManager) {
                this.enterActionManager.execute(fromState, this.stateName);
            }
        };
        /**
         * 执行离开动作
         * @param toState
         */
        FSMState.prototype.executeLeaveAction = function (toState) {
            if (this.leaveActionManager) {
                this.leaveActionManager.execute(this.stateName, toState);
            }
        };
        Object.defineProperty(FSMState.prototype, "paramsStateRelationMap", {
            /**
             * 参数状态关系映射
             */
            get: function () {
                return this.mParamsStateRelationMap;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 增加一个迁移（条件），此接口可以重复对同一个状态调用，以增加多个条件，此时，需要所有条件都满足后，状态才会发生迁移
         * 返回FSMstate
         * @param toState 目标状态
         * @param paramsName 需要检查的参数名
         * @param checkCaller 检查函数调用者
         * @param checkMethod 检查函数
         * @param args 额外参数
         */
        FSMState.prototype.addTransition = function (toState, paramsName, checkCaller, checkMethod) {
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            if (rigger.utils.Utils.isNullOrUndefined(toState))
                return this;
            if (!rigger.utils.Utils.isNullOrUndefined(paramsName)) {
                var oldList = this.mParamsStateRelationMap[paramsName];
                if (!oldList)
                    oldList = this.mParamsStateRelationMap[paramsName] = [];
                if (oldList.indexOf(toState) < 0) {
                    oldList.push(toState);
                }
            }
            var oldTransition = this.getTransition(toState);
            if (!oldTransition)
                oldTransition = this.setTransition(toState, new rigger.FSMTransition(toState));
            oldTransition.addCondition.apply(oldTransition, [paramsName, checkCaller, checkMethod].concat(args));
            return this;
        };
        /**
         * 当状态机的参数发生了变化时调用，返回新的状态，如果为null,则表示不满足迁移条件
         * @param fsm
         * @param paramsName
         */
        FSMState.prototype.onParamsChange = function (fsm, paramsName) {
            // 获取参数相关的目标状态
            var stateNames = this.mParamsStateRelationMap[paramsName];
            if (!stateNames || stateNames.length <= 0)
                return;
            for (var i = 0; i < stateNames.length; i++) {
                var stateName = stateNames[i];
                var transition = this.transitionsMap[stateName];
                if (transition) {
                    if (transition.check(fsm)) {
                        return stateName;
                    }
                }
            }
            return null;
        };
        /**
         * 检查所有的transition，看是否有可以迁移的状态,并返回新状态，如果没可迁移状态，则返回NULL，
         * @param fsm
         */
        FSMState.prototype.checkAllTransitions = function (fsm) {
            for (var k in this.transitionsMap) {
                var transition = this.transitionsMap[k];
                if (transition) {
                    if (transition.check(fsm)) {
                        return k;
                    }
                }
            }
            return null;
        };
        FSMState.prototype.getTransition = function (toState) {
            return this.transitionsMap[toState];
        };
        FSMState.prototype.setTransition = function (toState, transition) {
            return this.transitionsMap[toState] = transition;
        };
        Object.defineProperty(FSMState.prototype, "stateName", {
            // public getRelatedTransitions(paramsName:string | number):FSMTransition[]{
            // }
            /**
             * 状态名或标识
             */
            get: function () {
                return this.mStateName;
            },
            enumerable: true,
            configurable: true
        });
        return FSMState;
    }());
    rigger.FSMState = FSMState;
})(rigger || (rigger = {}));

/**
* name
*/
var rigger;
(function (rigger) {
    var FSMTransition = /** @class */ (function () {
        function FSMTransition(toState) {
            this.mConditions = [];
            this.toStateName = toState;
            this.mConditions = [];
        }
        FSMTransition.prototype.dispose = function () {
            this.toStateName = null;
            for (var i = 0; i < this.mConditions.length; i++) {
                var cond = this.mConditions[i];
                cond.dispose();
            }
        };
        Object.defineProperty(FSMTransition.prototype, "conditions", {
            /**
             * 所有的条件
             */
            get: function () {
                return this.mConditions;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 给迁移添加条件
         * @param paramsName 参与判断的参数
         * @param checkCaller 检查函数的调用者
         * @param checkMethod 检查函数
         * @param args 额外参数
         */
        FSMTransition.prototype.addCondition = function (paramsName, checkCaller, checkMethod) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            if (checkMethod && !rigger.utils.Utils.isNullOrUndefined(paramsName)) {
                var cond = new rigger.FSMTransitionCondition(paramsName, rigger.RiggerHandler.create(checkCaller, checkMethod, args, false));
                this.mConditions.push(cond);
            }
        };
        FSMTransition.prototype.check = function (fsm) {
            for (var i = 0; i < this.mConditions.length; i++) {
                var cond = this.mConditions[i];
                if (!cond.check(fsm))
                    return false;
            }
            return true;
        };
        return FSMTransition;
    }());
    rigger.FSMTransition = FSMTransition;
})(rigger || (rigger = {}));

/**
* name
*/
var rigger;
(function (rigger) {
    /**
     * 迁移条件
     */
    var FSMTransitionCondition = /** @class */ (function () {
        function FSMTransitionCondition(paramsName, handler) {
            this.paramsName = paramsName;
            this.checkHandler = handler;
        }
        FSMTransitionCondition.prototype.dispose = function () {
            this.paramsName = null;
            if (this.checkHandler) {
                this.checkHandler.recover();
            }
        };
        FSMTransitionCondition.prototype.check = function (fsm) {
            if (this.checkHandler) {
                return this.checkHandler.runWith([fsm.getValue(this.paramsName), fsm, this.paramsName]);
            }
            return false;
        };
        return FSMTransitionCondition;
    }());
    rigger.FSMTransitionCondition = FSMTransitionCondition;
})(rigger || (rigger = {}));

/**
* 状态机的常用工具函数
*/
var rigger;
(function (rigger) {
    var FSMUtils = /** @class */ (function () {
        function FSMUtils() {
        }
        /**
         * 状态机的参数条件判断：相等
         * @param v
         */
        FSMUtils.equal = function (v) {
            return function (paramsV) {
                return v === paramsV;
            };
        };
        FSMUtils.notEqual = function (v) {
            return function (paramsV) {
                return v !== paramsV;
            };
        };
        /**
         * 状态机的参数条件判断：参数值小于指定值
         * @param v
         */
        FSMUtils.less = function (v) {
            return function (paramsV) {
                return paramsV < v;
            };
        };
        /**
         * 状态机的参数条件判断：参数值小于等于指定值
         * @param v
         */
        FSMUtils.lessEqual = function (v) {
            return function (paramsV) {
                return paramsV <= v;
            };
        };
        /**
         * 状态机的参数条件判断：参数值大于指定值
         * @param v
         */
        FSMUtils.greater = function (v) {
            return function (paramsV) {
                return paramsV > v;
            };
        };
        /**
         * 状态机的参数条件判断：参数值大于等于指定值
         * @param v
         */
        FSMUtils.greaterEqual = function (v) {
            return function (paramsV) {
                return paramsV >= v;
            };
        };
        return FSMUtils;
    }());
    rigger.FSMUtils = FSMUtils;
})(rigger || (rigger = {}));





