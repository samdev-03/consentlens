export async function readDocument(file:File):Promise<string>{
  if(file.size>5*1024*1024)throw new Error('Choose a document smaller than 5 MB.');
  if(/\.(txt|md)$/i.test(file.name)||file.type==='text/plain')return file.text();
  if(file.type==='application/pdf'||/\.pdf$/i.test(file.name)){
    const pdfjs=await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';
    const loading=pdfjs.getDocument({data:await file.arrayBuffer(),useSystemFonts:true});
    const pdf=await loading.promise;
    try{
      if(pdf.numPages>30)throw new Error('Choose a PDF with 30 pages or fewer.');
      const pages:string[]=[];
      for(let n=1;n<=pdf.numPages;n++){
        const page=await pdf.getPage(n),content=await page.getTextContent();
        pages.push(content.items.map(item=>'str' in item?item.str+('hasEOL' in item&&item.hasEOL?'\n':' '):'').join(''));
      }
      const text=pages.join('\n\n').trim();
      if(text.length<10)throw new Error('This PDF has no readable text layer. Paste its text or use a text-based PDF; scanned images need OCR first.');
      return text;
    }finally{await loading.destroy();}
  }
  throw new Error('Choose a .txt, .md, or text-based .pdf file.');
}
