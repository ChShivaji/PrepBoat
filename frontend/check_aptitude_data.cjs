const fs = require('fs');

const filePath = 'c:\\Users\\Shivaji\\OneDrive\\Documents\\Desktop\\prepboat\\frontend\\src\\pages\\AptitudePrep.jsx';
if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    console.log("Checking topics array initialization in AptitudePrep.jsx...");
    for (let i = 0; i < 400; i++) {
        if (lines[i] && (lines[i].includes('const topics') || lines[i].includes('const initialTopics') || lines[i].includes('const placementPlan'))) {
            console.log(`Line ${i+1}: ${lines[i].trim()}`);
        }
    }
}
