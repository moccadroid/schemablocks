const fs = require("fs");

function copyPackageJson() {
  const packageJson = fs.readFileSync("./package.json", "utf-8");

  const json = JSON.parse(packageJson);
  json.files = ["*"];
  json.main = "main.js";

  fs.writeFileSync("./dist/package.json", JSON.stringify(json));
  console.log("package.json copied to /dist")
}

copyPackageJson();
