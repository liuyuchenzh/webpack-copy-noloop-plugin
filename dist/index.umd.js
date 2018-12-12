(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () {
	// A type of promise-like that resolves synchronously and supports only one observer

	// Asynchronously call a function and send errors to recovery continuation
	function _catch(body, recover) {
		try {
			var result = body();
		} catch(e) {
			return recover(e);
		}
		if (result && result.then) {
			return result.then(void 0, recover);
		}
		return result;
	}

	var fse = require("fs-extra");

	var fs = require("fs");

	var path = require("path");

	var name = "webpack-copy-noloop-plugin";

	var isDir = function (location) { return fs.statSync(location).isDirectory(); };

	var gatherFiles = function (location) { return function (pattern) {
	  return fs.readdirSync(location).reduce(function (last, file) {
	    var fileInAbs = path.join(location, "/", file);

	    if (isDir(fileInAbs)) {
	      last.concat(gatherFiles(path.join(location, "/", file))(pattern));
	    } else {
	      if (pattern.test(fileInAbs)) {
	        last.push(fileInAbs);
	      }
	    }

	    return last;
	  }, []);
	}; };
	/**
	 * if copy file from directory
	 * generate proper dest path
	 * @param {string} dirFromPath
	 * @param {string} dirToPath
	 * @returns {function(string, boolean=)}
	 */


	var getDestPath = function (dirFromPath, dirToPath) { return function (fileFromPath, flatten) {
	  if ( flatten === void 0 ) flatten = false;

	  var relativePath = flatten ? path.basename(fileFromPath) : path.relative(dirFromPath, fileFromPath);
	  return path.join(dirToPath, "/", relativePath);
	}; };
	/**
	 * @typedef {object} CopyItem
	 * @property {string} from
	 * @property {string} to
	 * @property {function(string, string)=} filter
	 * @property {regexp=} pattern
	 * @property {boolean=} flatten
	 */


	var CopyNoLoopPlugin = function CopyNoLoopPlugin(options) {
	  this.options = options;
	};

	CopyNoLoopPlugin.prototype.apply = function apply (compiler) {
	  var _this = this;

	  compiler.hooks.done.tap("CopyNoLoopPlugin", function () {
	    try {
	      function _temp3() {
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
	              fse[action](file, dest, {
	                filter: filter,
	                overwrite: true
	              });
	            });
	          } else {
	            fse[action](from, to, {
	              filter: filter,
	              overwrite: true
	            });
	          }
	        });
	      }

	      var ref = _this.options;
	        var list = ref.list;
	        var root = ref.root;
	        var move = ref.move; if ( move === void 0 ) move = false;
	        var waitFor = ref.waitFor; if ( waitFor === void 0 ) waitFor = function () { return Promise.resolve(); };
	      var action = move ? "moveSync" : "copySync";
	      if (!Array.isArray(list)) { return Promise.resolve(); }
	      var listMut = list.slice();

	      if (root) {
	        // check for absolute
	        if (!path.isAbsolute(root)) {
	          throw new Error(("[" + name + "]: root needs to be an absolute path!"));
	        }

	        listMut = listMut.map(function (item) {
	          return Object.assign({}, item,
	            {from: path.resolve(root, item.from),
	            to: path.resolve(root, item.to)});
	        });
	      }

	      var _temp2 = _catch(function () {
	        var _temp = function () {
	          if (typeof waitFor === "function") {
	            return Promise.resolve(waitFor()).then(function () {});
	          } else {
	            return Promise.resolve(new Promise(function (resolve) { return setTimeout(resolve, waitFor); })).then(function () {});
	          }
	        }();

	        return _temp && _temp.then ? _temp.then(function () {}) : void 0;
	      }, function (e) {
	        console.log(("[" + name + "]: Err occurred when trying to execute waitFor"));
	        console.log(e);
	        process.exit(1);
	      });

	      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2));
	    } catch (e) {
	      return Promise.reject(e);
	    }
	  });
	};

	module.exports = CopyNoLoopPlugin;

})));
//# sourceMappingURL=index.umd.js.map
