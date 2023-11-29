const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "build", "index.html");

fs.readFile(indexPath, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(/\/pixel-reference\//g, "./");

  fs.writeFile(indexPath, result, "utf8", function (err) {
    if (err) return console.log(err);
  });
});
