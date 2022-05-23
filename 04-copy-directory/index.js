const fs = require("fs");
const path = require("path");

const filePathOrigin = path.join(__dirname, "files");
const filePathCopy = path.join(__dirname, "files-copy");

async function func() {
  await init();
  await clearCopyFolder();
  await copyFiles();
}

// Сreating a folder if it does not exist
async function init() {
  let dir;
  try {
    dir = await fs.promises.access(filePathCopy);
  } catch (e) {
    await fs.promises.mkdir(filePathCopy, (err) => {
      if (err) {
        throw err;
      }
    })
    console.log('Create folder!');
  }
}

// Clearing the contents of the files-copy folder
async function clearCopyFolder() {
  if (filePathCopy) {
    await fs.promises.readdir(filePathCopy)
      // If promise resolved and
      // datas are fetched
      .then((elements) => {
        for (let file of elements) {
          fs.unlink(filePathCopy + `\\${file}`, (err) => {
            if (err) {
              throw err;
            }
            console.log(`${path.basename(file)} cleared!`);
          });
        }
      })
      // If promise is rejected
      .catch((err) => {
        console.log(err);
      });
  }
}

// Copy the contents of the files folder to folder-copy
async function copyFiles() {
  await fs.promises
    .readdir(filePathOrigin)
    // If promise resolved and
    // datas are fetched
    .then((elements) => {
      for (let file of elements) {
        // const pathFiles = path.join(__dirname, 'files/');
        const srcPath = path.join(filePathOrigin, file);
        const destPath = path.join(filePathCopy, file);
        fs.copyFile(srcPath, destPath, (err) => {
          if (err) throw err;
          console.log(`${file} copied!`);
        });
      }
    })
    // If promise is rejected
    .catch((err) => {
      console.log(err);
    });
}

func();
