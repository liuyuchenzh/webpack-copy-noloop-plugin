const fse = require("fs-extra");
const fs = require("fs");
const path = require("path");

const isDir = location => fs.statSync(location).isDirectory();
const gatherFiles = location => pattern => {
  return fs.readdirSync(location).reduce((last, file) => {
    const fileInAbs = path.join(location, "/", file);
    if (isDir(fileInAbs)) {
      last.concat(gatherFiles(path.join(location, "/", file))(pattern));
    } else {
      if (pattern.test(fileInAbs)) {
        last.push(fileInAbs);
      }
    }
    return last;
  }, []);
};

/**
 * if copy file from directory
 * generate proper dest path
 * @param {string} dirFromPath
 * @param {string} dirToPath
 * @returns {function(string, boolean=)}
 */
const getDestPath = (dirFromPath, dirToPath) => (
  fileFromPath,
  flatten = false
) => {
  const relativePath = flatten
    ? path.basename(fileFromPath)
    : path.relative(dirFromPath, fileFromPath);
  return path.join(dirToPath, "/", relativePath);
};

/**
 * @typedef {object} CopyItem
 * @property {string} from
 * @property {string} to
 * @property {function(string, string)=} filter
 * @property {regexp=} pattern
 * @property {boolean=} flatten
 */

class CopyNoLoopPlugin {
  /**
   * @param {object} options
   * @param {CopyItem[]} options.list
   */
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap("CopyNoLoopPlugin", () => {
      const { list } = this.options;
      if (!Array.isArray(list)) return;
      list.forEach(item => {
        const {
          from,
          to,
          filter = () => true,
          pattern,
          flatten = false
        } = item;
        if (isDir(from) && pattern) {
          const files = gatherFiles(from)(pattern);
          files.forEach(file => {
            const dest = getDestPath(from, to)(file, flatten);
            fse.copySync(file, dest, { filter });
          });
        } else {
          fse.copySync(from, to, {
            filter
          });
        }
      });
    });
  }
}

module.exports = CopyNoLoopPlugin;
