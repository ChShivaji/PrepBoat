import os

src_dir = r"c:\Users\Shivaji\OneDrive\Documents\Desktop\prepboat\frontend\src"
found_files = []

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".jsx", ".js", ".tsx", ".ts")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if "ResponsiveContainer" in content:
                        found_files.append(filepath)
            except Exception as e:
                pass

print("Files using ResponsiveContainer:")
for f in found_files:
    print(f)
