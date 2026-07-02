const fs = require('fs');
const path = require('path');

const backendDir = 'c:\\Users\\Shivaji\\OneDrive\\Documents\\Desktop\\prepboat\\backend\\app';

function searchDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (file.endsWith('.py')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('aptitude') || content.includes('/questions') || content.includes('Aptitude')) {
                console.log(`Found match in file: ${fullPath}`);
                const lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('route') || lines[i].includes('def ') || lines[i].includes('get_')) {
                        console.log(`  Line ${i+1}: ${lines[i].trim()}`);
                    }
                }
            }
        }
    }
}

searchDir(backendDir);
