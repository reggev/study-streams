const Dictionary = require("./Dictionary");

/**
 * @param {NodeJS.ReadableStream} readStream
 * @returns {Promise<Record<String, Number>>}
 */
module.exports = (readStream) =>
  new Promise((res) => {
    const dictionary = new Dictionary();
    let lastWord = null;
    readStream.on("data", (payload) => {
      const body = payload.toString();
      const words = body.split(/\s/);
      if (lastWord) {
        words[0] = lastWord + words[0];
        lastWord = null;
      }
      const last = words.pop();
      if (last === "") {
        lastWord = null;
      } else {
        lastWord = last;
      }
      words.forEach(dictionary.addWord);
    });
    readStream.on("close", () => res(dictionary.state));
  });
