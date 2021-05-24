const fs = require("fs");
const express = require("express");
const busboy = require("connect-busboy");
const { v4 } = require("uuid");
const { dump, load, mergeDictionaries } = require("./Dictionary");
const counter = require("./counter");

const app = express();
app.use(busboy({ immediate: true }));

app.post("/", async (req, res) => {
  req.busboy.on("file", async (_, file) => {
    let counts;
    try {
      counts = await counter(file);
    } catch (error) {
      return res.sendStatus(500);
    }
    try {
      await dump(`./dumps/${v4()}.json`, counts);
    } catch (error) {
      console.log({ error });
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
});

app.get("/word/:word", async (req, res) => {
  const counts = await load(`./counts.json`);
  const { word } = req.params;
  res.json({ [word]: counts[word] || 0 });
});

setInterval(async () => {
  const fileNames = fs.readdirSync("./dumps/");
  if (fileNames.length === 0) return;

  let dictionary = await load("./counts.json");
  
  for await (const fileName of fileNames) {
    const file = await load(`./dumps/${fileName}`);
    dictionary = mergeDictionaries(dictionary, file);
  }

  dump("./counts.json", dictionary);

  await Promise.all(
    fileNames.map(
      (file) =>
        new Promise((res, rej) =>
          fs.unlink(`./dumps/${file}`, (err) => (err ? rej() : res(true)))
        )
    )
  );
}, 10000);

app.listen(3000, () => {
  console.info("listening on port 3000");
});
