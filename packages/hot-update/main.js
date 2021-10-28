'use strict';

var Fs = require("fire-fs");
var Path = require("fire-path");

module.exports = {
    load: function () {
        // 当 package 被正确加载的时候执行
        Editor.log("on update plugin load")
    },

    unload: function () {
        // 当 package 被正确卸载的时候执行
    },

    messages: {
        'editor:build-start'(){
            Editor.log("++++ start ++++")
        },

        'editor:build-finished'(event, target) {
            Editor.log("***** now build finished *****");
            var root = Path.normalize(target.dest);
            var url = Path.join(root, "main.js");
            Fs.readFile(url, "utf8", function (err, data) {
                if (err) {
                    throw err;
                }
                var newStr = 
`
// 获取和设置本地存储的搜索路径
if (window.jsb) {
    var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
    if (hotUpdateSearchPaths) {
        jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
    }
}

`
                var newData = newStr + data;
                Fs.writeFile(url, newData, function (error) {
                    if (err) {
                        throw err;
                    }
                    Editor.log("SearchPath updated in built main.js for hot update");
                });
            });
        },
    }
};