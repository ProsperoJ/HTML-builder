const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Enter data:\n');
stdin.on('data', (data) => {
  let message = data.toString();
  if (message.toLowerCase().trim() == 'exit') {
    makeExitFunction();
  }
  output.write(data);
  stdout.write('Add more data:\n');
});

function makeExitFunction() {
  stdout.write('Input completed!');
  process.exit();
}
process.on('SIGINT', () => makeExitFunction());
