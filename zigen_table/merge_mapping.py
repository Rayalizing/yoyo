#!/usr/bin/env python3
"""将 mapping-new.yaml 的信息合并到 mapping.yaml，保留旧格式"""

import yaml
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
OLD_YAML = SCRIPT_DIR / 'mapping.yaml'
NEW_YAML = SCRIPT_DIR / 'mapping-new.yaml'
BAK_YAML = SCRIPT_DIR / 'mapping.yaml.bak'

with open(OLD_YAML, 'r', encoding='utf-8') as f:
    old_data = yaml.safe_load(f)

with open(NEW_YAML, 'r', encoding='utf-8') as f:
    new_data = yaml.safe_load(f)

old_mapping = old_data.get('mapping', {})
old_grouping = old_data.get('grouping', {})
new_mapping = new_data.get('mapping', {})
new_grouping = new_data.get('grouping', {})

new_old_mapping = {}
for char, new_info in new_mapping.items():
    if char in old_mapping:
        old_info = old_mapping[char]
        if isinstance(new_info, dict):
            new_old_mapping[char] = new_info
        else:
            new_old_mapping[char] = {
                'code': new_info,
                'name': old_info.get('name', '')
            }
    else:
        if isinstance(new_info, dict):
            new_old_mapping[char] = new_info
        else:
            new_old_mapping[char] = {'code': new_info}

new_old_grouping = {}
for char, new_info in new_grouping.items():
    if char in old_grouping:
        old_info = old_grouping[char]
        if isinstance(new_info, dict):
            new_old_grouping[char] = new_info
        else:
            new_old_grouping[char] = {
                'is_sub_of': new_info,
                'name': old_info.get('name', '')
            }
    else:
        if isinstance(new_info, dict):
            new_old_grouping[char] = new_info
        else:
            new_old_grouping[char] = {'is_sub_of': new_info}

with open(BAK_YAML, 'w', encoding='utf-8') as f:
    yaml.dump(old_data, f, allow_unicode=True, sort_keys=False)

result = {
    'mapping': new_old_mapping,
    'grouping': new_old_grouping
}

with open(OLD_YAML, 'w', encoding='utf-8') as f:
    yaml.dump(result, f, allow_unicode=True, sort_keys=False, default_flow_style=False)

print(f"备份旧文件: {BAK_YAML}")
print(f"mapping: {len(new_old_mapping)} 条")
print(f"grouping: {len(new_old_grouping)} 条")
print(f"更新完成: {OLD_YAML}")
