#!/usr/bin/env python3
"""生成字根表 HTML 网页"""

import yaml
import os
from collections import defaultdict

YAML_PATH = 'mapping.yaml'
OUTPUT_HTML = 'zigen_table.html'
CHAR_IMAGES_DIR = 'char_images'

# 60个大码，按6排10列排列
KEY_ROWS = [
    list('QWERTYUIOP'),  # 第一排大写
    list('qwertyuiop'),  # 第二排小写
    list('ASDFGHJKL:'),  # 第三排大写 + :
    list('asdfghjkl;'),  # 第四排小写 + ;
    list('ZXCVBNM<>?'),  # 第五排大写 + <>?
    list('zxcvbnm,./'),  # 第六排小写 + ,./
]

def load_yaml():
    """加载YAML文件"""
    with open(YAML_PATH, encoding='utf-8') as f:
        data = yaml.safe_load(f)
    return data.get('mapping', {}), data.get('grouping', {})

def get_char_image_path(char):
    """获取字符对应的图片路径"""
    code = ord(char)
    return f"{CHAR_IMAGES_DIR}/{code:04x}.png"

def build_key_data(mapping, grouping):
    """
    构建每个键位的字根数据
    返回: {大码: [(主字根, 小码, [从属字根列表])]}
    """
    # 首先建立主字根到从属字根的映射
    # grouping 格式: {从属字根: {is_sub_of: 主字根, name: 描述}}
    main_to_subs = defaultdict(list)
    for sub_char, info in grouping.items():
        if isinstance(info, dict) and 'is_sub_of' in info:
            main_char = info['is_sub_of']
            name = info.get('name', '')
            main_to_subs[main_char].append((sub_char, name))
    
    # 按大码分组
    key_data = defaultdict(list)
    
    for char, info in mapping.items():
        if isinstance(info, dict) and 'code' in info:
            code = info['code']
            name = info.get('name', '')
        elif isinstance(info, str):
            code = info
            name = ''
        else:
            continue
        
        if len(code) >= 2:
            big_code = code[0]  # 大码
            small_code = code[1:]  # 小码（可能多于一个字符）
            subs = main_to_subs.get(char, [])
            key_data[big_code].append((char, small_code, subs, name))
    
    return key_data

def generate_html(key_data):
    """生成HTML内容"""
    
    html_template = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>麓鸣·字根表</title>
    <style>
        :root {
            --ink-black: oklch(0.15 0.01 65);
            --ink-dark: oklch(0.25 0.01 65);
            --ink-medium: oklch(0.42 0.01 65);
            --ink-light: oklch(0.65 0.01 65);
            --paper-white: oklch(0.97 0.005 90);
            --paper-cream: oklch(0.95 0.01 85);
            --cinnabar-red: oklch(0.55 0.18 25);
            --border-color: oklch(0.85 0.01 85);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif;
            background: linear-gradient(135deg, var(--paper-cream) 0%, var(--paper-white) 100%);
            min-height: 100vh;
            padding: 15px;
            color: var(--ink-black);
        }
        
        .container {
            max-width: 1600px;
            margin: 0 auto;
        }
        
        h1 {
            font-family: "Noto Serif SC", Georgia, serif;
            text-align: center;
            color: var(--ink-black);
            margin-bottom: 15px;
            font-size: 2em;
            font-weight: 700;
            letter-spacing: 0.05em;
        }
        
        .keyboard {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        
        .row {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 6px;
        }
        
        .key {
            background: linear-gradient(135deg, var(--paper-cream) 0%, var(--paper-white) 100%);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            padding: 6px;
            position: relative;
            min-height: 140px;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .key:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.12);
            border-color: var(--ink-light);
        }
        
        .key-label {
            position: absolute;
            top: 4px;
            left: 6px;
            font-size: 13px;
            font-weight: bold;
            color: var(--ink-dark);
            background: var(--paper-cream);
            padding: 2px 5px;
            border-radius: 3px;
            border: 1px solid var(--border-color);
        }
        
        .key-content {
            margin-top: 26px;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            gap: 1px;
        }
        
        .char-group {
            display: inline-flex;
            align-items: flex-end;
            margin-right: 2px;
            margin-bottom: 2px;
            flex-shrink: 0;
        }
        
        .main-char {
            width: 26px;
            height: 26px;
            object-fit: contain;
            vertical-align: bottom;
        }
        
        .sub-char {
            width: 17px;
            height: 17px;
            object-fit: contain;
            opacity: 0.85;
            vertical-align: bottom;
        }
        
        .small-code {
            font-size: 10px;
            color: var(--cinnabar-red);
            font-weight: bold;
            margin-left: 1px;
            align-self: flex-end;
            line-height: 1;
        }
        
        .legend {
            text-align: center;
            margin-top: 15px;
            color: var(--ink-medium);
            font-size: 13px;
        }
        
        .legend span {
            margin: 0 12px;
        }
        
        @media (max-width: 1400px) {
            .key {
                min-height: 130px;
            }
            .main-char {
                width: 24px;
                height: 24px;
            }
            .sub-char {
                width: 15px;
                height: 15px;
            }
        }
        
        @media (max-width: 1200px) {
            .key {
                min-height: 120px;
                padding: 5px;
            }
            .key-label {
                font-size: 11px;
            }
            .main-char {
                width: 22px;
                height: 22px;
            }
            .sub-char {
                width: 14px;
                height: 14px;
            }
            .small-code {
                font-size: 9px;
            }
        }
        
        @media (max-width: 1000px) {
            .key {
                min-height: 110px;
                padding: 4px;
            }
            .key-label {
                font-size: 10px;
                padding: 1px 4px;
            }
            .main-char {
                width: 20px;
                height: 20px;
            }
            .sub-char {
                width: 12px;
                height: 12px;
            }
            .small-code {
                font-size: 8px;
            }
            .key-content {
                margin-top: 22px;
            }
        }
        
        .tooltip {
            position: fixed;
            background: linear-gradient(135deg, var(--paper-cream) 0%, var(--paper-white) 100%);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 16px 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-size: 14px;
            color: var(--ink-black);
            max-width: 200px;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
            font-family: "Noto Serif SC", Georgia, serif;
        }
        
        .tooltip.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .tooltip-img {
            width: 64px;
            height: 64px;
            object-fit: contain;
            display: block;
            margin: 0 auto 10px;
        }
        
        .tooltip-name {
            text-align: center;
            color: var(--ink-medium);
            line-height: 1.5;
        }
        
        .tooltip-close {
            position: absolute;
            top: 4px;
            right: 8px;
            background: none;
            border: none;
            font-size: 18px;
            color: var(--ink-medium);
            cursor: pointer;
            padding: 2px 6px;
            line-height: 1;
        }
        
        .tooltip-close:hover {
            color: var(--ink-dark);
        }
        
        .char-img {
            cursor: pointer;
            transition: transform 0.15s;
        }
        
        .char-img:hover {
            transform: scale(1.15);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>麓鸣·字根表</h1>
        <div class="keyboard">
'''
    
    # 生成每一排
    for row_idx, row_keys in enumerate(KEY_ROWS):
        html_template += '            <div class="row">\n'
        
        for key in row_keys:
            # 获取该键位的字根数据
            chars = key_data.get(key, [])
            
            # 显示的键位标签（处理特殊字符）
            display_key = key
            if key == '<':
                display_key = '&lt;'
            elif key == '>':
                display_key = '&gt;'
            
            html_template += f'                <div class="key">\n'
            html_template += f'                    <span class="key-label">{display_key}</span>\n'
            html_template += f'                    <div class="key-content">\n'
            
            for main_char, small_code, subs, main_name in chars:
                html_template += f'                        <span class="char-group">\n'
                # 主字根
                main_img_path = get_char_image_path(main_char)
                html_template += f'                            <img src="{main_img_path}" class="main-char char-img" alt="{main_char}" title="{main_char}" onclick="showTooltip(event, \'{main_img_path}\', \'{main_name}\')">\n'
                # 从属字根
                for sub, sub_name in subs:
                    sub_img_path = get_char_image_path(sub)
                    html_template += f'                            <img src="{sub_img_path}" class="sub-char char-img" alt="{sub}" title="{sub}" onclick="showTooltip(event, \'{sub_img_path}\', \'{sub_name}\')">\n'
                # 小码
                html_template += f'                            <span class="small-code">{small_code}</span>\n'
                html_template += f'                        </span>\n'
            
            html_template += f'                    </div>\n'
            html_template += f'                </div>\n'
        
        html_template += '            </div>\n'
    
    html_template += '''        </div>
        <div class="legend">
            <span>大字：主字根</span>
            <span>小字：从属字根</span>
            <span>红色字母：小码</span>
        </div>
    </div>
    
    <div class="tooltip" id="tooltip">
        <button class="tooltip-close" onclick="hideTooltip()">×</button>
        <img class="tooltip-img" id="tooltip-img" src="" alt="">
        <div class="tooltip-name" id="tooltip-name"></div>
    </div>
    
    <script>
        const tooltip = document.getElementById('tooltip');
        const tooltipImg = document.getElementById('tooltip-img');
        const tooltipName = document.getElementById('tooltip-name');
        
        function showTooltip(e, imgPath, name) {
            tooltipImg.src = imgPath;
            tooltipName.textContent = name || '';
            
            const rect = e.target.getBoundingClientRect();
            let left = rect.left + rect.width / 2 - 100;
            let top = rect.bottom + 10;
            
            if (left < 10) left = 10;
            if (left > window.innerWidth - 210) left = window.innerWidth - 210;
            if (top > window.innerHeight - 200) top = rect.top - 180;
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.classList.add('visible');
            
            e.stopPropagation();
        }
        
        function hideTooltip() {
            tooltip.classList.remove('visible');
        }
        
        document.addEventListener('click', function(e) {
            if (!e.target.classList.contains('char-img')) {
                hideTooltip();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideTooltip();
            }
        });
    </script>
</body>
</html>
'''
    
    return html_template

def main():
    # 加载数据
    mapping, grouping = load_yaml()
    print(f"Loaded {len(mapping)} mapping entries and {len(grouping)} grouping entries")
    
    # 构建键位数据
    key_data = build_key_data(mapping, grouping)
    print(f"Built data for {len(key_data)} keys")
    
    # 统计每个键位的字根数量
    for key in ['Q', 'a', ';', ':', '<', '>', '?', ',', '.', '/']:
        if key in key_data:
            print(f"Key '{key}': {len(key_data[key])} main chars")
    
    # 生成HTML
    html_content = generate_html(key_data)
    
    # 保存HTML文件
    with open(OUTPUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"\nHTML file generated: {OUTPUT_HTML}")

if __name__ == '__main__':
    main()
