export type Example={id:string;title:string;description:string;source:string;target:string;sourceLanguage:string;targetLanguage:string};
export const EXAMPLES:Example[]=[
{id:'research',title:'Research consent · EN → ES',description:'Fictional example with an optional choice changed, a retention period changed, and withdrawal information omitted.',sourceLanguage:'English',targetLanguage:'Español',source:`Sharing your health data for research is optional.
Your records will be stored for 30 days.
You may withdraw your consent at any time.
We will not share your records with advertisers.
Participation may cause mild pain.
Contact the study team with questions.`,target:`Compartir sus datos de salud para investigación es obligatorio.
Sus registros se conservarán durante 90 días.
Compartiremos sus registros con anunciantes.
La participación puede causar dolor leve.
Contacte al equipo del estudio si tiene preguntas.`},
{id:'control',title:'Faithful explanation · EN → ES',description:'A synthetic control. These phrases preserve the tested signals; this does not certify the translation.',sourceLanguage:'English',targetLanguage:'Español',source:`Sharing your health data for research is optional.
Your records will be stored for 30 days.
You may withdraw your consent at any time.
We will not share your records with advertisers.`,target:`Compartir sus datos de salud para investigación es opcional.
Sus registros se conservarán durante 30 días.
Puede retirar su consentimiento en cualquier momento.
No compartiremos sus registros con anunciantes.`},
{id:'same-language',title:'Simplified explanation · EN → EN',description:'Fictional plain-language summary with a changed requirement and unsupported assurance.',sourceLanguage:'English',targetLanguage:'English',source:`Participation in this study is voluntary.
The treatment does not guarantee a benefit.
Your records will be retained for 5 years.
You may withdraw from the study at any time.`,target:`Participation in this study is mandatory.
The treatment will guarantee a benefit.
Your records will be retained for 5 years.
You may withdraw from the study at any time.`},
{id:'spanish',title:'Clinical explanation · ES → EN',description:'A fictional Spanish source with a changed risk percentage and reversed withdrawal statement.',sourceLanguage:'Español',targetLanguage:'English',source:`El riesgo de sangrado es del 2%.
Puede retirar su consentimiento en cualquier momento.
Compartir sus datos con investigadores es opcional.`,target:`The risk of bleeding is 20%.
You cannot withdraw your consent at any time.
Sharing your data with researchers is optional.`},
];
