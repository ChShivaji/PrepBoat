import json

transcript_path = r"C:\Users\Shivaji\.gemini\antigravity\brain\4b76cc4e-bc56-4bb8-b0cd-2296a8605716\.system_generated\logs\transcript_full.jsonl"

steps_to_inspect = [4178, 4180]

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get('step_index')
            if step_idx in steps_to_inspect:
                if 'tool_calls' in data:
                    for call in data['tool_calls']:
                        args = call.get('args', {}) or call.get('arguments', {})
                        for k, v in args.items():
                            if k in ('ReplacementContent', 'ReplacementChunks', 'CodeContent'):
                                filename = f"scratch/step_{step_idx}_{k}.txt"
                                with open(filename, 'w', encoding='utf-8') as out_f:
                                    if isinstance(v, list):
                                        json.dump(v, out_f, indent=2)
                                    else:
                                        out_f.write(v)
                                print(f"Wrote {filename}")
        except Exception as e:
            pass
