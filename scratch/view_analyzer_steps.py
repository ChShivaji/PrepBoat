import json

transcript_path = r"C:\Users\Shivaji\.gemini\antigravity\brain\4b76cc4e-bc56-4bb8-b0cd-2296a8605716\.system_generated\logs\transcript_full.jsonl"

steps_to_inspect = list(range(4150, 4220))

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get('step_index')
            if step_idx in steps_to_inspect:
                print(f"=== Step {step_idx} (Type: {data.get('type')}, Source: {data.get('source')}) ===")
                if 'content' in data and data['content']:
                    print(f"  Content: {str(data['content'])[:120]}")
                if 'tool_calls' in data:
                    for call in data['tool_calls']:
                        args = call.get('args', {}) or call.get('arguments', {})
                        target = args.get('TargetFile', '') or args.get('targetFile', '')
                        print(f"  Tool: {call.get('name')}, File: {target}")
        except Exception as e:
            pass
print("Done scanning.")
