#!/usr/bin/env python3
"""使用 substitute 字段为 not_found.jsonl 中的字符生成截图"""

import json
import os
from pathlib import Path
from generate_char_images import OUTPUT_DIR, render_char, FONT_SONGTI, FONT_CHAI_PUA, is_pua_char

FIXED_DIR = os.path.join(OUTPUT_DIR, 'fixed')
Path(FIXED_DIR).mkdir(parents=True, exist_ok=True)

not_found_path = os.path.join(OUTPUT_DIR, 'not_found.jsonl')

with open(not_found_path, 'r', encoding='utf-8') as f:
    for line in f:
        item = json.loads(line.strip())
        original_char = item['char']
        substitute = item.get('substitute', '')
        
        if not substitute:
            continue
            
        code = ord(original_char)
        filename = f"{code:04x}.png"
        output_path = os.path.join(FIXED_DIR, filename)
        
        if is_pua_char(substitute):
            font_path = FONT_CHAI_PUA
        else:
            font_path = FONT_SONGTI
        
        result = render_char(substitute, font_path, size=256, output_path=output_path)
        
        if result:
            print(f"Created: {filename} from substitute '{substitute}' for original '{original_char}'")
        else:
            print(f"Failed: {original_char} -> {substitute}")

print(f"\nFixed images saved to: {FIXED_DIR}")
