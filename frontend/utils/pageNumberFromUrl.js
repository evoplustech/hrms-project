   const pageNumberFromUrl = (url)=>{
    const partUrl = url.split('?');
    const page = partUrl[partUrl.length-1];
    let No = 1;
    if(page.includes('page')){
      const pageNo = page.split('=');
      No = pageNo[1];
    }
    return No;
   }
   export default pageNumberFromUrl