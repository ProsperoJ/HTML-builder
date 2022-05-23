const fs = require('fs');
const path = require('path');

const filePathOrigin = path.join(__dirname, 'files');
const filePathCopy = path.join(__dirname, 'files-copy');

function func() {
  init()
  clearCopyFolder()
  copyFiles()
}

// Сreating a folder if it does not exist
function init() {
  fs.access(filePathCopy, fs.F_OK, (err) => {
    if (err) {
      fs.mkdir(filePathCopy, (err) => {
        if (err) {
          throw err;
        }
        console.log('Create folder!');
      })
    }
    //folder exists
  })
}

// Clearing the contents of the files-copy folder
function clearCopyFolder() {
  fs.promises.readdir(filePathCopy)
  // If promise resolved and
  // datas are fetched
  .then(elements => {
    for (let file of elements) {
      fs.unlink(filePathCopy + `\\${file}`, err => {
        if (err) throw err;
      });
    }
  })
  // If promise is rejected
  .catch(err => {
    console.log(err)
  })
}

// Copy the contents of the files folder to folder-copy
function copyFiles() {
  fs.promises.readdir(filePathOrigin)
  // If promise resolved and
  // datas are fetched
  .then(elements => {
    for (let file of elements) {
      const pathFiles = path.join(__dirname, 'files/');
      fs.copyFile(pathFiles + `${file}`, filePathCopy + `\\${file}`, err => {
        if (err) throw  err;
        console.log(`${file} copied!`);
      });
    }
  })
  // If promise is rejected
  .catch(err => {
    console.log(err)
  })
}

func();
