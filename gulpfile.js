/**
 * GULP任务的入口，真实的任务逻辑在其它文件里面
 */
var requireDir = require("require-dir");
requireDir("./rigger/gulpTasks");
requireDir("./ccc-builder/gulpTasks")
requireDir("./ccc-jp-libs/gulpTasks")



