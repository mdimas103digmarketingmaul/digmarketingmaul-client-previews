#!/usr/bin/env python3
"""Bring Magnific results into the Try Me manifest.

  python3 -I try-on/tools/build_looks.py fetch results.json   # download + rename + rebuild looks.js
  python3 -I try-on/tools/build_looks.py index                # only rebuild looks.js from the files on disk

results.json is a list of {"name": "<Magnific node name>", "url": "<image url>"}, e.g.
  {"name": "AV · Sedang · Sawo / Nano Banana 2.1 / 1K", "url": "https://..."}
  {"name": "LK · Eyelet Pink × Mungil·Langsat / Nano Banana 2.1 / 1K", "url": "https://..."}
Run from /hariaku. Images are converted to progressive JPEG (max 1200px tall) with ffmpeg.
"""
import json, os, re, subprocess, sys, tempfile, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
AV_DIR = os.path.join(ROOT, 'img', 'avatars')
LK_DIR = os.path.join(ROOT, 'img', 'looks')
HIJAB = 'pashmina'  # pilot Lite

PRODUCTS = {  # node label → (product slug, colour id)
    'love button cream': ('love-button-cardigan', 'cream'),
    'eyelet pink': ('eyelet-cotton-shirt', 'pink'),
    'babydoll black': ('babydoll-evening', 'black'),
    'denim bordir': ('denim-soft-jeans-bordir', 'lightwash'),
    'velvet teal': ('velvet-bludru', 'teal'),
    'tunik champagne': ('tunik-bunga-maebae', 'champagne'),
}
BODIES = {'mungil', 'sedang', 'tinggi', 'berisi'}
SKINS = {'langsat', 'sawo', 'gelap'}


def parse(name):
    head = name.split('/')[0].strip()
    parts = [p.strip().lower() for p in re.split(r'[·×]', head) if p.strip()]
    if parts[0] == 'av' and len(parts) >= 3:
        body, skin = parts[1], parts[2]
        if body in BODIES and skin in SKINS:
            return ('av', None, None, body, skin)
    if parts[0] == 'lk' and len(parts) >= 4:
        prod = PRODUCTS.get(parts[1])
        body, skin = parts[2], parts[3]
        if prod and body in BODIES and skin in SKINS:
            return ('lk', prod[0], prod[1], body, skin)
    return None


def convert(src, dst):
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', src, '-vf', "scale=-2:'min(1200,ih)'", '-q:v', '3', dst], check=True)


def fetch(path):
    items = json.load(open(path))
    os.makedirs(AV_DIR, exist_ok=True)
    os.makedirs(LK_DIR, exist_ok=True)
    for it in items:
        p = parse(it['name'])
        if not p:
            print('skip (name not recognised):', it['name'])
            continue
        kind, prod, color, body, skin = p
        if kind == 'av':
            dst = os.path.join(AV_DIR, 'av_%s-%s-%s.jpg' % (body, skin, HIJAB))
        else:
            dst = os.path.join(LK_DIR, 'lk_%s-%s__%s-%s-%s.jpg' % (prod, color, body, skin, HIJAB))
        with tempfile.NamedTemporaryFile(suffix='.img', delete=False) as tmp:
            req = urllib.request.Request(it['url'], headers={'User-Agent': 'hariaku-preview-build'})
            tmp.write(urllib.request.urlopen(req, timeout=60).read())
        convert(tmp.name, dst)
        os.unlink(tmp.name)
        print('ok', os.path.relpath(dst, ROOT))
    index()


def index():
    av, lk = {}, {}
    for f in sorted(os.listdir(AV_DIR)) if os.path.isdir(AV_DIR) else []:
        m = re.match(r'av_(\w+)-(\w+)-(\w+)\.jpg$', f)
        if m:
            av['%s.%s.%s' % m.groups()] = 'img/avatars/' + f
    for f in sorted(os.listdir(LK_DIR)) if os.path.isdir(LK_DIR) else []:
        m = re.match(r'lk_(.+)-([a-z]+)__(\w+)-(\w+)-(\w+)\.jpg$', f)
        if m:
            prod, color, body, skin, hijab = m.groups()
            lk.setdefault('%s.%s' % (prod, color), {})['%s.%s.%s' % (body, skin, hijab)] = 'img/looks/' + f
    head = open(os.path.join(ROOT, 'data', 'looks.js')).read().split('window.HK_LOOKS')[0]
    body = 'window.HK_LOOKS = ' + json.dumps({'avatars': av, 'looks': lk}, indent=2) + ';\n'
    open(os.path.join(ROOT, 'data', 'looks.js'), 'w').write(head + body)
    print('looks.js: %d avatars, %d looks' % (len(av), sum(len(v) for v in lk.values())))


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'fetch':
        fetch(sys.argv[2])
    elif len(sys.argv) >= 2 and sys.argv[1] == 'index':
        index()
    else:
        print(__doc__)
