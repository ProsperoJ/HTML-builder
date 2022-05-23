const fs = require('fs');
const path = require('path');

const filePathBundle = path.join(__dirname, 'project-dist/bundle.css');
const filePathStyle = path.join(__dirname, 'styles');

function mergeBundleCssFile() {
  fs.promises.readdir(filePathStyle, { withFileTypes: true })
  // If promise resolved and
  // datas are fetched
  .then(elements => {
    for (let file of elements) {
      if (file.isFile()) {
        const extension = path.extname(file.name)
        if (extension === '.css') {
          const pathFile = path.join(__dirname, `styles/${file.name}`)
          fs.readFile(pathFile, 'utf-8', (err, content) => {
            if (err) {
              throw err;
            }
            fs.appendFile(filePathBundle, content, (err) => {
              if (err) {
                throw  err;
              }
              console.log(`Styles ${file.name} merged to ${path.basename(filePathBundle)}!`);
            });
          })
        }
      }
    }
  })
  // If promise is rejected
  .catch(err => {
    console.log(err)
  })
}

// Clearing the contents of the bundle.css
function clearBundleFile() {
  fs.truncate(filePathBundle, 0, (err) => {
    if (err) {
      throw err
    }
    console.log(`${path.basename(filePathBundle)} cleared!`)})
}

function createBundle() {
  clearBundleFile()
  mergeBundleCssFile();
}

createBundle();
