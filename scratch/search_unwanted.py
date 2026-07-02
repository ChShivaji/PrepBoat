import os

src_dir = r"c:\Users\Shivaji\OneDrive\Documents\Desktop\prepboat\frontend\src"
search_terms = [
    "Futuristic Computer Science Workspace",
    "Assessment Node",
    "Full-Stack CSE Placement",
    "Diagnostics Console"
]

found_lines = []
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".jsx", ".js", ".tsx", ".ts")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    for line_no, line in enumerate(f, 1):
                        for term in search_terms:
                            if term in line:
                                found_lines.append((filepath, line_no, line.strip()))
            except Exception as e:
                pass

print("Search results:")
for filepath, line_no, line in found_lines:
    print(f"{filepath}:{line_no}: {line}")
