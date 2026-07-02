import json
import re

log_path = r"C:\Users\Shivaji\.gemini\antigravity\brain\4b76cc4e-bc56-4bb8-b0cd-2296a8605716\.system_generated\logs\transcript.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'Aptitude' in line and '30 questions' in line:
            print(f"Line {i}: {line[:500]}")
