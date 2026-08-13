#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一键重建音形发布字典（yoyo-yx-char / yoyo-yx-word）。

必须的输入数据（缺任一则不应跑；路径相对仓库 ``rime/``）::

    scripts/编码生成和重码可视化/data/code.txt
        chai 导出：单字全码 / 简码（与 elements.txt 逐行对齐）
    scripts/编码生成和重码可视化/data/elements.txt
        chai 导出：单字拆分序列与读音权重（与 code.txt 逐行对齐）
    scripts/编码生成和重码可视化/data/pinyin.txt
        单字读音表（带调拼音 + 权重；与 code 多音行按出现顺序对齐）
    scripts/编码生成和重码可视化/data/base.dict.yaml.gz
        白霜基础词库（词 + 无调拼音 + 权重）
    scripts/编码生成和重码可视化/config.yaml
        多字词取码公式、简码配额

布局与 A 位不读额外数据文件，逻辑写在脚本里::

    scripts/声韵母按权重重排键位指法/remap_codes.py
        LOWER / UPPER 声韵母置换表
    scripts/声韵母按权重重排键位指法/assign_a_codes.py
        A_SLOTS（60 个 A 位槽位方案）
    scripts/声韵母按权重重排键位指法/dict_model.py
        码位分层、顺延 / 补位规则（含多音字二简约束）
    scripts/trim_word_dict.py
        发布词表裁剪（默认剔除权重 < 1 的词）

流水线：

1. ``编码生成和重码可视化/main.py``
   - 无调拼音匹配多音字；歧义按读音权重
   - 输出带 ``_/+``、``<>``、``!@`` 装饰的初始字典
   - 多音字整字最多一条二简
2. 复制到 ``rime/yoyo-yx-*.dict.yaml``
3. ``remap_codes`` → ``assign_a_codes`` → ``fill_vacant_codes``
4. ``trim_word_dict`` 剔除零权重长尾，得到发布词表

用法（在仓库根目录或任意目录均可）::

    python3 rime/scripts/rebuild_yx_dicts.py
    python3 rime/scripts/rebuild_yx_dicts.py --with-stats   # 额外生成重码报告

警告：会原地覆盖 ``rime/yoyo-yx-char.dict.yaml`` 与 ``rime/yoyo-yx-word.dict.yaml``。
``remap_codes`` 只能对「未置换」的初始字典跑一次；本脚本每次都从 main.py 重新生成，因此安全。
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import time
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
RIME_ROOT = SCRIPT_DIR.parent
ENCODE_DIR = SCRIPT_DIR / "编码生成和重码可视化"
REMAP_DIR = SCRIPT_DIR / "声韵母按权重重排键位指法"
OUTPUT_DIR = ENCODE_DIR / "output"
CHAR_OUT = OUTPUT_DIR / "char.dict.yaml"
WORD_OUT = OUTPUT_DIR / "word.dict.yaml"
CHAR_DST = RIME_ROOT / "yoyo-yx-char.dict.yaml"
WORD_DST = RIME_ROOT / "yoyo-yx-word.dict.yaml"
TRIM_SCRIPT = SCRIPT_DIR / "trim_word_dict.py"


def run(cmd: list[str], cwd: Path, title: str) -> None:
    print()
    print("=" * 70)
    print(title)
    print("=" * 70)
    print(f"$ {' '.join(cmd)}")
    print(f"  cwd: {cwd}")
    t0 = time.time()
    proc = subprocess.run(cmd, cwd=str(cwd))
    elapsed = time.time() - t0
    if proc.returncode != 0:
        raise SystemExit(f"失败（exit={proc.returncode}）: {title}")
    print(f"完成，用时 {elapsed:.1f}s")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="一键重建音形发布字典 yoyo-yx-char / yoyo-yx-word"
    )
    parser.add_argument(
        "--with-stats",
        action="store_true",
        help="运行 main.py 时生成重码统计（默认跳过，加快发布重建）",
    )
    parser.add_argument(
        "--python",
        default=sys.executable,
        help="Python 解释器（默认: 当前解释器）",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    py = args.python

    required = [
        ENCODE_DIR / "data" / "code.txt",
        ENCODE_DIR / "data" / "elements.txt",
        ENCODE_DIR / "data" / "pinyin.txt",
        ENCODE_DIR / "data" / "base.dict.yaml.gz",
        ENCODE_DIR / "config.yaml",
        ENCODE_DIR / "main.py",
        REMAP_DIR / "remap_codes.py",
        REMAP_DIR / "assign_a_codes.py",
        REMAP_DIR / "fill_vacant_codes.py",
        REMAP_DIR / "dict_model.py",
        TRIM_SCRIPT,
    ]
    missing = [str(p) for p in required if not p.is_file()]
    if missing:
        raise SystemExit("缺少必须的输入/脚本:\n  " + "\n  ".join(missing))

    t_all = time.time()

    main_cmd = [py, "main.py"]
    if not args.with_stats:
        main_cmd.append("--skip-stats")
    run(main_cmd, ENCODE_DIR, "【1/4】生成初始字词编码与字典")

    if not CHAR_OUT.is_file() or not WORD_OUT.is_file():
        raise SystemExit(f"main.py 未产出期望文件: {CHAR_OUT} / {WORD_OUT}")

    print()
    print("=" * 70)
    print("【2/4】覆盖 rime 发布字典（完整未裁剪词表）")
    print("=" * 70)
    shutil.copy2(CHAR_OUT, CHAR_DST)
    shutil.copy2(WORD_OUT, WORD_DST)
    print(f"  {CHAR_OUT.name} → {CHAR_DST}")
    print(f"  {WORD_OUT.name} → {WORD_DST}")

    run(
        [py, "remap_codes.py", "--dict", "all"],
        REMAP_DIR,
        "【3a/4】声韵母键位置换 remap_codes",
    )
    run([py, "assign_a_codes.py"], REMAP_DIR, "【3b/4】A 位就位 + 顺延 assign_a_codes")
    run(
        [py, "fill_vacant_codes.py", "--dict", "all"],
        REMAP_DIR,
        "【3c/4】非 A 槽补位 fill_vacant_codes",
    )

    trim_tmp = WORD_DST.with_suffix(".dict.yaml.trim")
    run(
        [py, str(TRIM_SCRIPT), str(WORD_DST), str(trim_tmp)],
        RIME_ROOT,
        "【4/4】裁剪零权重长尾 trim_word_dict",
    )
    trim_tmp.replace(WORD_DST)
    print(f"  已写回 {WORD_DST}")

    print()
    print("=" * 70)
    print(f"全部完成，总用时 {time.time() - t_all:.1f}s")
    print("=" * 70)
    print(f"  字表: {CHAR_DST}")
    print(f"  词表: {WORD_DST}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        raise SystemExit("已中断")
