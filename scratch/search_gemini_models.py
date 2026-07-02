import os

backend_dir = r"c:\Users\Shivaji\OneDrive\Documents\Desktop\prepboat\backend"
found_lines = []

for root, dirs, files in os.walk(backend_dir):
    # Skip environment folders in place
    dirs[:] = [d for d in dirs if d not in ('.venv', 'venv', 'node_modules', '__pycache__')]
    for file in files:
        if file.endswith((".py", ".json", ".env")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line_no, line in enumerate(f, 1):
                        if "gemini-2.5-flash" in line:
                            found_lines.append((filepath, line_no, line.strip()))
            except Exception as e:
                pass

print("Lines matching gemini-2.5-flash:")
for filepath, line_no, line in found_lines:
    print(f"{filepath}:{line_no}: {line}")
