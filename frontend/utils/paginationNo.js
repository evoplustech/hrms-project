export const paginationNo = (currentPage,totalPages)=>{
  let currentPageno = Number(currentPage);
  let next = currentPageno + 1;
  let prev = currentPageno - 1;

  if (currentPageno < 2) {
    next = currentPageno + 2;
    prev = currentPageno;
  } else if (currentPageno >= totalPages) {
    next = currentPageno;
    prev = currentPageno - 2;
  }
  return { prev, next };
}




