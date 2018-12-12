// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = (function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

// Asynchronously implement a switch statement
function _switch(discriminant, cases) {
	var dispatchIndex = -1;
	var awaitBody;
	outer: {
		for (var i = 0; i < cases.length; i++) {
			var test = cases[i][0];
			if (test) {
				var testValue = test();
				if (testValue && testValue.then) {
					break outer;
				}
				if (testValue === discriminant) {
					dispatchIndex = i;
					break;
				}
			} else {
				// Found the default case, set it as the pending dispatch case
				dispatchIndex = i;
			}
		}
		if (dispatchIndex !== -1) {
			do {
				var body = cases[dispatchIndex][1];
				while (!body) {
					dispatchIndex++;
					body = cases[dispatchIndex][1];
				}
				var result = body();
				if (result && result.then) {
					awaitBody = true;
					break outer;
				}
				var fallthroughCheck = cases[dispatchIndex][2];
				dispatchIndex++;
			} while (fallthroughCheck && !fallthroughCheck());
			return result;
		}
	}
	const pact = new _Pact();
	const reject = _settle.bind(null, pact, 2);
	(awaitBody ? result.then(_resumeAfterBody) : testValue.then(_resumeAfterTest)).then(void 0, reject);
	return pact;
	function _resumeAfterTest(value) {
		for (;;) {
			if (value === discriminant) {
				dispatchIndex = i;
				break;
			}
			if (++i === cases.length) {
				if (dispatchIndex !== -1) {
					break;
				} else {
					_settle(pact, 1, result);
					return;
				}
			}
			test = cases[i][0];
			if (test) {
				value = test();
				if (value && value.then) {
					value.then(_resumeAfterTest).then(void 0, reject);
					return;
				}
			} else {
				dispatchIndex = i;
			}
		}
		do {
			var body = cases[dispatchIndex][1];
			while (!body) {
				dispatchIndex++;
				body = cases[dispatchIndex][1];
			}
			var result = body();
			if (result && result.then) {
				result.then(_resumeAfterBody).then(void 0, reject);
				return;
			}
			var fallthroughCheck = cases[dispatchIndex][2];
			dispatchIndex++;
		} while (fallthroughCheck && !fallthroughCheck());
		_settle(pact, 1, result);
	}
	function _resumeAfterBody(result) {
		for (;;) {
			var fallthroughCheck = cases[dispatchIndex][2];
			if (!fallthroughCheck || fallthroughCheck()) {
				break;
			}
			dispatchIndex++;
			var body = cases[dispatchIndex][1];
			while (!body) {
				dispatchIndex++;
				body = cases[dispatchIndex][1];
			}
			result = body();
			if (result && result.then) {
				result.then(_resumeAfterBody).then(void 0, reject);
				return;
			}
		}
		_settle(pact, 1, result);
	}
}

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
        var _temp = _switch(typeof waitFor, [[function () {
          return "function";
        }, function () {
          return Promise.resolve(waitFor()).then(function () {});
        }], [function () {
          return "number";
        }, function () {
          return Promise.resolve(new Promise(function (resolve) { return setTimeout(resolve, waitFor); })).then(function () {});
        }], []]);

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
//# sourceMappingURL=index.mjs.map
