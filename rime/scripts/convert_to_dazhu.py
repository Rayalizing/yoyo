#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import re
from collections import defaultdict
from ref_mayuan import set_mono, set_roman, set_bold_italic, set_shuangxian, set_bold

# 配置：
first_set = set_bold  # -x (三码左)
second_set = set_shuangxian  # [xy]
third_set = set_bold_italic  # =x (三码右)
fourth_set = set_mono  # _x （一简左）
fifth_set = set_roman  # +x （一简右）


def replace_code_element(code):
    """
    将匹配pattern的码元进行替换
    规则：
    - 如果整个编码是 -x（两个字符），用 fourth_set 替换
    - 如果整个编码是 =x（两个字符），用 fifth_set 替换
    - 圆括号 (..) 直接删掉括号，保留内部内容（不做替换）
    - 方括号 [xy] 用 second_set 替换两个字符
    - -x 用 first_set 替换
    - =x 用 third_set 替换
    支持同一行中多个模式混合
    """
    # 特殊判定：如果整个编码只有两个字符且是 -x 或 =x
    if len(code) == 2:
        if code[0] == '-' and code[1] in fourth_set:
            return fourth_set[code[1]]
        if code[0] == '=' and code[1] in fifth_set:
            return fifth_set[code[1]]
    
    code = re.sub(r'\(([^)]*)\)', r'\1', code)
    
    result = ''
    i = 0
    while i < len(code):
        if code[i] == '[':
            j = code.find(']', i)
            if j != -1 and (j - i) % 2 == 1:
                inner = code[i+1:j]
                for k in range(0, len(inner), 2):
                    pair = inner[k:k+2]
                    if len(pair) == 2 and pair[0] in second_set and pair[1] in second_set:
                        result += second_set[pair[0]] + second_set[pair[1]]
                    elif len(pair) == 1:
                        result += pair
                i = j + 1
            else:
                result += code[i]
                i += 1
        elif code[i] == '-' and i + 1 < len(code):
            if code[i+1] in first_set:
                result += first_set[code[i+1]]
                i += 2
            else:
                result += code[i]
                i += 1
        elif code[i] == '=' and i + 1 < len(code):
            if code[i+1] in third_set:
                result += third_set[code[i+1]]
                i += 2
            else:
                result += code[i]
                i += 1
        else:
            result += code[i]
            i += 1
    
    return result

def convert_dazhu_table(input_file, output_file):
    """
    将原始码表转换为dazhu码表格式
    原始格式：词	编码	词频
    目标格式：编码	候选1	候选2	...	候选n
    """
    # 用字典存储每个编码对应的候选词列表
    code_dict = defaultdict(list)
    
    with open(input_file, 'r', encoding='utf-8') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
                
            # 分割行内容
            parts = line.split('\t')
            if len(parts) != 3:
                print(f"警告：第{line_num}行格式不正确，已跳过: {line}", file=sys.stderr)
                continue
                
            word, code, freq = parts
            
            # 跳过词频为0的条目（通常是备用编码）
            if freq == '0':
                continue
                
            # 替换匹配pattern的码元
            replaced_code = replace_code_element(code)
            
            # 将词添加到对应编码的候选列表中
            code_dict[replaced_code].append(word)
    
    # 按编码排序输出
    with open(output_file, 'w', encoding='utf-8') as f:
        for code in sorted(code_dict.keys()):
            candidates = code_dict[code]
            # 编码后面跟候选词，用制表符分隔
            line = f"{code}{chr(9)}{chr(9).join(candidates)}{chr(10)}"
            f.write(line)
    
    print(f"转换完成！已生成dazhu码表文件: {output_file}")
    print(f"共处理了{len(code_dict)}个编码，{sum(len(v) for v in code_dict.values())}个词")

def convert_ceping_table(input_file, output_file):
    """
    将原始码表转换为宇浩ceping码表格式
    原始格式：词\t编码\t词频
    目标格式：词\t替换后的编码
    """
    with open(input_file, 'r', encoding='utf-8') as f_in, \
         open(output_file, 'w', encoding='utf-8') as f_out:
        
        for line_num, line in enumerate(f_in, 1):
            line = line.strip()
            if not line:
                continue
            
            parts = line.split('\t')
            if len(parts) != 3:
                print(f"警告：第{line_num}行格式不正确，已跳过: {line}", file=sys.stderr)
                continue
            
            word, code, freq = parts
            
            if freq == '0':
                continue
            
            replaced_code = replace_code_element(code)
            f_out.write(f"{word}\t{replaced_code}\n")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("用法: python convert_dazhu.py <输入文件> <输出文件>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"错误：输入文件不存在: {input_file}", file=sys.stderr)
        sys.exit(1)
    
    # convert_dazhu_table(input_file, output_file)
    convert_ceping_table(input_file, output_file)