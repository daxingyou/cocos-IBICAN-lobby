
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// 
if (!window.riggerIOC) {
    window.riggerIOC = {};
    (function () {
        var ApplicationContext = function () {

        }
        var Signal = function () { }
        var ModuleContext = function () { }
        var Command = function () {

        }
        var Server = function () { }
        var inject = function (arg) { }
        
        var InjectionBinder = function () { }
        InjectionBinder.instance = function () { }
        InjectionBinder.instance.bind = function (_) {
            var temp = function () { };
            temp.toSingleton = function(){

            };
            temp.getInstance = function(){};
            temp.toValue = function (_) { };
            return temp
        }

        var Model = function () { }
        
        window.riggerIOC.ApplicationContext = ApplicationContext;
        window.riggerIOC.Signal = Signal;
        window.riggerIOC.inject = inject;
        window.riggerIOC.ModuleContext = ModuleContext;
        window.riggerIOC.Command = Command;
        window.riggerIOC.WaitableCommand = function(){};
        window.riggerIOC.Server = Server;
        window.riggerIOC.InjectionBinder = InjectionBinder
        window.riggerIOC.Model = Model
        window.riggerIOC.Mediator = function(){}
        window.riggerIOC.BaseWaitable = function(){}
        window.riggerIOC.BaseWaitable.prototype.wait = function(){}
        window.riggerIOC.SafeWaitable = function(){}
        window.riggerIOC.SafeWaitable.prototype.wait = function(){}
        window.riggerIOC.setDebug = function(){}
    })()
}

if (!window.rigger) {
    window.rigger = {};
    (function () {
        var BaseApplication = function () {

        }

        var utils = function () {

        }
        window.rigger.BaseApplication = BaseApplication;
        window.rigger.service = function(){};
        window.rigger.service.AssetsPackageManager = function(){
            this.registerPackage = function(){}
            this.registerGroup = function(){}
            this.group = function(){}
        }
        window.rigger.service.AssetsPackageManager.group = function(){}
        // window.rigger.service.AssetsPackageManager.registerGroup = function(){}
        // console.log("now dumy registerPackage")
        // window.rigger.service.AssetsPackageManager.registerPackage = function(){}
        window.rigger.AbsServicePlugin = function(){}

        window.rigger.utils = utils;
        window.rigger.utils.ListenerManager = function () { };
        window.rigger.utils.DecoratorUtil = function(){};
        window.rigger.utils.DecoratorUtil.register = function(ct){};
        window.rigger.utils.Utils = function(){};
        window.rigger.utils.Utils.isArray = function(ct){};
        
    })()
}

if (!window.riggerLayout) {
    window.riggerLayout = {};
    (function () {
        var LayoutItem = function () {

        }
        window.riggerLayout.LayoutItem = LayoutItem
    })()
}

// if (!window.protobuf) {
//     window.protobuf = {};
//     (function () {
//         var t = function () {

//         }
//         var message = function () { };
//         window.protobuf.Message = message;
//         window.protobuf.Type = {};
//         window.protobuf.Type.d = function (a) { };
//         window.protobuf.Field = {};
//         window.protobuf.Field.d = function (a, b, c) { };
//     })()
// }

if (!window.decorator) {
    decorator = function () { }
}

if(!window.MainLogicService){
    window.MainLogicService = function(){};
    window.MainLogicService.makeEntrance = function(klass){};
}