
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
