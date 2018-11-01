var fse = require("fs-extra");
var fs = require("fs");
var path = require("path");
var name = 'webpack-copy-noloop-plugin';
var isDir = function (location) { return fs.statSync(location).isDirectory(); };
var gatherFiles = function (location) { return function (pattern) { return fs.readdirSync(location).reduce(function (last, file) {
    var fileInAbs = path.join(location, "/", file);
    if (isDir(fileInAbs)) {
        last.concat(gatherFiles(path.join(location, "/", file))(pattern));
    } else {
        if (pattern.test(fileInAbs)) {
            last.push(fileInAbs);
        }
    }
    return last;
}, []); }; };
var getDestPath = function (dirFromPath, dirToPath) { return function (fileFromPath, flatten) {
    if ( flatten === void 0 ) flatten = false;

    var relativePath = flatten ? path.basename(fileFromPath) : path.relative(dirFromPath, fileFromPath);
    return path.join(dirToPath, "/", relativePath);
}; };
var CopyNoLoopPlugin = function CopyNoLoopPlugin(options) {
    this.options = options;
};
CopyNoLoopPlugin.prototype.apply = function apply (compiler) {
        var this$1 = this;

    compiler.hooks.done.tap("CopyNoLoopPlugin", function () {
        var ref = this$1.options;
            var list = ref.list;
            var root = ref.root;
        if (!Array.isArray(list)) 
            { return; }
        var listMut = list.slice();
        if (root) {
            if (!path.isAbsolute(root)) {
                throw new Error(("[" + name + "]: root needs to be an absolute path!"));
            }
            listMut = listMut.map(function (item) { return (Object.assign({}, item,
                {from: path.resolve(root, item.from),
                to: path.resolve(root, item.to)})); });
        }
        listMut.forEach(function (item) {
            var from = item.from;
                var to = item.to;
                var filter = item.filter; if ( filter === void 0 ) filter = function () { return true; };
                var pattern = item.pattern;
                var flatten = item.flatten; if ( flatten === void 0 ) flatten = false;
            if (isDir(from) && pattern) {
                var files = gatherFiles(from)(pattern);
                files.forEach(function (file) {
                    var dest = getDestPath(from, to)(file, flatten);
                    fse.copySync(file, dest, {
                        filter: filter
                    });
                });
            } else {
                fse.copySync(from, to, {
                    filter: filter
                });
            }
        });
    });
};
module.exports = CopyNoLoopPlugin;
//# sourceMappingURL=index.js.map
