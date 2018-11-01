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


//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUEsQ0FBTyxPQUFQLENBQUEsQ0FBQSxDQUFpQjtBQWxHakIiLCJmaWxlIjoiaW5kZXguanMob3JpZ2luYWwpIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZnNlID0gcmVxdWlyZShcImZzLWV4dHJhXCIpO1xuY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5jb25zdCBuYW1lID0gJ3dlYnBhY2stY29weS1ub2xvb3AtcGx1Z2luJztcblxuY29uc3QgaXNEaXIgPSBsb2NhdGlvbiA9PiBmcy5zdGF0U3luYyhsb2NhdGlvbikuaXNEaXJlY3RvcnkoKTtcbmNvbnN0IGdhdGhlckZpbGVzID0gbG9jYXRpb24gPT4gcGF0dGVybiA9PiB7XG4gIHJldHVybiBmcy5yZWFkZGlyU3luYyhsb2NhdGlvbikucmVkdWNlKChsYXN0LCBmaWxlKSA9PiB7XG4gICAgY29uc3QgZmlsZUluQWJzID0gcGF0aC5qb2luKGxvY2F0aW9uLCBcIi9cIiwgZmlsZSk7XG4gICAgaWYgKGlzRGlyKGZpbGVJbkFicykpIHtcbiAgICAgIGxhc3QuY29uY2F0KGdhdGhlckZpbGVzKHBhdGguam9pbihsb2NhdGlvbiwgXCIvXCIsIGZpbGUpKShwYXR0ZXJuKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwYXR0ZXJuLnRlc3QoZmlsZUluQWJzKSkge1xuICAgICAgICBsYXN0LnB1c2goZmlsZUluQWJzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxhc3Q7XG4gIH0sIFtdKTtcbn07XG5cbi8qKlxuICogaWYgY29weSBmaWxlIGZyb20gZGlyZWN0b3J5XG4gKiBnZW5lcmF0ZSBwcm9wZXIgZGVzdCBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyRnJvbVBhdGhcbiAqIEBwYXJhbSB7c3RyaW5nfSBkaXJUb1BhdGhcbiAqIEByZXR1cm5zIHtmdW5jdGlvbihzdHJpbmcsIGJvb2xlYW49KX1cbiAqL1xuY29uc3QgZ2V0RGVzdFBhdGggPSAoZGlyRnJvbVBhdGgsIGRpclRvUGF0aCkgPT4gKFxuICBmaWxlRnJvbVBhdGgsXG4gIGZsYXR0ZW4gPSBmYWxzZVxuKSA9PiB7XG4gIGNvbnN0IHJlbGF0aXZlUGF0aCA9IGZsYXR0ZW5cbiAgICA/IHBhdGguYmFzZW5hbWUoZmlsZUZyb21QYXRoKVxuICAgIDogcGF0aC5yZWxhdGl2ZShkaXJGcm9tUGF0aCwgZmlsZUZyb21QYXRoKTtcbiAgcmV0dXJuIHBhdGguam9pbihkaXJUb1BhdGgsIFwiL1wiLCByZWxhdGl2ZVBhdGgpO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBDb3B5SXRlbVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGZyb21cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b1xuICogQHByb3BlcnR5IHtmdW5jdGlvbihzdHJpbmcsIHN0cmluZyk9fSBmaWx0ZXJcbiAqIEBwcm9wZXJ0eSB7cmVnZXhwPX0gcGF0dGVyblxuICogQHByb3BlcnR5IHtib29sZWFuPX0gZmxhdHRlblxuICovXG5cbmNsYXNzIENvcHlOb0xvb3BQbHVnaW4ge1xuICAvKipcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnNcbiAgICogQHBhcmFtIHtDb3B5SXRlbVtdfSBvcHRpb25zLmxpc3RcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRpb25zLnJvb3Qgcm9vdCBkaXJlY3RvcnlcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgYXBwbHkoY29tcGlsZXIpIHtcbiAgICBjb21waWxlci5ob29rcy5kb25lLnRhcChcIkNvcHlOb0xvb3BQbHVnaW5cIiwgKCkgPT4ge1xuICAgICAgY29uc3QgeyBsaXN0LCByb290IH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHJldHVybjtcbiAgICAgIGxldCBsaXN0TXV0ID0gbGlzdC5zbGljZSgpO1xuICAgICAgaWYgKHJvb3QpIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIGFic29sdXRlXG4gICAgICAgIGlmICghcGF0aC5pc0Fic29sdXRlKHJvb3QpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBbJHtuYW1lfV06IHJvb3QgbmVlZHMgdG8gYmUgYW4gYWJzb2x1dGUgcGF0aCFgKTtcbiAgICAgICAgfVxuICAgICAgICBsaXN0TXV0ID0gbGlzdE11dC5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICBmcm9tOiBwYXRoLnJlc29sdmUocm9vdCwgaXRlbS5mcm9tKSxcbiAgICAgICAgICAgIHRvOiBwYXRoLnJlc29sdmUocm9vdCwgaXRlbS50bylcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGxpc3RNdXQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGZyb20sXG4gICAgICAgICAgdG8sXG4gICAgICAgICAgZmlsdGVyID0gKCkgPT4gdHJ1ZSxcbiAgICAgICAgICBwYXR0ZXJuLFxuICAgICAgICAgIGZsYXR0ZW4gPSBmYWxzZVxuICAgICAgICB9ID0gaXRlbTtcbiAgICAgICAgaWYgKGlzRGlyKGZyb20pICYmIHBhdHRlcm4pIHtcbiAgICAgICAgICBjb25zdCBmaWxlcyA9IGdhdGhlckZpbGVzKGZyb20pKHBhdHRlcm4pO1xuICAgICAgICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZXN0ID0gZ2V0RGVzdFBhdGgoZnJvbSwgdG8pKGZpbGUsIGZsYXR0ZW4pO1xuICAgICAgICAgICAgZnNlLmNvcHlTeW5jKGZpbGUsIGRlc3QsIHsgZmlsdGVyIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzZS5jb3B5U3luYyhmcm9tLCB0bywge1xuICAgICAgICAgICAgZmlsdGVyXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29weU5vTG9vcFBsdWdpbjtcbiJdfQ==
//# sourceMappingURL=index.mjs.map
