## Inspiration

A consent form can preserve a person's choices in one version and quietly change them in a translation or plain-language explanation. “Optional” can become “required.” A retention period can grow. A right to withdraw can disappear. Fluent prose alone does not show whether those choices survived.

ConsentLens focuses on a concrete access-to-justice problem: making possible changes in consent language inspectable before an explanation is used.

## What it does

ConsentLens compares an English or Spanish consent document with its translation or explanation. It flags six kinds of review signals: missing information, negation changes, optional versus mandatory wording, quantities and timing, data sharing, and withdrawal rights.

Each signal shows the exact source and explanation passages. A reviewer confirms or dismisses it, adds a note, and exports printable HTML or structured JSON. Unmatched and uncertain passages stay visible. Editing a document marks old results stale and pauses export until a fresh comparison.

The app supports pasted text, TXT/Markdown files, and text-based PDFs. Extraction and screening run locally in the browser, with no account, document database, or model API key. Four fictional examples let judges try the complete workflow immediately.

## How it was built

The application uses TypeScript, React, a Vinext/Vite starter, shadcn/base UI components, Lucide icons, and PDF.js. A pure TypeScript engine preserves character offsets, pairs clauses using bilingual vocabulary and token overlap, then applies explicit rules. PDF.js runs locally; its worker is served from the same origin.

This is a deterministic review aid, not an LLM making legal conclusions. It can screen an AI-generated explanation without sending it to another model. Exports include the engine version and SHA-256 hashes of exact inputs. Hashes identify text; they do not prove authorship or make reports tamper-proof.

## Challenges

Cross-language matching can look more certain than it is. A changed sentence may be a harmless paraphrase, a segmentation problem, or a material change. ConsentLens exposes pairings, marks ambiguity, and does not treat unmatched text as proof of an omission.

Negation has scope: “may withdraw without penalty” contains a negative cue while preserving a right. The prototype documents that limitation and keeps signals subject to human review. It does not claim to solve general semantic equivalence.

## Accomplishments

- A complete comparison, evidence inspection, human review, and export workflow.
- A default English-to-Spanish example with four inspectable changes rather than an opaque score.
- Local document processing and no paid API dependency.
- Twenty-one passing engine checks, including exact evidence offsets and input boundaries.
- Sixteen runnable synthetic regression cases, including faithful controls and unfamiliar wording.

These are author-defined checks, not an independent benchmark, clinical validation, or an estimate of real-world accuracy.

## What was learned

The useful output is not a verdict that an explanation is safe. It is an evidence trail that lets a reviewer assess a specific change. Pairing coverage differs from translation accuracy, and a missing automatic match must remain a question rather than a conclusion.

## What's next

Independent bilingual reviewers would annotate unseen document pairs, adjudicate disagreements, and measure precision and recall by category. Further work would improve alignment and negation scope, add languages only after evaluation, and support reviewer corrections to pairings.

## AI assistance and originality

ChatGPT/Codex substantially assisted implementation, design, tests, documentation, and deployment. ConsentLens-specific code and assets were created for this hackathon; the framework starter and packages are credited in the repository. All examples are fictional. No runtime LLM is used. The prototype does not certify legal compliance, informed consent, or clinical safety.
