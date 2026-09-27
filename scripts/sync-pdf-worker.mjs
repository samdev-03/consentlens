import {copyFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Keep the locally hosted worker at exactly the installed PDF.js version.
const require=createRequire(import.meta.url);
const packageRoot=dirname(require.resolve('pdfjs-dist/package.json'));
const publicRoot=fileURLToPath(new URL('../public/',import.meta.url));
mkdirSync(publicRoot,{recursive:true});
copyFileSync(resolve(packageRoot,'build/pdf.worker.min.mjs'),resolve(publicRoot,'pdf.worker.min.mjs'));
copyFileSync(resolve(packageRoot,'LICENSE'),resolve(publicRoot,'PDFJS-LICENSE'));
console.log('Prepared local PDF.js worker and license.');
