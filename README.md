# Study Buddy 📚 (Python / Flask rebuild)

A Claude-powered homework tutor for kids aged 8–14 that teaches children
how to think through problems — without ever just giving them the answer.

This is the Python/Flask rebuild of [Study Buddy](https://github.com/swethalvr-ai/kids-study-buddy),
originally built in Node.js. The system prompt is validated and identical
between both versions — this rebuild exists to practice a second stack and
to prep for a real-world family pilot.

Built by a former QA/software test engineer (10 years, Intuit & eBay)
transitioning into AI.

## Why I built this

As a mom of two boys, I wanted a homework helper that made my kids
smarter — not one that did their homework for them. Most AI tools just
give answers. Study Buddy uses the Socratic method: it asks guiding
questions, gives hints, and celebrates effort — only confirming answers
after the child has genuinely tried.

This project is also my portfolio piece for transitioning from software test
engineering into AI prompt engineering and evaluation design. My background
designing test frameworks, catching edge cases, and documenting failure
modes maps directly onto prompt engineering and AI evaluation.

## How it works

Study Buddy is built on three core design principles:

**1. Socratic teaching — never give the answer**
The system prompt instructs Claude to always ask what the child has
already tried before offering any help. It guides with hints and
simpler related questions rather than solutions.

**2. Conversation memory**
Every message in the session is passed to Claude as full conversation
history. This means Study Buddy remembers context — if a child says
"I tried 48" it knows what problem they were working on.

**3. Safety first**
The prompt explicitly handles distress signals, off-topic requests,
and attempts to get Claude to write assignments. Study Buddy redirects
to trusted adults when needed and stays firmly in the homework helper lane.

## Tech stack

- **Runtime:** Python 3 / Flask
- **AI:** Anthropic Claude API (claude-opus-5)
- **Frontend:** Vanilla HTML + CSS + JavaScript
- **Environment:** python-dotenv for API key management

## How to run it locally

**Prerequisites:** Python 3 installed, Anthropic API key

**1. Clone the repo**
```bash
git clone https://github.com/swethalvr-ai/study-buddy-v3-python.git
cd study-buddy-v3-python
```

**2. Set up a virtual environment and install dependencies**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**3. Add your API key**
Create a `.env` file in the root:
```
ANTHROPIC_API_KEY=your-key-here
```

**4. Start the server**
```bash
python app.py
```

**5. Open in browser**
Go to `http://localhost:5001`
(port 5001, not 5000 — macOS AirPlay Receiver often holds 5000)

## Prompt Engineering & Evaluation

This project goes beyond building a chatbot — it applies systematic
quality engineering principles to AI prompt design.

**Prompt versioning**
The system prompt has gone through multiple documented versions, each
driven by observed failures. Every change is logged with: what changed,
why, and what it fixed. Full history lives in the
[Node.js repo](https://github.com/swethalvr-ai/kids-study-buddy)
(`docs/CHANGELOG.md`, `docs/REGRESSIONS.md`, `docs/SYSTEM_PROMPT_v2.md`).
This Python rebuild uses that same validated v2 prompt verbatim.

**60-case eval suite — complete**
A 60-case evaluation suite spans six categories: Subject Help, Off-Topic
Handling, Jailbreak Resistance, Advanced Concepts & Sensitive Topics, Edge
Cases, and Emotional Distress & Safety. Each case has defined pass/fail
criteria, graded against actual model output — not assumed behavior.

- **v1 baseline (Node.js):** 29/60 (48%) pass rate
- **v2 (Node.js), post-fix:** 30/31 originally-failing cases confirmed
  fixed across two validation rounds; 2 regressions introduced by the
  rewrite itself caught and fixed
- **v3 (this repo, Python):** full 60-case parity validation complete —
  38 PASS / 9 PARTIAL FAIL / 0 FAIL on the 47 cases re-run against this
  codebase (13 more confirmed via smoke test), no regressions introduced
  by the port. Full case-by-case results and grading notes in
  `EVAL_V3_RESULTS.md`.

**Real bugs found along the way**
- A markdown bold-rendering gap in the Python rebuild's frontend also
  surfaced a more important XSS gap — user-submitted text now gets
  escaped before markdown formatting is applied, so raw HTML in a
  message can't execute.
- The eval suite caught a blank-input crash (`/chat` returned an
  unhandled HTTP 500 on empty or whitespace-only submissions). Fixed
  with server-side validation and graceful error handling on both the
  Flask route and the frontend fetch handler.

**Why this matters**
My background in software test engineering — designing test frameworks,
catching edge cases, documenting failure modes — maps directly onto
prompt evaluation. This project is my proof of concept.

## What's next

- Real-world pilot: 3–5 families, 2-week opt-in trial
- Hosting/deployment so families don't need to run anything locally
- Per-family unique links (no accounts/passwords needed at this scale)
- Server-side session logging tied to family ID, with a private review page
- v3+ agentic architecture: Safety Classifier → Router → Tutor, as a
  workflow (not a fully autonomous agent) — informed by Anthropic's
  "Building Effective Agents" guardrails-via-parallelization pattern
