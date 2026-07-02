const fs = require('fs');

const filePath = 'c:\\Users\\Shivaji\\OneDrive\\Documents\\Desktop\\prepboat\\frontend\\src\\pages\\AptitudePrep.jsx';
if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    console.log("Searching for API calls and state hooks in AptitudePrep.jsx...");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('useEffect') || line.includes('fetch(') || line.includes('axios.') || line.includes('/api/')) {
            console.log(`Line ${i+1}: ${line.trim()}`);
        }
    }
}
