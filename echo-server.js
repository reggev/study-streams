const http = require("http");

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const payload = JSON.parse(body);
      console.log(payload);
      res.write(JSON.stringify(payload));
      res.end();
    } catch (error) {
      res.statusCode = 400;
      return res.end("not a valid json...");
    }
  });
});

server.listen(3000);
