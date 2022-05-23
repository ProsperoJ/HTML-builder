const fs = require('fs');
const path = require('path');

const mainFolderPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const indexHTMLPath = path.join(__dirname, 'project-dist' , 'index.html');

const styleCssPath = path.join(__dirname, 'project-dist/style.css');
const filePathStyle = path.join(__dirname, 'styles');

const filePathOrigin = path.join(__dirname, 'assets');
const filePathCopy = path.join(__dirname, 'project-dist/assets');

// Сreating a folder if it does not exist
async function init(folder) {
  await fs.access(folder, fs.F_OK, (err) => {
    if (err) {
      fs.mkdir(folder, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Create folder "${path.basename(folder)}"!`);
      })
    }
    //folder exists
  })
}

// Added the content of the templates to HTML
async function changeTemplate() {
  const stream = fs.createReadStream(templatePath, 'utf-8');
  const indexHtml = fs.createWriteStream(indexHTMLPath);

  let html = '';
  stream.on('data', chunk => {
    html += chunk;
    html = html.toString();

    fs.readdir(componentsPath, {withFileTypes: true}, (err, components) => {
      if (err) {
        throw err;
      }
      let arr = [];
      for (let file of components) {
        arr.push(`{{${path.parse(file.name).name}}}`)
      }

      fs.promises.readdir(componentsPath)
      .then( async components => {
        components.forEach((file, index) => {
          const componentPath = path.join(__dirname, 'components', file);
          const readableStream = fs.createReadStream(componentPath);
          readableStream.on('data', chunk => {
            html = html.replace(arr[index], chunk);
            if (index === arr.length - 1) {
             indexHtml.write(html);
            }
            console.log(`Template "${path.parse(componentPath).name}" added to "${path.basename(indexHTMLPath)}"!`);
          })
        })
      })
    })
  })
}
// changeTemplate()

// Concatenates style files into style.css
async function mergeStyleCssFile() {
  await fs.promises.readdir(filePathStyle, { withFileTypes: true })
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
            fs.appendFile(styleCssPath, content, (err) => {
              if (err) {
                throw  err;
              }
              console.log(`Styles ${file.name} merged to ${path.basename(styleCssPath)}!`);
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
// mergeStyleCssFile()

// Clearing the contents of the style.css
async function clearCssFile() {
  fs.truncate(styleCssPath, 0, (err) => {
    if (err) {
      throw err
    }
    console.log(`"${path.basename(styleCssPath)}" cleared!`)})
}
// clearCssFile()


async function copyAssetsFile() {
  await init(filePathCopy);
  await fs.readdir(filePathOrigin, (err, elements) => {
    if (err) {
      throw err;
    }
    for (let el of elements) {
      fs.mkdir(path.join(filePathCopy, el), {recursive: true}, (err) => {
        if (err) {
          throw err;
        }
      });
      const assetsOriginFolder = path.join(filePathOrigin, el);
      const assetsCopyFolder = path.join(filePathCopy, el);
      fs.readdir(assetsOriginFolder, (err, items) => {
        if (err) {
          throw err
        }
        for (const item of items) {
            fs.copyFile(path.join(assetsOriginFolder, item), path.join(assetsCopyFolder, item), fs.constants.COPYFILE_EXCL, (err) => {
                if (err) {
                  process.exit();
                }
                console.log(`Сopied the file "${item}" to the folder "${path.basename(assetsCopyFolder)}"`);
            });
        }
    });
    }
  })
}

async function buildPage() {
  await init(mainFolderPath);
  setTimeout(() => {
    changeTemplate();
  }, 500);
  setTimeout(() => {
    mergeStyleCssFile();
  }, 1000);
  setTimeout(() => {
    copyAssetsFile();
  }, 1500);
}

buildPage();
