import json

transcript_path = r"C:\Users\Shivaji\.gemini\antigravity\brain\4b76cc4e-bc56-4bb8-b0cd-2296a8605716\.system_generated\logs\transcript_full.jsonl"

steps_to_find = [4195, 4197]

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('step_index') in steps_to_find:
                print(f"=== STEP {data.get('step_index')} KEYS: {list(data.keys())} ===")
                print(f"type: {data.get('type')}, status: {data.get('status')}")
                if 'content' in data and data['content']:
                    print(f"content preview: {str(data['content'])[:300]}")
                # Let's inspect where tool calls are
                for k, v in data.items():
                    if 'tool' in k or 'call' in k or 'action' in k:
                        print(f"Key '{k}': {str(v)[:300]}")
        except Exception as e:
            print(f"Error: {e}")
