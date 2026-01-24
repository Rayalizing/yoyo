#!/usr/bin/env python3
"""
生成字根数据模块
从 mapping.yaml 提取所有字根数据和分组关系
"""

import yaml
import json

def generate_zigen_data(mapping_path='mapping.yaml'):
    """生成包含所有字根（主字根 + 从属字根）的 ZIGEN_DATA"""
    with open(mapping_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    zigen_data = {}
    
    # 1. 添加主字根（从 mapping 部分）
    for char, info in data['mapping'].items():
        zigen_data[char] = {
            "code": info['code'],
            "name": info.get('name', '')
        }
    
    # 2. 添加从属字根（从 grouping 部分）
    for char, info in data['grouping'].items():
        parent = info['is_sub_of']
        # 从主字根中获取编码
        parent_code = data['mapping'].get(parent, {}).get('code', '')
        zigen_data[char] = {
            "code": parent_code,  # 从属字根使用主字根的编码
            "name": info['name']
        }
    
    return zigen_data

def generate_zigen_groups(mapping_path='mapping.yaml'):
    """生成主字根和从属字根的分组关系"""
    with open(mapping_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    # 提取主字根列表（mapping下面的所有key）
    main_radicals = list(data['mapping'].keys())
    
    # 提取从属字根及其归属（grouping下面的项）
    sub_radicals = {}
    for char, info in data['grouping'].items():
        parent = info['is_sub_of']
        if parent not in sub_radicals:
            sub_radicals[parent] = []
        sub_radicals[parent].append(char)
    
    # 构建分组数据：主字根 -> [从属字根数组]
    zigen_groups = {}
    for main in main_radicals:
        if main in sub_radicals:
            zigen_groups[main] = sub_radicals[main]
        else:
            zigen_groups[main] = []
    
    return zigen_groups

def format_as_js_module(mapping_path='mapping.yaml'):
    """将数据格式化为 JavaScript 模块"""
    with open(mapping_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    lines = []
    lines.append("// 字根数据模块 - 由 generate_zigen_groups.py 自动生成")
    lines.append("// 数据来源: mapping.yaml")
    lines.append("")
    
    # 生成 ZIGEN_DATA
    lines.append("const ZIGEN_DATA = {")
    
    # 主字根（从 mapping 部分）
    for char, info in sorted(data['mapping'].items()):
        code = info['code']
        name = info.get('name', '').replace('"', '\\"')
        lines.append(f'    "{char}": {{"code": "{code}", "name": "{name}"}},')
    
    # 从属字根（从 grouping 部分）
    for char, info in sorted(data['grouping'].items()):
        parent = info['is_sub_of']
        parent_code = data['mapping'].get(parent, {}).get('code', '')
        name = info['name'].replace('"', '\\"')
        lines.append(f'    "{char}": {{"code": "{parent_code}", "name": "{name}"}},')
    
    lines.append("};")
    lines.append("")
    
    # 生成 ZIGEN_GROUPS
    sub_radicals = {}
    for char, info in data['grouping'].items():
        parent = info['is_sub_of']
        if parent not in sub_radicals:
            sub_radicals[parent] = []
        sub_radicals[parent].append(char)
    
    lines.append("// 主字根和从属字根的分组关系")
    lines.append("const ZIGEN_GROUPS = {")
    
    for main in sorted(data['mapping'].keys()):
        if main in sub_radicals:
            subs_json = json.dumps(sub_radicals[main], ensure_ascii=False)
            lines.append(f'    "{main}": {subs_json},')
        else:
            lines.append(f'    "{main}": [],')
    
    lines.append("};")
    lines.append("")
    
    # 统计信息
    main_count = len(data['mapping'])
    sub_count = len(data['grouping'])
    lines.append(f"// 统计数据:")
    lines.append(f"// 主字根数量: {main_count}")
    lines.append(f"// 从属字根数量: {sub_count}")
    lines.append(f"// 字根总数: {main_count + sub_count}")
    
    return "\n".join(lines)

if __name__ == '__main__':
    mapping_path = '/Users/Tinond/Library/Rime/0--core/scripts/用HTML绘制字根表并展示字根映射/zigen_table/mapping.yaml'
    js_module = format_as_js_module(mapping_path)
    
    output_path = 'zigen_groups_module.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_module)
    
    print(f"已生成字根数据模块: {output_path}")
    
    # 读取文件统计
    with open(output_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    data_count = content.count('    "')
    print(f"ZIGEN_DATA 条目数: ~{data_count}")
