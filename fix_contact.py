import sys

file_path = 'src/pages/Contact.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'Camera, Globe, Users, Mail' in line:
        lines[i] = "  Camera, Globe, Users, Mail, Send, Sprout, Zap, MessageSquare, User, Leaf, Clover, MapPin, ChevronDown\n"
        break

# Keep lines 1-14 (indices 0-13) and lines 493-987 (indices 492+)
new_lines = lines[:14] + lines[492:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed Contact.jsx")
 