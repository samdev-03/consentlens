# Scope, data handling, and limitations

ConsentLens is a hackathon research prototype. It supports a person's review; it does not replace a qualified translator, legal reviewer, or clinician. No real-world accuracy or benefit has been established.

## Language and rules

- A small English/Spanish vocabulary covers selected consent topics. Other languages and many paraphrases will not align.
- Pairing is many-to-one and sentence-level. Split/merged translations can produce duplicate or unmatched signals. Similar clauses can be confused.
- Negation checks do not parse grammatical scope. Exceptions and multiple subjects can create false alarms or missed changes.
- Quantity rules normalize limited number words/units. Currency symbols, dates, separators, references, and equivalent conversions need checking.
- The app does not verify the original document or determine required legal wording.
- Zero signals do not certify equivalence. Pairing coverage only measures automatic matches.

## Files

PDF extraction can change reading order. Inspect extracted text before comparison. OCR, scanned images, handwriting, and complex layouts are unsupported. Encrypted or malformed files may fail. Limits: 5 MB, 30 PDF pages, 40,000 characters and 300 clauses per document.

## Data flow

The browser downloads the app and optional PDF worker. Document text stays in React memory and passes through local parsing and rules. Notes stay in memory. Exports are local download blobs. This app does not send those texts to a server, analytics service, or model provider, or persist them in browser storage.

Hosting handles ordinary page/asset requests and operational metadata. Extensions, shared devices, downloads, and screenshots are outside these controls. Use fictional records for demonstrations.

## Reports and evaluation

Reports contain complete documents, exact spans, findings, decisions, notes, timestamps, engine version, and hashes. They are editable, not signed. SHA-256 does not verify a reviewer, consent validity, or authorship.

The 16 fixtures were authored during development. Passing shows compatibility with expected category sets, not measured accuracy, independent red teaming, or external expert validation. Additional tests cover bounds, determinism, and evidence offsets.
