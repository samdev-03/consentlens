import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {auditDocuments,sha256} from '../lib/audit.ts';
import {makeReport,reportHtml} from '../lib/report.ts';

test('report hashes match independent Node SHA-256 for Unicode input',async()=>{
  const text='Puede retirar su consentimiento.\nInformación clínica: 30 días.';
  assert.equal(await sha256(text),createHash('sha256').update(text).digest('hex'));
});
test('HTML export escapes untrusted document text and reviewer notes',async()=>{
  const source='Participation is optional. <img src=x onerror=alert(1)>',target='Participation is mandatory.';
  const audit=auditDocuments(source,target);
  const report=await makeReport(audit,{F1:{decision:'confirmed',note:'<script>alert("x")</script>'}});
  const html=reportHtml(report);
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('confirmed'));
});
test('JSON export preserves complete documents, exact spans, and decisions',async()=>{
  const audit=auditDocuments('Participation is optional.','Participation is mandatory.');
  const report=JSON.parse(JSON.stringify(await makeReport(audit,{F1:{decision:'dismissed',note:'Context checked.'}})));
  assert.equal(report.audit.sourceText,'Participation is optional.');
  assert.equal(report.review.F1.decision,'dismissed');
  for(const finding of report.audit.findings){
    if(finding.source)assert.equal(report.audit.sourceText.slice(finding.source.start,finding.source.end),finding.source.text);
  }
  assert.match(report.sourceSha256,/^[0-9a-f]{64}$/);
});
