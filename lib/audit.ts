/** ConsentLens v1: bounded, deterministic English/Spanish review heuristics.
 * No LLM, network request, legal opinion or claim of semantic equivalence.
 * Source spans always index the original, unnormalized input.
 */
import {sha256 as hashBytes} from '@noble/hashes/sha2.js';
export const ENGINE_VERSION = '1.0.0';
export const MAX_TEXT = 40000;
export type Category = 'omission'|'negation'|'obligation'|'numbers'|'sharing'|'withdrawal';
export type Severity = 'high'|'medium'|'review';
export type Decision = 'unreviewed'|'confirmed'|'dismissed';
export type Clause = {id:string;text:string;start:number;end:number;concepts:string[];tokens:string[]};
export type Finding = {id:string;category:Category;severity:Severity;title:string;reason:string;source:Clause|null;target:Clause|null;signal:string;suggestion:string};
export type Pair = {source:Clause;target:Clause|null;score:number;ambiguous:boolean};
export type Audit = {version:string;sourceText:string;targetText:string;sourceClauses:Clause[];targetClauses:Clause[];pairs:Pair[];findings:Finding[];coverage:number;unrecognized:number;warnings:string[]};
export const CATEGORY_LABELS:Record<Category,string>={omission:'Missing information',negation:'Reversed meaning',obligation:'Changed choice',numbers:'Numbers & timing',sharing:'Data sharing',withdrawal:'Withdrawal rights'};

export function normalize(s:string){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘]/g,"'").replace(/\b(can't|cannot)\b/g,'can not').replace(/\b(won't)\b/g,'will not').replace(/n't\b/g,' not').replace(/\s+/g,' ').trim();}
const CONCEPTS:Record<string,RegExp>={
  withdrawal:/\b(withdraw\w*|revoke\w*|retir\w*|revoc\w*|stop participating|leave the study|abandon\w*)\b/,
  sharing:/\b(shar\w*|disclos\w*|compart\w*|divulg\w*|vender|vendemos|sell|sold|third.part\w*|terceros)\b/,
  retention:/\b(retain\w*|stor\w*|keep|kept|conserv\w*|almacen\w*|guard\w*|reten\w*|retention)\b/,
  participation:/\b(particip\w*|voluntar\w*|take part|taking part|join the study|optional|opcional|obligatori\w*|mandatory)\b/,
  risk:/\b(risk\w*|riesgo\w*|side effect\w*|efectos secundarios|bleed\w*|sangr\w*|dolor|pain|nause\w*|infection\w*|infecci\w*)\b/,
  benefit:/\b(benefit\w*|benefici\w*|guarantee\w*|garant\w*|cur[ae]\w*)\b/,
  contact:/\b(contact\w*|pregunt\w*|question\w*|call|llam\w*|email|correo|telefono)\b/,
  payment:/\b(pay\w*|paid|cost\w*|pag\w*|costo\w*|compensation|compensaci\w*|fee\w*)\b/,
  treatment:/\b(treat\w*|tratam\w*|care|atencion|terapia|therapy)\b/,
  alternatives:/\b(alternativ\w*|other options|otras opciones)\b/,
};
const WORDS:Record<string,string>={datos:'data',informacion:'information',salud:'health',sanitarios:'health',personales:'personal',medicos:'medical',clinica:'clinic',clinico:'clinical',clinicos:'clinical',investigacion:'research',estudio:'study',tratamiento:'treatment',atencion:'care',riesgos:'risk',riesgo:'risk',risks:'risk',beneficios:'benefit',beneficio:'benefit',benefits:'benefit',consentimiento:'consent',retirar:'withdraw',revocar:'withdraw',retirarse:'withdraw',withdrawal:'withdraw',withdraw:'withdraw',compartir:'share',compartimos:'share',compartira:'share',sharing:'share',shared:'share',share:'share',disclose:'share',conservar:'retain',conservamos:'retain',conservaremos:'retain',conservaran:'retain',almacenaremos:'retain',guardaremos:'retain',stored:'retain',store:'retain',retained:'retain',retain:'retain',keep:'retain',opcional:'optional',voluntario:'optional',voluntaria:'optional',voluntary:'optional',obligatorio:'mandatory',obligatoria:'mandatory',required:'mandatory',publicidad:'advertising',advertisers:'advertising',anunciantes:'advertising',terceros:'third',third:'third',dolor:'pain',sangrado:'bleeding',participar:'participate',participacion:'participate',participating:'participate',participation:'participate',preguntas:'questions',contactar:'contact',contacte:'contact',investigadores:'researchers',fuera:'outside',externos:'outside',servicios:'services',servicio:'service',recibir:'receive',recibira:'receive',puede:'may',podra:'may',cualquier:'any',momento:'time',garantizamos:'guarantee',garantizado:'guarantee',guaranteed:'guarantee',debe:'must',debera:'must',deben:'must',deberan:'must',ningun:'no',ninguna:'no',nunca:'never',sin:'without'};
const STOP=new Set('the a an of to in for your you we our is are will be can may any with and or at as this that it do not no never without el la los las un una de del al a en para su sus usted nosotros nuestro nuestra es son ser sera se le lo y o con por que si los las esta este estas estos tienen tiene have has'.split(' '));
function tokens(s:string){return [...new Set(normalize(s).match(/[a-z0-9]+/g)?.map(w=>WORDS[w]||w).filter(w=>w.length>1&&!STOP.has(w))||[])];}
export function splitClauses(text:string,prefix:string):Clause[]{
  const result:Clause[]=[];
  // Preserve decimal points. Newlines and semicolons also delimit review units.
  const pattern=/[^.!?;\n]+(?:\.(?=\d)[^.!?;\n]+)*(?:[.!?;]+|$)/g;
  for(const m of text.matchAll(pattern)){
    const raw=m[0],trimmed=raw.trim();if(!trimmed)continue;
    const start=m.index!+raw.indexOf(trimmed),n=normalize(trimmed);
    result.push({id:`${prefix}${result.length+1}`,text:trimmed,start,end:start+trimmed.length,concepts:Object.entries(CONCEPTS).filter(([,re])=>re.test(n)).map(([k])=>k),tokens:tokens(trimmed)});
  }
  return result;
}
function overlap(a:string[],b:string[]){return a.filter(x=>b.includes(x)).length;}
function alignment(a:Clause,b:Clause){
  if(normalize(a.text)===normalize(b.text))return 1;
  const shared=overlap(a.concepts,b.concepts),terms=overlap(a.tokens,b.tokens);
  const conceptScore=shared/Math.max(a.concepts.length,b.concepts.length,1);
  const tokenScore=terms/Math.max(a.tokens.length,b.tokens.length,1);
  return .65*conceptScore+.35*tokenScore;
}
function negative(s:string){return /\b(not|no|never|without|neither|ningun\w*|nunca|sin|cannot)\b/.test(normalize(s));}
function optional(s:string){const n=normalize(s);return /\b(optional|opcional|voluntar\w*|your choice|su eleccion|not (?:required|mandatory)|no (?:es |sera )?(?:obligatori\w*|necesario))\b/.test(n);}
function mandatory(s:string){const n=normalize(s);return !optional(n)&&/\b(must|required|mandatory|obligatori\w*|debe\w*)\b/.test(n);}
function permission(s:string){const n=normalize(s);return /\b(may|can|allowed|puede\w*|podra\w*|permit\w*)\b/.test(n)&&!negative(n);}
function quantities(s:string){
  const numbers:Record<string,string>={one:'1',two:'2',three:'3',four:'4',five:'5',six:'6',seven:'7',eight:'8',nine:'9',ten:'10',thirty:'30',uno:'1',una:'1',dos:'2',tres:'3',cuatro:'4',cinco:'5',seis:'6',siete:'7',ocho:'8',nueve:'9',diez:'10',treinta:'30'};
  const units:Record<string,string>={days:'day',day:'day',dias:'day',dia:'day',weeks:'week',week:'week',semanas:'week',semana:'week',months:'month',month:'month',meses:'month',mes:'month',years:'year',year:'year',anos:'year',ano:'year',hours:'hour',hour:'hour',horas:'hour',hora:'hour',minutes:'minute',minutos:'minute',minute:'minute',minuto:'minute','%':'%',percent:'%',porcentaje:'%',dollars:'USD',dolares:'USD',usd:'USD',soles:'PEN',pen:'PEN'};
  let n=normalize(s).replace(/(\d),(\d)/g,'$1.$2').replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|thirty|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|treinta)\b/g,w=>numbers[w]);
  n=n.replace(/(\d+(?:\.\d+)?)\s*por ciento/g,'$1%');
  return [...n.matchAll(/(\d+(?:\.\d+)?)\s*(%|percent\b|days?\b|dias?\b|weeks?\b|semanas?\b|months?\b|meses\b|mes\b|years?\b|anos?\b|hours?\b|horas?\b|minutes?\b|minutos?\b|dollars?\b|dolares\b|USD\b|soles\b|PEN\b)?/gi)].map(m=>`${Number(m[1])}:${units[m[2]?.toLowerCase()]||'number'}`).sort();
}
function recipients(s:string){const n=normalize(s);return [
  ['advertising',/\b(advertis\w*|publicidad|anunciantes|marketing)\b/],
  ['third parties',/\b(third.part\w*|terceros|external|externos|outside)\b/],
  ['researchers',/\b(researchers|investigadores|research team|equipo de investigacion)\b/],
  ['clinical team',/\b(care team|clinical team|equipo medico|equipo clinico)\b/],
].filter(([,r])=>(r as RegExp).test(n)).map(([k])=>k as string);}

export function auditDocuments(sourceText:string,targetText:string):Audit{
  if(typeof sourceText!=='string'||typeof targetText!=='string'||!sourceText.trim()||!targetText.trim())throw new Error('Add both documents before comparing.');
  if(sourceText.length>MAX_TEXT||targetText.length>MAX_TEXT)throw new Error('Each document must be 40,000 characters or fewer.');
  const sourceClauses=splitClauses(sourceText,'S'),targetClauses=splitClauses(targetText,'E');
  if(!sourceClauses.length||!targetClauses.length)throw new Error('Add readable text to both documents.');
  if(sourceClauses.length>300||targetClauses.length>300)throw new Error('Use a shorter section: at most 300 clauses per document.');
  const findings:Finding[]=[];const pairs:Pair[]=[];const matched=new Set<string>();
  const add=(category:Category,severity:Severity,title:string,reason:string,source:Clause|null,target:Clause|null,signal:string,suggestion:string)=>{findings.push({id:`F${findings.length+1}`,category,severity,title,reason,source,target,signal,suggestion});};
  for(const s of sourceClauses){
    const ranked=targetClauses.map(t=>({target:t,score:alignment(s,t)})).sort((a,b)=>b.score-a.score);
    const best=ranked[0],found=best&&best.score>=.3&&(overlap(s.concepts,best.target.concepts)>0||overlap(s.tokens,best.target.tokens)>=2||best.score===1);
    const t=found?best.target:null,ambiguous=!!(t&&ranked[1]&&best.score<1&&best.score-ranked[1].score<.09);
    pairs.push({source:s,target:t,score:found?best.score:0,ambiguous});
    if(!t){
      const withdrawal=s.concepts.includes('withdrawal');
      add(withdrawal?'withdrawal':'omission',withdrawal?'high':'review',withdrawal?'Withdrawal clause not located':'Source clause needs a match','No sufficiently similar explanation clause was found. This may be an omission, a paraphrase outside the vocabulary, or a segmentation issue.',s,null,'No matching passage','Locate the corresponding explanation manually. If it is missing, restore the source meaning.');continue;
    }
    matched.add(t.id);
    const sn=normalize(s.text),tn=normalize(t.text);
    if(sn===tn)continue;
    let specific=false;
    if(optional(sn)&&mandatory(tn)){
      add('obligation','high','An optional choice became a requirement','The source uses voluntary or optional wording; the explanation uses mandatory wording.',s,t,'Optional → required','Restore the explicit choice and check whether care or participation depends on it.');specific=true;
    }else if(mandatory(sn)&&optional(tn)){
      add('obligation','high','A requirement became optional','A requirement in the source is described as a choice in the explanation.',s,t,'Required → optional','Ask a qualified reviewer to reconcile the obligation before using this explanation.');specific=true;
    }
    if(s.concepts.includes('withdrawal')&&t.concepts.includes('withdrawal')&&negative(sn)!==negative(tn)){
      add('withdrawal','high','Withdrawal permission may be reversed','The withdrawal passages differ in negation. Check the full context; negation can refer to a different part of a sentence.',s,t,'Withdrawal + changed negation','Preserve who may withdraw, when, and with what consequences.');specific=true;
    }
    if(s.concepts.includes('sharing')&&t.concepts.includes('sharing')){
      const sr=recipients(sn),tr=recipients(tn),changed=sr.length&&tr.length&&sr.join('|')!==tr.join('|');
      if(negative(sn)!==negative(tn)||changed){
        add('sharing','high',changed?'Data recipients may have changed':'Data-sharing permission may be reversed',changed?'The aligned passages name different recipient groups. Review the exact recipient and any exceptions.':'The aligned sharing passages differ in negation. Check whether the prohibition applies to the same action.',s,t,changed?`${sr.join(', ')} → ${tr.join(', ')}`:'Sharing + changed negation','Keep permitted recipients, purposes, and exceptions explicit.');specific=true;
      }
    }
    if(!specific&&negative(sn)!==negative(tn)&&!((optional(sn)&&optional(tn))||(permission(sn)&&permission(tn)))){
      add('negation','medium','A positive or negative statement changed','A negation cue appears on only one side. This is a review signal, not proof of a contradiction.',s,t,'Changed negation cue','Check what the negation applies to and preserve the intended meaning.');
    }
    const sq=quantities(sn),tq=quantities(tn);
    if((sq.length||tq.length)&&sq.join('|')!==tq.join('|')){
      add('numbers','high','A number or time period changed','The paired passages contain different quantities or units. Equivalent unit conversions, dates and reference numbers may also trigger this check.',s,t,`${sq.join(', ')||'none'} → ${tq.join(', ')||'none'}`,'Verify the original values and units. Do not substitute an inferred deadline or risk estimate.');
    }
    if(ambiguous)add('omission','review','More than one explanation could match','Two explanation clauses scored similarly. The automatic alignment is uncertain.',s,t,'Ambiguous alignment','Read both documents and confirm the pairing manually.');
  }
  for(const t of targetClauses){if(!matched.has(t.id))add('omission','review','Explanation clause needs a source','No source clause was paired with this explanation. It could be added information, a split translation, or an alignment limitation.',null,t,'Unmatched explanation','Find support in the original or label the added context clearly.');}
  const unrecognized=sourceClauses.filter(c=>!c.concepts.length).length;
  const warnings=['A screening aid, not a legal or clinical determination. No finding does not mean equivalent or safe.','English and Spanish only. Heuristic vocabulary and sentence-level negation can miss or misread paraphrases.'];
  if(unrecognized)warnings.push(`${unrecognized} source clause(s) contain no recognized consent topic. Review these manually.`);
  if(pairs.some(p=>p.ambiguous))warnings.push('Some clause alignments are ambiguous. Check the highlighted evidence.');
  return {version:ENGINE_VERSION,sourceText,targetText,sourceClauses,targetClauses,pairs,findings,coverage:Math.round(pairs.filter(p=>p.target).length/sourceClauses.length*100),unrecognized,warnings};
}

export async function sha256(text:string){const digest=hashBytes(new TextEncoder().encode(text));return Array.from(digest,b=>b.toString(16).padStart(2,'0')).join('');}
