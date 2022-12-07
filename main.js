import data from "./data/data";
import { getStoredPage, saveCurrentPage } from "./utils/localStorageFunctions";
import "./styles/style.scss";

const start = performance.now();

// Navigation Elements
const hamburgerMenu = document.getElementById("menu-toggle");
const navigationList = document.querySelector(".nav__list");
// Main Page Nav Elements
const mainNavs = document.querySelectorAll(".main__nav");

// Main Page Elements
const mainImage = document.querySelector("#main__body--img");
const mainTitle = document.querySelector(".main__body__info--title");
const mainText = document.querySelector(".main__body__info--text");
const sourceAnchor = document.querySelector(".main__body__src--link");
const mainImageContainer = document.querySelector(
  ".main__body__img__container"
);

// MainPage Data Elements
const rotationElem = document.querySelector(".data__rotation");
const revolutionElem = document.querySelector(".data__revolution");
const radiusElem = document.querySelector(".data__radius");
const tempElem = document.querySelector(".data__temp");

// Extracted functions Functions
function returnCurrentClass(classList) {
  return [...classList].find((li) => li.includes("li-"));
}

function resetNavList(navList) {
  [...navList].forEach((li) => li.classList.remove("active"));
  navList[0].classList.add("active");
}

function computeForEachNavigation(fn) {
  mainNavs.forEach(fn);
}

// handles page section UI
function handleSectionChange(indx, pageData) {
  const {
    overview: { content, source },
    structure: { content: structureContent, source: structureSource },
    geology: { content: geologyContent, source: geologySource },
    images: { planet, internal, geology },
  } = pageData;

  //   Reset image
  const geoImg = document.querySelector(".geology__image");
  if (geoImg) geoImg.remove();

  const geologyImage = document.createElement("img");
  geologyImage.classList.add("geology__image");

  switch (indx) {
    case 0:
      mainImage.src = planet;
      mainText.innerText = content;
      sourceAnchor.href = source;
      return;
    case 1:
      mainImage.src = internal;
      mainText.innerText = structureContent;
      sourceAnchor.href = structureSource;
      return;
    case 2:
      mainImage.src = planet;
      geologyImage.src = geology;
      mainImageContainer.appendChild(geologyImage);
      mainText.innerText = geologyContent;
      sourceAnchor.href = geologySource;
      return;
    default:
      mainImage.src = planet;
      mainText.innerText = content;
      sourceAnchor.href = source;
      return;
  }
}

// handles MainPage UI
function updatePage(pageData) {
  const index = data.indexOf(pageData);

  const {
    overview: { content, source },
    rotation,
    revolution,
    radius,
    temperature,
    images: { planet },
    name,
  } = pageData;

  mainImage.src = planet;
  mainTitle.innerText = name.toUpperCase();
  mainText.innerText = content;
  sourceAnchor.href = source;

  rotationElem.querySelector(".data-value").innerText = rotation;
  revolutionElem.querySelector(".data-value").innerText = revolution;
  radiusElem.querySelector(".data-value").innerText = radius;
  tempElem.querySelector(".data-value").innerText = temperature;

  // reset mainPageNavs
  computeForEachNavigation((nav) => {
    resetNavList(nav.children);
    [...nav.children].forEach((li) => {
      const classList = li.classList;
      li.classList.remove(returnCurrentClass(classList));
      li.classList.add(`li-${index + 1}`);
    });
  });

  handleSectionChange(0, pageData);
}

// handles navigation UI & sets starts updating page as needed
function runPageChange(e, store) {
  const currentActive = navigationList.querySelector(".active");

  if (typeof e === "object") {
    const currentElement = e.target;
    const activePageName = currentActive.innerText.toLowerCase();
    const pageName = currentElement.innerText.toLowerCase();
    //   if current page is what were changing to return.
    if (activePageName === pageName) return;

    store.setPage(pageName);
    saveCurrentPage(pageName.toUpperCase());

    currentActive.classList.remove("active");
    currentElement.classList.add("active");
  }

  if (typeof e === "string") {
    const pageName = e.toLowerCase();
    currentActive.classList.remove("active");

    const currentNavList = [...navigationList.children].find((li) => {
      return li.innerText.toLowerCase() === pageName;
    });

    if (!currentNavList) throw Error("There is no navigation with that title");

    store.setPage(pageName);
    saveCurrentPage(pageName.toUpperCase());
    currentNavList.classList.add("active");
  }

  if (hamburgerMenu) hamburgerMenu.checked = false;

  updatePage(store.grabCurrentData());
}

const handleMainPageNav = (store) => {
  if (!store) throw new Error("Please add the data store as a parameter");

  computeForEachNavigation((nav) => {
    const navList = nav.children;

    [...navList].forEach((li, i) => {
      li.addEventListener("click", (e) => {
        const currentActive = nav.querySelector(".active");
        currentActive.classList.remove("active");
        li.classList.add("active");
        handleSectionChange(i, store.grabCurrentData());
      });
    });
  });
};

// highest level function.
function handlePageChange(lastPage, options) {
  const store = {
    page: lastPage,
    setPage(page) {
      this.page = page;
    },
    grabCurrentData() {
      const singleData = data.find(
        (planet) => planet.name.toLowerCase() === this.page.toLowerCase()
      );
      if (!singleData) new Error("There is an issue with the data.");

      return singleData;
    },
  };

  if (options.init) runPageChange(lastPage, store);

  const navList = [...navigationList.children];
  navList.forEach((li) =>
    li.addEventListener("click", (e) => runPageChange(e, store))
  );

  // each time page is changed, mainSection navList is reset.
  handleMainPageNav(store);
}

handlePageChange(getStoredPage(), { init: true });

const duration = performance.now() - start;
console.log(`this page took ${duration} ms run this page.`);
