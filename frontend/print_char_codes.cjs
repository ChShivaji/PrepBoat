const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Shivaji\\OneDrive\\Documents\\Desktop\\prepboat\\frontend\\src\\pages\\AIResumeCreator.jsx', 'utf8');
const lines = content.split('\n');
const line = lines[1017]; // 1018 is 0-indexed 1017
console.log("Line 1018 length:", line.length);
for (let i = 0; i < line.length; i++) {
    console.log(`Char ${i}: '${line[i]}' (code: ${line.charCodeAt(i)})`);
}
