/** Small author-defined development set. Not clinical validation or an independent benchmark. */
export const FIXTURES=[
{id:'C01',name:'Faithful sharing translation',source:'Sharing your data is optional.',target:'Compartir sus datos es opcional.',expected:[]},
{id:'C02',name:'Choice becomes mandatory',source:'Sharing your data is optional.',target:'Compartir sus datos es obligatorio.',expected:['obligation']},
{id:'C03',name:'Requirement becomes optional',source:'Participation is mandatory.',target:'La participación es opcional.',expected:['obligation']},
{id:'C04',name:'Reversed benefit assurance',source:'The treatment does not guarantee a benefit.',target:'El tratamiento garantiza un beneficio.',expected:['negation']},
{id:'C05',name:'Retention period changes',source:'Your records are stored for 30 days.',target:'Sus registros se conservarán durante 90 días.',expected:['numbers']},
{id:'C06',name:'Faithful retention translation',source:'Your records are stored for 30 days.',target:'Sus registros se conservarán durante 30 días.',expected:[]},
{id:'C07',name:'Sharing prohibition removed',source:'We will not share your data with advertisers.',target:'Compartiremos sus datos con anunciantes.',expected:['sharing']},
{id:'C08',name:'Recipient changes',source:'We share data with researchers.',target:'Compartimos datos con anunciantes.',expected:['sharing']},
{id:'C09',name:'Withdrawal clause missing',source:'You may withdraw consent at any time.',target:'Participation is voluntary.',expected:['withdrawal','omission']},
{id:'C10',name:'Withdrawal permission reversed',source:'You may withdraw consent.',target:'No puede retirar su consentimiento.',expected:['withdrawal']},
{id:'C11',name:'Unchanged control',source:'Participation may cause mild pain.',target:'Participation may cause mild pain.',expected:[]},
{id:'C12',name:'Risk magnitude changes',source:'El riesgo de sangrado es del 2%.',target:'The risk of bleeding is 20%.',expected:['numbers']},
{id:'C13',name:'Faithful negation translation',source:'We will not share data with advertisers.',target:'No compartiremos datos con anunciantes.',expected:[]},
{id:'C14',name:'Unrecognized paraphrase abstention',source:'The custodian shall purge the archive.',target:'The clinic will erase the files.',expected:['omission']},
{id:'C15',name:'Optional phrasing with negation',source:'Participation is not required.',target:'La participación es voluntaria.',expected:[]},
{id:'C16',name:'Written number translation',source:'Records are stored for thirty days.',target:'Los registros se conservarán durante treinta días.',expected:[]},
] as const;
