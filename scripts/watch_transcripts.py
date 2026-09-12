#!/usr/bin/env python3
import os
import sys
import time
import glob
import subprocess

WORKSPACE_DIR = "/Users/macbook/Downloads/Docs/naano-clone"
CAPTURE_SCRIPT = os.path.join(WORKSPACE_DIR, "scripts", "capture.py")
BRAIN_DIR = os.path.expanduser("~/.gemini/antigravity-ide/brain")
CONVERSATIONS_DIR = os.path.expanduser("~/.gemini/antigravity-ide/conversations")

def get_mod_times():
    mtimes = {}
    if os.path.exists(BRAIN_DIR):
        for path in glob.glob(os.path.join(BRAIN_DIR, "*", ".system_generated", "logs", "*.jsonl")):
            try:
                mtimes[path] = os.path.getmtime(path)
            except OSError:
                pass
    if os.path.exists(CONVERSATIONS_DIR):
        for path in glob.glob(os.path.join(CONVERSATIONS_DIR, "*.db*")):
            try:
                mtimes[path] = os.path.getmtime(path)
            except OSError:
                pass
    return mtimes

def main():
    last_mtimes = {}
    # Run once at startup
    try:
        subprocess.run([sys.executable, CAPTURE_SCRIPT], check=False)
    except Exception as e:
        print(f"Initial capture error: {e}", file=sys.stderr)

    while True:
        try:
            time.sleep(1.5)
            current_mtimes = get_mod_times()
            changed = False
            for path, mtime in current_mtimes.items():
                if path not in last_mtimes or mtime > last_mtimes[path]:
                    changed = True
                    break
            
            if changed:
                last_mtimes = current_mtimes
                subprocess.run([sys.executable, CAPTURE_SCRIPT], check=False)
        except Exception as e:
            time.sleep(2)

if __name__ == "__main__":
    main()
