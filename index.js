const fse = require("fs-extra");
const fs = require("fs");
const path = require("path");
const name = 'webpack-copy-noloop-plugin';

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
   * @param {string=} options.root root directory
   */
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap("CopyNoLoopPlugin", () => {
      const { list, root } = this.options;
      if (!Array.isArray(list)) return;
      let listMut = list.slice();
      if (root) {
        // check for absolute
        if (!path.isAbsolute(root)) {
          throw new Error(`[${name}]: root needs to be an absolute path!`);
        }
        listMut = listMut.map(item => {
          return {
            ...item,
            from: path.resolve(root, item.from),
            to: path.resolve(root, item.to)
          };
        });
      }
      listMut.forEach(item => {
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
