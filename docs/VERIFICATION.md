# Verification record

Verification on 2026-09-27 against the implementation in this repository.

| Check | Result |
| --- | --- |
| Automated tests | 24/24 passed: 21 engine checks plus 3 report/hash checks |
| TypeScript strict check | Passed |
| In-app synthetic evaluation | 16/16 expected category sets matched |
| Default EN → ES comparison | Four high-priority signals; exact evidence displayed |
| Human review | Note entry and confirm toggle worked; decision count updated |

These are not independent accuracy evidence. Desktop Chromium was used for interactive verification. Mobile-specific browser testing, real patient documents, and clinical/legal validation have not been performed.

| Production build | Passed; Cloudflare Workers-compatible archive generated |
| Public deployment | Succeeded on 2026-09-27 |
| JSON download | Downloaded file parsed; exact input hash and review note/decision verified |
| Report preview | HTML rendered in sandboxed preview; download/print links offered |
| Export escaping | Script/HTML-like document text and notes escaped in report tests |
| PDF upload | Fictional four-clause text PDF extracted locally and displayed correctly |
| Stale results | Changing input via upload disabled export until rerun |
| WebMCP | Feature-detected registration implemented; preview browser exposed no tools, so invocation validation was unavailable |


The browser automation download event did not acknowledge local blob downloads, although the JSON file was saved. The app provides an embedded report preview and explicit download/print links so reviewers can read the result even if the browser blocks a download. No independent translation-quality benchmark was performed.
