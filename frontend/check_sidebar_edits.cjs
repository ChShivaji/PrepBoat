const fs = require('fs');

const logPath = 'C:\\Users\\Shivaji\\.gemini\\antigravity\\brain\\4b76cc4e-bc56-4bb8-b0cd-2296a8605716\\.system_generated\\logs\\transcript.jsonl';
if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const step = JSON.parse(line);
            if (step.step_index > 5299 && step.step_index < 5680) {
                const toolCalls = step.tool_calls || [];
                for (const tc of toolCalls) {
                    const args = tc.args || {};
                    let targetPath = (args.TargetFile || "").replace(/['"]/g, '').replace(/\\/g, '/');
                    if (targetPath.endsWith('Sidebar.jsx')) {
                        console.log(`Step ${step.step_index}: tool=${tc.name}, args=${JSON.stringify(tc.args)}`);
                    }
                }
            }
        } catch (e) {}
    }
}
