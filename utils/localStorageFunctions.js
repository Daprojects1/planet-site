function saveCurrentPage(pageName) {
  if (!pageName || typeof pageName !== "string")
    throw Error("Sorry please input the right page name");

  localStorage.setItem("currentPage", pageName);
}

function getStoredPage() {
  const page = localStorage.getItem("currentPage");
  if (!page) saveCurrentPage("Earth");
  else return page;

  return getStoredPage();
}

export { saveCurrentPage, getStoredPage };
