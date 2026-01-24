#!/usr/bin/env python3
"""从 YAML 中提取字符，使用字体渲染透明背景的字符截图
添加字体支持检测，对不支持的字符生成占位图片"""

import yaml
import os
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from functools import lru_cache
from fontTools.ttLib import TTFont

SCRIPT_DIR = Path(__file__).parent.resolve()

FONT_CHAI_PUA = str(SCRIPT_DIR / 'ChaiPUA-0.2.7.ttf')
FONT_SONGTI = str(SCRIPT_DIR / 'NotoSerifSC-Medium.otf')
YAML_PATH = str(SCRIPT_DIR / 'mapping.yaml')
OUTPUT_DIR = str(SCRIPT_DIR / 'char_images')

# 缓存字体的cmap表
_font_cmap_cache = {}

def get_font_cmap(font_path: str):
    """获取字体的字符映射表"""
    if font_path not in _font_cmap_cache:
        try:
            font = TTFont(font_path)
            cmap = font.getBestCmap()
            _font_cmap_cache[font_path] = set(cmap.keys()) if cmap else set()
            font.close()
        except Exception as e:
            print(f"Error loading font cmap {font_path}: {e}")
            _font_cmap_cache[font_path] = set()
    return _font_cmap_cache[font_path]

def font_supports_char(font_path: str, char: str) -> bool:
    """检查字体是否支持指定字符"""
    cmap = get_font_cmap(font_path)
    code = ord(char)
    return code in cmap

@lru_cache(maxsize=10)
def _load_font(font_path: str, size: int):
    """缓存字体加载"""
    try:
        return ImageFont.truetype(font_path, size)
    except Exception as e:
        print(f"Failed to load font {font_path}: {e}")
        try:
            return ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc", size)
        except:
            return ImageFont.load_default()

def load_mapping(yaml_path: str, key: str = 'mapping') -> dict:
    """加载 YAML 文件"""
    with open(yaml_path, encoding='utf-8') as f:
        return yaml.safe_load(f).get(key, {})

def create_placeholder_image(char: str, size: int = 256, output_path: str = None) -> Image.Image:
    """创建占位图片，显示字符的Unicode码点"""
    img = Image.new('RGBA', (size, size), (255, 200, 200, 255))  # 浅红色背景
    draw = ImageDraw.Draw(img)
    
    # 画一个X标记
    margin = size // 8
    line_width = max(2, size // 64)
    draw.line([(margin, margin), (size - margin, size - margin)], fill=(200, 50, 50, 255), width=line_width)
    draw.line([(size - margin, margin), (margin, size - margin)], fill=(200, 50, 50, 255), width=line_width)
    
    # 显示Unicode码点
    code = ord(char)
    code_text = f"U+{code:04X}"
    try:
        # 尝试加载一个基本字体来显示码点
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size // 8)
    except:
        small_font = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), code_text, font=small_font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = size - text_height - margin
    draw.text((x, y), code_text, font=small_font, fill=(100, 0, 0, 255))
    
    if output_path:
        img.save(output_path, 'PNG')
    return img

def render_char(char: str, font_path: str, size: int = 256, output_path: str = None) -> Image.Image:
    """渲染字符为透明背景图像"""
    try:
        # 首先检查字体是否支持该字符
        if not font_supports_char(font_path, char):
            print(f"Font does not support char: {repr(char)} (U+{ord(char):04X})")
            return None
        
        img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        draw = ImageDraw.Draw(img)
        font = _load_font(font_path, int(size * 0.8))
        
        bbox = draw.textbbox((0, 0), char, font=font)
        char_width = bbox[2] - bbox[0]
        char_height = bbox[3] - bbox[1]
        
        # 检查渲染出的字符是否有实际内容（宽高不能太小）
        if char_width < 2 or char_height < 2:
            print(f"Rendered char too small: {repr(char)} (U+{ord(char):04X}), size: {char_width}x{char_height}")
            return None
        
        x = (size - char_width) // 2 - bbox[0]
        y = (size - char_height) // 2 - bbox[1]
        
        draw.text((x, y), char, font=font, fill=(0, 0, 0, 255))
        
        # 检查图片是否有实际内容（不是全透明）
        pixels = list(img.getdata())
        has_content = any(p[3] > 0 for p in pixels)  # 检查alpha通道
        
        if not has_content:
            print(f"Rendered image is empty: {repr(char)} (U+{ord(char):04X})")
            return None
        
        if output_path:
            img.save(output_path, 'PNG')
        return img
    except Exception as e:
        print(f"Error rendering {repr(char)}: {e}")
        return None

def is_pua_char(char: str) -> bool:
    """检查字符是否为PUA私用区字符"""
    code = ord(char)
    # PUA区域: E000-F8FF, F0000-FFFFD, 100000-10FFFD
    return (0xE000 <= code <= 0xF8FF or 
            0xF0000 <= code <= 0xFFFFD or 
            0x100000 <= code <= 0x10FFFD)

def main():
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    
    # 加载mapping和grouping
    mapping = load_mapping(YAML_PATH, 'mapping')
    grouping = load_mapping(YAML_PATH, 'grouping')
    
    # 收集所有需要渲染的字符
    all_chars = set(mapping.keys()) | set(grouping.keys())
    
    print(f"Total characters to render: {len(all_chars)}")
    print(f"Mapping chars: {len(mapping)}")
    print(f"Grouping chars: {len(grouping)}")
    
    # 预加载字体cmap
    print("\nLoading font character maps...")
    chai_cmap = get_font_cmap(FONT_CHAI_PUA)
    songti_cmap = get_font_cmap(FONT_SONGTI)
    print(f"ChaiPUA font supports {len(chai_cmap)} characters")
    print(f"Songti font supports {len(songti_cmap)} characters")
    
    success = 0
    placeholder = 0
    fail = 0
    unsupported_chars = []
    failed_with_names = []
    
    for char in all_chars:
        char_name = mapping.get(char, grouping.get(char, ''))
        try:
            # 使用Unicode码点作为文件名
            code = ord(char)
            filename = f"{code:04x}.png"
            output_path = os.path.join(OUTPUT_DIR, filename)
            
            # 根据字符类型选择字体
            if is_pua_char(char):
                font_path = FONT_CHAI_PUA
            else:
                font_path = FONT_SONGTI
            
            # 尝试渲染
            result = render_char(char, font_path, size=256, output_path=output_path)
            
            if result:
                success += 1
            else:
                # 如果主字体不支持，尝试另一个字体
                alt_font = FONT_SONGTI if is_pua_char(char) else FONT_CHAI_PUA
                result = render_char(char, alt_font, size=256, output_path=output_path)
                
                if result:
                    success += 1
                    print(f"  -> Used alternative font for {repr(char)}")
                else:
                    # 创建占位图片
                    create_placeholder_image(char, size=256, output_path=output_path)
                    placeholder += 1
                    unsupported_chars.append((char, code))
                    failed_with_names.append({'char': char, 'name': char_name})
                    print(f"  -> Created placeholder for {repr(char)} (U+{code:04X})")
                    
        except Exception as e:
            fail += 1
            failed_with_names.append({'char': char, 'name': char_name})
            print(f"Error processing {repr(char)}: {e}")
    
    # 保存失败的字符到 not_found.jsonl
    not_found_path = os.path.join(OUTPUT_DIR, 'not_found.jsonl')
    with open(not_found_path, 'w', encoding='utf-8') as f:
        for item in failed_with_names:
            f.write(f'{{"char": "{item["char"]}", "name": "{item["name"]}"}}\n')
    
    print(f"\n{'='*60}")
    print(f"Completed:")
    print(f"  Success: {success}")
    print(f"  Placeholder: {placeholder}")
    print(f"  Failed: {fail}")
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Failed chars saved to: {not_found_path}")
    
    if unsupported_chars:
        print(f"\nUnsupported characters ({len(unsupported_chars)}):")
        for char, code in unsupported_chars:
            print(f"  U+{code:04X}: {repr(char)}")

if __name__ == '__main__':
    main()
