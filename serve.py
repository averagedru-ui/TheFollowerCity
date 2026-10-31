# Dev server: static files (no caching) plus a tiny shared-world store so several browsers see the same plots.
#   GET  /api/state/<seed>                  -> {"version": n, "state": {...}}
#   POST /api/state/<seed> {baseVersion, state} -> 200 {"ok": true, version, state} | 409 {"ok": false, version, state}
# The client re-applies its change on top of the latest state after a 409, so one writer can't clobber another.
import json
import os
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
LOCK = threading.Lock()
EMPTY = {'plots': [], 'roads': [], 'nextId': 1}


def path_for(seed):
    return os.path.join(DATA, f'world-{seed}.json')


def load(seed):
    try:
        with open(path_for(seed), encoding='utf8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return {'version': 0, 'state': dict(EMPTY)}


def save(seed, doc):
    os.makedirs(DATA, exist_ok=True)
    tmp = path_for(seed) + '.tmp'
    with open(tmp, 'w', encoding='utf8') as f:
        json.dump(doc, f)
    os.replace(tmp, path_for(seed))


class H(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def reply(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def seed(self):
        m = re.fullmatch(r'/api/state/(\d{1,9})', self.path.split('?')[0])
        return m.group(1) if m else None

    def do_GET(self):
        seed = self.seed()
        if seed is None:
            return super().do_GET()
        with LOCK:
            self.reply(200, load(seed))

    def do_POST(self):
        seed = self.seed()
        if seed is None:
            return self.reply(404, {'ok': False})
        try:
            n = int(self.headers.get('Content-Length', 0))
            req = json.loads(self.rfile.read(n))
            state, base = req['state'], int(req['baseVersion'])
            assert isinstance(state.get('plots'), list) and isinstance(state.get('roads'), list)
        except (ValueError, KeyError, AssertionError, TypeError):
            return self.reply(400, {'ok': False})
        with LOCK:
            cur = load(seed)
            if base != cur['version']:
                return self.reply(409, {'ok': False, **cur})
            doc = {'version': cur['version'] + 1, 'state': state}
            save(seed, doc)
            self.reply(200, {'ok': True, **doc})

    def log_message(self, fmt, *args):
        if '/api/' not in (args[0] if args else ''):
            super().log_message(fmt, *args)


ThreadingHTTPServer(('', 5173), H).serve_forever()
