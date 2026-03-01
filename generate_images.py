#!/usr/bin/env python3
import os, json, base64, subprocess, time, urllib.request, urllib.error

# Load env
env = {}
with open("/Users/lifenjoy51/works/flash-card/.env") as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k] = v

API_KEY = env["GOOGLE_API_KEY"]
IMG_DIR = "/Users/lifenjoy51/works/flash-card/public/images"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={API_KEY}"

WORDS = {
    "컵": "cup",
    "신발": "shoes",
    "자동차": "car",
    "개": "dog",
    "고양이": "cat",
    "귀": "ear",
    "그릇": "bowl",
    "기저귀": "diaper",
    "꽃": "flower",
    "나무": "tree",
    "나뭇잎": "leaf",
    "눈": "eye",
    "달": "moon",
    "마우스": "mouse",
    "발": "foot",
    "버스": "bus",
    "변기": "toilet",
    "별": "star",
    "새": "bird",
    "색연필": "colored_pencil",
    "손": "hand",
    "손톱깎이": "nail_clipper",
    "슬리퍼": "slippers",
    "오리": "duck",
    "오토바이": "motorcycle",
    "요거트": "yogurt",
    "유모차": "stroller",
    "입": "mouth",
    "자전거": "bicycle",
    "전자렌지": "microwave",
    "책": "book",
    "치약": "toothpaste",
    "칫솔": "toothbrush",
    "코": "nose",
    "키보드": "keyboard",
    "키위": "kiwi",
    "토마토": "tomato",
    "팬더": "panda",
    "해": "sun",
    "호랑이": "tiger",
}

success = 0
fail = 0
failed_words = []

for korean, english in WORDS.items():
    outfile = os.path.join(IMG_DIR, f"{english}.jpg")
    if os.path.exists(outfile):
        print(f"SKIP: {korean} ({english}.jpg already exists)")
        continue

    print(f"GENERATING: {korean} → {english}...", flush=True)

    prompt = (
        f"Role: You are an expert illustrator creating educational materials for toddlers (around 20 months old). "
        f"Your goal is to create a clear, simple, and engaging illustration of '{korean}' ({english}) for a flashcard.\n\n"
        f"Instructions:\n"
        f"1. Draw the complete, entire '{korean}' ({english}) as it would commonly appear in Seoul, South Korea in the current year. Use a familiar, everyday Korean appearance for the object.\n"
        f"   Draw it from its most recognizable angle (canonical view).\n"
        f"2. Background: Place the object on a solid, clean white background (#FFFFFF). No shadows or floor textures.\n"
        f"3. Style (Toddler-Friendly Vector):\n"
        f"   - Outlines: Use bold, thick, smooth black outlines to define the shape clearly.\n"
        f"   - Shapes: Simplify complex geometry into basic, rounded shapes. Avoid sharp corners if possible.\n"
        f"   - Colors: Use solid, simple flat colors based on the object's actual, realistic color. Use only 1-3 colors per object. No rainbow or multicolor schemes. No gradients, complex textures, or realistic shading.\n"
        f"   - Perspective: Isometric style with a 3/4 angle view and slight 3D depth.\n"
        f"4. No text or labels in the image. The object should be centered and fill most of the frame.\n\n"
        f"Goal: The final image should be an instantly recognizable, clean, and simple icon of the entire '{korean}' ({english}) "
        f"that a 20-month-old baby can easily identify."
    )

    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
    }).encode("utf-8")

    req = urllib.request.Request(API_URL, data=payload, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())

        img_data = None
        for part in data["candidates"][0]["content"]["parts"]:
            if "inlineData" in part:
                img_data = part["inlineData"]["data"]
                break

        if not img_data:
            print(f"  FAILED: no image in response for {korean}")
            fail += 1
            failed_words.append(korean)
            continue

        # Save as PNG, then convert
        tmpfile = os.path.join(IMG_DIR, f"{english}.png")
        with open(tmpfile, "wb") as f:
            f.write(base64.b64decode(img_data))

        # Post-process: resize to 512px max, convert to JPG
        subprocess.run(["sips", "-Z", "512", tmpfile], capture_output=True)
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "80", tmpfile, "--out", outfile], capture_output=True)
        os.remove(tmpfile)

        if os.path.exists(outfile):
            size_kb = os.path.getsize(outfile) // 1024
            print(f"  OK: {english}.jpg ({size_kb}KB)")
            success += 1
        else:
            print(f"  FAILED: conversion error for {korean}")
            fail += 1
            failed_words.append(korean)

    except Exception as e:
        print(f"  FAILED: {korean} - {e}")
        fail += 1
        failed_words.append(korean)

    time.sleep(2)

print(f"\n=== DONE: {success} success, {fail} failed ===")
if failed_words:
    print(f"Failed: {', '.join(failed_words)}")
