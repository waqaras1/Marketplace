#!/usr/bin/env python3
import os
import sys
import json
import glob
import re
import sqlite3
import select
from datetime import datetime

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOGS_DIR = os.path.join(WORKSPACE_DIR, ".agent-logs")
APP_DATA_DIR = os.path.expanduser("~/.gemini/antigravity-ide")
BRAIN_DIR = os.path.join(APP_DATA_DIR, "brain")
CONVERSATIONS_DIR = os.path.join(APP_DATA_DIR, "conversations")

AUTHOR = "waqaras1"
PROJECT = "naano-rebuild"
TOOL_NAME = "antigravity-ide"
DEFAULT_MODEL = "gemini-3.8-flash"

def clean_prompt(raw):
    if not raw:
        return ""
    m = re.search(r"<USER_REQUEST>\s*(.*?)\s*(?:</USER_REQUEST>|$)", raw, re.DOTALL)
    if m:
        return m.group(1).strip()
    return raw.strip()

def format_timestamp(ts):
    if not ts:
        return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    if ts.endswith("Z"):
        if "." not in ts:
            return ts[:-1] + ".000Z"
        return ts
    return ts

def get_session_filename(session_id, first_prompt_time):
    try:
        clean_ts = first_prompt_time.replace("Z", "").split(".")[0]
        dt = datetime.strptime(clean_ts, "%Y-%m-%dT%H:%M:%S")
        prefix = dt.strftime("%Y-%m-%d_%H-%M-%S")
    except Exception:
        prefix = datetime.utcnow().strftime("%Y-%m-%d_%H-%M-%S")
    return f"{prefix}_{session_id}.md"

def get_workspace_sessions():
    sessions = set()
    
    # 1. Check sqlite conversation databases
    if os.path.exists(CONVERSATIONS_DIR):
        for db_path in glob.glob(os.path.join(CONVERSATIONS_DIR, "*.db")):
            sess_id = os.path.splitext(os.path.basename(db_path))[0]
            try:
                conn = sqlite3.connect(db_path)
                c = conn.cursor()
                for row in c.execute("SELECT * FROM trajectory_metadata_blob"):
                    val = row[1]
                    if isinstance(val, bytes) and (b"naano-clone" in val or b"waqaras1/Marketplace" in val):
                        sessions.add(sess_id)
                        break
                conn.close()
            except Exception:
                pass

    # 2. Check brain directory transcripts for exact workspace path
    if os.path.exists(BRAIN_DIR):
        for s_dir in glob.glob(os.path.join(BRAIN_DIR, "*")):
            sess_id = os.path.basename(s_dir)
            if sess_id in sessions or not os.path.isdir(s_dir):
                continue
            transcript = os.path.join(s_dir, ".system_generated", "logs", "transcript_full.jsonl")
            if os.path.exists(transcript):
                try:
                    with open(transcript, "r", encoding="utf-8", errors="ignore") as f:
                        for _ in range(50):
                            line = f.readline()
                            if not line:
                                break
                            if WORKSPACE_DIR in line or "waqaras1/Marketplace" in line:
                                sessions.add(sess_id)
                                break
                except Exception:
                    pass

    return list(sessions)

def parse_transcript(transcript_path, session_id):
    if not os.path.exists(transcript_path):
        return []

    turns = []
    current_turn = None

    with open(transcript_path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            if not line.strip():
                continue
            try:
                d = json.loads(line)
            except Exception:
                continue

            step_type = d.get("type")
            source = d.get("source")

            if step_type == "USER_INPUT" and source == "USER_EXPLICIT":
                if current_turn:
                    turns.append(current_turn)
                current_turn = {
                    "num": len(turns) + 1,
                    "prompt": clean_prompt(d.get("content", "")),
                    "prompt_time": format_timestamp(d.get("created_at")),
                    "response": None,
                    "response_time": None,
                    "model": DEFAULT_MODEL,
                }
            elif step_type == "PLANNER_RESPONSE" and source == "MODEL" and current_turn:
                content = d.get("content")
                if content and content.strip():
                    current_turn["response"] = content.strip()
                    current_turn["response_time"] = format_timestamp(d.get("created_at"))

    if current_turn:
        turns.append(current_turn)

    return turns

def generate_session_markdown(session_id, turns):
    if not turns:
        return None

    first_prompt_time = turns[0]["prompt_time"]
    last_prompt_time = turns[-1]["prompt_time"]
    date_str = first_prompt_time.split("T")[0]
    short_id = session_id[:8]

    total_exchanges = len(turns)

    lines = [
        "---",
        f"session_id: {session_id}",
        f"date: {date_str}",
        f"author: {AUTHOR}",
        f"model: {DEFAULT_MODEL}",
        f"tool: {TOOL_NAME}",
        f"project: {PROJECT}",
        f"total_exchanges: {total_exchanges}",
        f"first_prompt_time: {first_prompt_time}",
        f"last_prompt_time: {last_prompt_time}",
        "---",
        "",
        f"# Session Log - {date_str}",
        "",
        f"Session: `{short_id}` | Project: `{PROJECT}` | Author: `{AUTHOR}`",
        "",
        "---",
    ]

    for turn in turns:
        lines.append("")
        lines.append(f"[LOG_ENTRY type=PROMPT num={turn['num']} session={short_id}]")
        lines.append(f"timestamp: {turn['prompt_time']}")
        lines.append(f"model: {turn['model']}")
        lines.append("")
        lines.append(turn["prompt"])
        lines.append("")
        if turn["response"]:
            lines.append("")
            lines.append(f"[LOG_ENTRY type=RESPONSE num={turn['num']} session={short_id}]")
            lines.append(f"timestamp: {turn['response_time'] or datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000Z')}")
            lines.append(f"model: {turn['model']}")
            lines.append("")
            lines.append(turn["response"])
            lines.append("")

    return "\n".join(lines) + "\n"

def sync_session(session_id):
    os.makedirs(LOGS_DIR, exist_ok=True)
    transcript_path = os.path.join(BRAIN_DIR, session_id, ".system_generated", "logs", "transcript_full.jsonl")
    if not os.path.exists(transcript_path):
        transcript_path = os.path.join(BRAIN_DIR, session_id, ".system_generated", "logs", "transcript.jsonl")

    turns = parse_transcript(transcript_path, session_id)
    if not turns:
        return None

    md_content = generate_session_markdown(session_id, turns)
    if not md_content:
        return None

    target_filename = None
    for existing in glob.glob(os.path.join(LOGS_DIR, f"*_{session_id}.md")):
        target_filename = existing
        break

    if not target_filename:
        filename = get_session_filename(session_id, turns[0]["prompt_time"])
        target_filename = os.path.join(LOGS_DIR, filename)

    existing_content = ""
    if os.path.exists(target_filename):
        with open(target_filename, "r", encoding="utf-8") as f:
            existing_content = f.read()

    if existing_content != md_content:
        with open(target_filename, "w", encoding="utf-8") as f:
            f.write(md_content)
        print(f"Captured session {session_id} -> {target_filename}")
        return target_filename
    return target_filename

def main():
    hook_stdin = ""
    if not sys.stdin.isatty():
        r, _, _ = select.select([sys.stdin], [], [], 0.05)
        if r:
            try:
                hook_stdin = sys.stdin.read()
            except Exception:
                pass

    specific_session = None
    if hook_stdin:
        try:
            hook_data = json.loads(hook_stdin)
            specific_session = hook_data.get("conversationId")
        except Exception:
            pass

    if specific_session:
        sync_session(specific_session)
    else:
        sessions = get_workspace_sessions()
        for sess in sessions:
            sync_session(sess)

    if hook_stdin:
        print(json.dumps({"decision": "allow"}))

if __name__ == "__main__":
    main()
