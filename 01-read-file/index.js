const fs = require('fs');
const path = require('path');

const { stdout } = process;
const filePath = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(filePath);
let data = '';
stream.on('data', (chunk) => data += chunk);
stream.on('end', () => stdout.write(data.toString()));
