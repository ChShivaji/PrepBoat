import json

transcript_path = r"C:\Users\Shivaji\.gemini\antigravity\brain\4b76cc4e-bc56-4bb8-b0cd-2296a8605716\.system_generated\logs\transcript_full.jsonl"

found_steps = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            # Find steps where AIResumeAnalyzer.jsx or resume_service.py was written/modified in response to the reference links
            # User request 8 was: "for rseme checking take reference..."
            content_str = str(data.get('content', '')) + str(data.get('tool_calls', ''))
            if "take reference for the output" in content_str or "1millionresume" in content_str:
                print(f"Match found in Step {data.get('step_index')}, type: {data.get('type')}")
                found_steps.append(data.get('step_index'))
        except Exception as e:
            pass

print("Done scanning.")
