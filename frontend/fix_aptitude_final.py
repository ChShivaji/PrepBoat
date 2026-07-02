import re

# Read refactor_aptitude.py template
with open(r'c:\Users\Shivaji\.gemini\antigravity\brain\4b76cc4e-bc56-4bb8-b0cd-2296a8605716\scratch\refactor_aptitude.py', 'r', encoding='utf-8') as f:
    refactor_code = f.read()

# We need to extract the template part from new_content = """ ... """
# Then we modify it and write a new script that will do the same but with the modified template.

# We can just modify the string directly.
# Replace text colors
refactor_code = refactor_code.replace('text-slate-900', 'text-black')
refactor_code = refactor_code.replace('text-slate-800', 'text-black')
refactor_code = refactor_code.replace('text-slate-700', 'text-slate-950')
refactor_code = refactor_code.replace('text-slate-600', 'text-slate-900')
refactor_code = refactor_code.replace('text-slate-500', 'text-slate-800')

# Replace text sizes
refactor_code = refactor_code.replace('text-[9px]', 'text-xs')
refactor_code = refactor_code.replace('text-[10px]', 'text-sm')
refactor_code = refactor_code.replace('text-xs', 'text-base')
refactor_code = refactor_code.replace('text-sm', 'text-lg')
refactor_code = refactor_code.replace('text-lg', 'text-2xl')
refactor_code = refactor_code.replace('text-2xl', 'text-4xl')

# We can directly run the modified code using exec()!
exec(refactor_code)
