const fs = require("fs");
class Dictionary {
  constructor() {
    this.state = {};
  }

  addWord = (word) => {
    let _word = word.replace(/\W/g, "").toLowerCase();
    if (!_word) return;
    this.state[_word] = _word in this.state ? this.state[_word] + 1 : 1;
  };
}

/** @typedef {Record<string, number>} Counts */

/** @type {(src: Counts, counts: Counts) => Counts} */
const mergeDictionaries = (src, counts) => {
  const next = { ...src };
  Object.entries(counts).forEach(([key, value]) => {
    if (next[key]) {
      next[key] = next[key] + value;
    } else {
      next[key] = value;
    }
  });
  return next;
};

/** @type {(filePath: fs.PathLike, counts: Counts) => Promise<void>} */
const dump = async (filePath, counts) =>
  new Promise((res, rej) => {
    fs.writeFile(filePath, JSON.stringify(counts, null, 2), (err) => {
      if (err) return rej(err);
      res();
    });
  });

/** @type {(filePath: fs.PathLike) => Promise<Counts>} */
const load = (filePath) =>
  new Promise((res, rej) => {
    fs.readFile(filePath, (err, content) => {
      if (err) return rej(err);
      try {
        const body = content.toString();
        if (body) {
          res(JSON.parse(body));
        } else {
          res({});
        }
      } catch (error) {
        return rej(error);
      }
    });
  });

module.exports = Dictionary;
module.exports.dump = dump;
module.exports.load = load;
module.exports.mergeDictionaries = mergeDictionaries;
