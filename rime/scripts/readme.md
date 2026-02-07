# convert_to_dazhu.py 替换逻辑说明

## 概述

`convert_to_dazhu.py` 用于将原始码表转换为大竹码表格式，并按照特定规则替换编码中的特殊字符。

## 替换规则

### 优先级 1：整个编码只有两个字符

如果编码**整个**是 `-x` 或 `=x`（恰好两个字符），使用特殊的替换集：

| 原始格式 | 替换集 | 说明 |
|---------|--------|------|
| `-x` | `fourth_set` | 整个编码是两个字符的 `-字母` |
| `=x` | `fifth_set` | 整个编码是两个字符的 `=字母` |

**示例：**
- `-d` → `𝕕`
- `=e` → `𝐞`

### 优先级 2：圆括号处理

圆括号 `(..)` 直接删除括号，保留内部内容（内部内容不做任何替换）。

**示例：**
- `(aw)` → `aw`
- `(XB)(Af)` → `XBAf`

### 优先级 3：方括号处理

方括号 `[xy]` 用 `second_set` 替换其中的字符，按每两个字符一组进行处理。

**示例：**
- `[rr]` → `𝕣𝕣`
- `[fi]` → `𝕗𝚒`
- `[d.]` → `𝑑．`

### 优先级 4：混合情况（-x 和 =x）

如果 `-x` 或 `x` 不是整个编码（前面还有其他部分），则使用：

| 格式 | 替换集 |
|------|--------|
| `-x` | `first_set` |
| `=x` | `third_set` |

**示例：**
- `[d.]-O` → `𝑑．𝙾`（方括号用 `second_set`，`-O` 用 `first_set`）
- `[wC]=s` → `𝑤𝐂𝒔`（方括号用 `second_set`，`=s` 用 `third_set`）

## 替换集对应关系

| 替换集 | 包含内容 | 用途 |
|--------|----------|------|
| `first_set` | `monospace_set` + `symbol_1` | 普通 `-x` 替换 |
| `second_set` | `roman_set` + `symbol_2` | 方括号 `[xy]` 替换 |
| `third_set` | `bold_italic_set` + `symbol_3` | 普通 `=x` 替换 |
| `fourth_set` | `shuangxian` + `symbol_4` | 整个 `-x` 替换 |
| `fifth_set` | `bold_set` + `symbol_5` | 整个 `=x` 替换 |

## 使用方法

```bash
python convert_to_dazhu.py <输入文件> <输出文件>
```

**示例：**
```bash
python convert_to_dazhu.py for_dazhu.yaml yoyo-dazhu.txt
```

## 输入输出格式

**输入格式：**
```
词    编码    词频
```

**输出格式：**
```
编码    候选1    候选2    候选3    ...
```
