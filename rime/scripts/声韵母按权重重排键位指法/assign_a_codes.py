#!/usr/bin/env python3
"""按 A 位方案安排一简两码位，被挤出者按码长顺延。

A 位共 15 个二字母码（qA…bA）× 4 条输入路径（`_` `+` `<` `>`）= 60 个槽位。
每个槽位放什么完全由下面的 A_SLOTS 手工指定，字或词皆可：条目该走哪套顺延
分层、该写进哪个 dict 文件，由文本长度自动决定（见 dict_model.codec_for），
与它占用哪个前缀无关。两个 dict 文件同属一部词典，故本脚本必须同时读写两者。

A_SLOTS 是 A 位的完整真相：未写出的前缀视为该槽留空，原占用者顺延下去。

用法:
  python3 assign_a_codes.py
"""

from __future__ import annotations

from typing import Dict

from dict_model import (
    CODECS,
    KEY_ORDER,
    PREFIXES,
    Codec,
    Entry,
    Store,
    codec_for,
    codes_at,
    demote,
    load,
    place_short,
    save,
)

# A 位方案：{二字母码: {前缀: 文本}}
#   `_` 左手不带空格   `+` 右手不带空格   `<` 左手带空格   `>` 右手带空格
# 省略某前缀＝该槽留空。同一文本不得占用两个槽位。
A_SLOTS: dict[str, dict[str, str]] = {
    "qA": {"_": "吃", "+": "没有", "<": "每天", ">": "模型"},
    "wA": {"_": "我", "+": "我们", "<": "问题", ">": "味道"},
    "eA": {"_": "是", "+": "上", "<": "使用", ">": "什么"},
    "rA": {"_": "不", "+": "被", "<": "比较", ">": "不错"},
    "tA": {"_": "小", "+": "下", "<": "需要", ">": "学习"},
    "aA": {"_": "中", "+": "你", "<": "这个", ">": "知道"},
    "sA": {"_": "和", "+": "很", "<": "还是", ">": "很多"},
    "dA": {"_": "的", "+": "人", "<": "但是", ">": "都是"},
    "fA": {"_": "有", "+": "一", "<": "一个", ">": "因为"},
    "gA": {"_": "在", "+": "去", "<": "自己", ">": "其他"},
    "zA": {"_": "他", "+": "她", "<": "他们", ">": "通过"},
    "xA": {"_": "更", "+": "个", "<": "公司", ">": "感觉"},
    "cA": {"_": "了", "+": "来", "<": "里面", ">": "了解"},
    "vA": {"_": "就", "+": "可以", "<": "进行", ">": "技术"},
    "bA": {"_": "而", "+": "所以", "<": "而且", ">": "安全"},
}

World = Dict[Codec, Store]


def check_plan() -> None:
    unknown = sorted(set(A_SLOTS) - {f"{k}A" for k in KEY_ORDER})
    if unknown:
        raise SystemExit(f"A_SLOTS 含非 A 指法的码位: {unknown}")
    seen: dict[str, str] = {}
    for code, row in A_SLOTS.items():
        for prefix, text in row.items():
            if prefix not in PREFIXES:
                raise SystemExit(f"{code} 出现未知前缀 {prefix!r}")
            if not text:
                continue
            if text in seen:
                raise SystemExit(f"{text!r} 同时排在 {seen[text]} 和 {prefix}{code}")
            seen[text] = f"{prefix}{code}"


def occupants(world: World, code: str) -> list[tuple[Codec, Entry]]:
    """跨两个文件查该两码位上的活条目。"""
    return [(codec, e) for codec, store in world.items() for e in store.live_by_code(code)]


def evict(world: World, code: str, keeper: tuple[Codec, str] | None) -> int:
    """清走该两码位上不属于方案的条目，返回清走数。"""
    cleared = 0
    for codec, entry in occupants(world, code):
        if keeper is not None and (codec, entry.text) == keeper:
            continue
        store = world[codec]
        shorts = codes_at(store, codec, entry.text, codec.levels[0])
        if len(shorts) > 1 or not codes_at(store, codec, entry.text, codec.full_level):
            # 还留着别的一简，或本文件里没有它的全码（本体在另一文件）：直接撤这一行。
            store.kill(entry)
        else:
            demote(store, codec, entry.text, codec.levels[0])
        cleared += 1
    return cleared


def apply_plan(world: World) -> int:
    """先腾空全部 A 槽，再逐一落位——避免落位时误伤仍待安排的条目。"""
    cleared = 0
    for code, row in A_SLOTS.items():
        for prefix in PREFIXES:
            text = row.get(prefix, "")
            keeper = (codec_for(text), text) if text else None
            cleared += evict(world, f"{prefix}{code}", keeper)

    for code, row in A_SLOTS.items():
        for prefix, text in row.items():
            if text:
                codec = codec_for(text)
                place_short(world[codec], codec, text, code, prefix)
    return cleared


def verify(world: World) -> None:
    for code, row in A_SLOTS.items():
        for prefix in PREFIXES:
            slot = f"{prefix}{code}"
            want = row.get(prefix, "")
            got = occupants(world, slot)
            if not want:
                if got:
                    raise SystemExit(f"{slot} 应留空，实为 {[e.text for _, e in got]}")
                continue
            if len(got) != 1:
                raise SystemExit(f"{slot} 应唯一占用 {want!r}，实为 {[e.text for _, e in got]}")
            codec, entry = got[0]
            if entry.text != want or codec is not codec_for(want):
                raise SystemExit(f"{slot} 占用不符: {codec.name}表 {entry.text!r}，期望 {want!r}")


def main() -> None:
    check_plan()
    world: World = {codec: load(codec) for codec in CODECS.values()}
    cleared = apply_plan(world)
    verify(world)

    totals = {codec.name: save(codec, store) for codec, store in world.items()}
    print(f"A 位就位（顺延/撤除 {cleared} 条；" + "，".join(
        f"{name}表 {n} 条目" for name, n in totals.items()) + "）")
    for code, row in A_SLOTS.items():
        shown = " ".join(f"{p}{row[p]}" for p in PREFIXES if row.get(p))
        print(f"  {code}: {shown}")


if __name__ == "__main__":
    main()
