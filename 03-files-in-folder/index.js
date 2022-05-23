const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "secret-folder");

async function showInfoFiles(folder) {
  await fs.promises.readdir(folder, { withFileTypes: true })
    // If promise resolved and
    // datas are fetched
    .then((elements) => {
      for (let file of elements) {
        if (file.isFile()) {
          const pathFile = path.join(__dirname, `secret-folder/${file.name}`);
          fs.stat(pathFile, (err, stats) => {
            if (err) {
              throw err;
            }
            console.log(
              `${path.parse(file.name).name} - ${path
                .extname(file.name)
                .slice(1)} - ${stats.size / 1000}kb`
            );
          });
        }
      }
    })
    // If promise is rejected
    .catch((err) => {
      console.log(err);
    });
}

showInfoFiles(filePath);
