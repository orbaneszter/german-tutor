"""Check the exercise sets in app/data before they go into the app.

Usage:  python app/tools/check_sets.py
Exits with status 1 if any error is found; warnings don't fail the check.
"""
import json
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
TYPES = {"L", "T", "E", "O", "S", "M"}
LEVELS = {"B1", "B2", "C1", "C2"}
REQUIRED = ["id", "unit", "node", "type", "level", "prompt", "answers", "explain"]


def read_curriculum():
    text = (DATA / "curriculum.js").read_text(encoding="utf-8")
    files = re.findall(r'"(unit[\w]+\.js)"', re.search(r"BANK_FILES\s*=\s*\[(.*?)\]", text, re.S).group(1))
    unit_nodes = {}
    for uid, nodes in re.findall(r'\{ id: "(\w+)",[^}]*?nodes: \[([^\]]*)\]', text):
        unit_nodes[uid] = re.findall(r'"(\w+)"', nodes)
    return files, unit_nodes


def read_set(path):
    """A set file is GT.addSet( <strict JSON> ); with // comments before it."""
    text = path.read_text(encoding="utf-8")
    m = re.search(r"GT\.addSet\(\s*(\{.*\})\s*\);\s*$", text, re.S)
    if not m:
        raise ValueError("expected GT.addSet({...}); wrapping the JSON")
    return json.loads(m.group(1))


def norm(s):
    s = re.sub(r"\s+", " ", s.strip().lower())
    return re.sub(r"[.!?]+$", "", s)


def main():
    errors, warnings = [], []
    files, unit_nodes = read_curriculum()
    listed = set(files)
    on_disk = {p.name for p in DATA.glob("unit*.js")}
    for f in sorted(on_disk - listed):
        errors.append(f"{f}: file exists but is not listed in GT.BANK_FILES")
    for f in sorted(listed - on_disk):
        errors.append(f"{f}: listed in GT.BANK_FILES but missing")

    seen_ids, seen_prompts, total = {}, {}, 0
    for name in sorted(listed & on_disk):
        try:
            data = read_set(DATA / name)
        except (ValueError, json.JSONDecodeError) as e:
            errors.append(f"{name}: can't parse ({e})")
            continue
        unit = str(data.get("unit"))
        if unit not in unit_nodes:
            errors.append(f"{name}: unknown unit {unit}")
            continue
        for it in data.get("items", []):
            total += 1
            iid = it.get("id", "?")
            where = f"{name} {iid}"
            missing = [k for k in REQUIRED if k not in it]
            if missing:
                errors.append(f"{where}: missing {', '.join(missing)}")
                continue
            if iid in seen_ids:
                errors.append(f"{where}: duplicate id (also in {seen_ids[iid]})")
            seen_ids[iid] = name
            if not re.fullmatch(rf"u{unit.zfill(2)}-\d{{3}}", iid):
                warnings.append(f"{where}: id doesn't follow u{unit.zfill(2)}-NNN")
            if str(it["unit"]) != unit:
                errors.append(f"{where}: unit {it['unit']} doesn't match the file's unit {unit}")
            if it["node"] not in unit_nodes[unit]:
                errors.append(f"{where}: node {it['node']} doesn't belong to unit {unit} ({', '.join(unit_nodes[unit])})")
            t = it["type"]
            if t not in TYPES:
                errors.append(f"{where}: unknown type {t}")
            if it["level"] not in LEVELS:
                errors.append(f"{where}: unknown level {it['level']}")
            ans = it["answers"]
            if not isinstance(ans, list) or not ans or not all(isinstance(a, str) and a.strip() for a in ans):
                errors.append(f"{where}: answers must be a non-empty list of strings")
                continue
            if len({norm(a) for a in ans}) != len(ans):
                warnings.append(f"{where}: duplicate accepted answers")
            if not it["explain"].strip():
                errors.append(f"{where}: empty explanation")

            key = norm(it.get("instruction", "") + " " + it["prompt"] + " " + " ".join(it.get("words", [])))
            if key in seen_prompts:
                errors.append(f"{where}: same prompt as {seen_prompts[key]}")
            seen_prompts[key] = iid

            if t == "L":
                if it["prompt"].count("___") != 1:
                    errors.append(f"{where}: gap fill needs exactly one ___")
                gapless = it["prompt"].replace("___", " ")
                for a in ans:
                    if re.search(rf"(?<!\w){re.escape(a)}(?!\w)", gapless, re.I):
                        warnings.append(f"{where}: answer '{a}' appears in the prompt")
            if t == "M":
                opts = it.get("options", [])
                if len(opts) < 3:
                    errors.append(f"{where}: multiple choice needs 3+ options")
                if ans[0] not in opts:
                    errors.append(f"{where}: correct answer is not among the options")
                if len(set(opts)) != len(opts):
                    errors.append(f"{where}: duplicate options")
                if len(ans) != 1:
                    errors.append(f"{where}: multiple choice needs exactly one answer")
            if t == "O":
                words = it.get("words", [])
                if not words:
                    errors.append(f"{where}: word order needs words")
                built = norm((it.get("start", "") + " " + " ".join(words)))
                for a in ans:
                    def bag(s):
                        return sorted(re.sub(r"[^\w\s]", " ", s.lower()).split())
                    if bag(a) != bag(built):
                        errors.append(f"{where}: answer '{a}' doesn't use exactly start + words")
            if t == "E":
                if any(norm(a) == norm(it["prompt"]) for a in ans):
                    errors.append(f"{where}: an accepted answer equals the faulty sentence")
            if t in {"T", "S"}:
                if any(norm(a) == norm(it["prompt"]) for a in ans):
                    errors.append(f"{where}: an answer equals the prompt")

    for w in warnings:
        print("warning:", w)
    for e in errors:
        print("ERROR:  ", e)
    print(f"\n{total} items in {len(listed & on_disk)} files: {len(errors)} errors, {len(warnings)} warnings")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
