let pageHeader = document.querySelector("#page__header");
let sections = document.querySelectorAll("section");
let navbarList = document.getElementById("navbar__list");
let navbarListItems = document.createDocumentFragment();
let navMenuLinks = [];

/**
 * get current window scroll Y
 *
 *
 * @returns {Number}
 */
function getCurrentWindowPosition() {
  return window.scrollY;
}

function getComputedStyleProp(element, prop) {
  let result = getComputedStyle(element)[prop];

  /**
   * - remove px from value
   * - convert value to number
   */
  result = Number(result.replace("px", ""));

  return result;
}

/**
 * get numerical value of the given
 * HTMLElement margin top property
 *
 * @param {HTMLElement} section
 * @returns {Number}
 */
function getSectionMarginTop(section = null) {
  if (!section) {
    return 0;
  }

  let margin = getComputedStyle(section).marginTop;

  /**
   * - remove px from value
   * - convert value to number
   */
  margin = Number(margin.replace("px", ""));

  return margin;
}

/**
 * get numerical value of scroll Y offset
 * for the given section
 * if no section is given it will return 0
 *
 * @param {HTMLElement} section
 * @returns {Number}
 */
function getSectionStartPosition(section = null) {
  if (!section) {
    return 0;
  }

  // get section margin top value
  let margin = getSectionMarginTop(section);

  /**
   * subtract margin and pageHeader  element client height from offset
   * because its position is sticky top
   * to insure that scroll Y position in view port of window
   *
   */
  return (
    section.offsetTop -
    pageHeader.clientHeight -
    margin -
    getComputedStyleProp(section, "paddingTop")
  );
}

/**
 * get current active section in view port of window
 *
 * @returns {HTMLElement}
 */
function getCurrentActiveSection() {
  /**
   * current window scroll Y
   */
  let scrollY = getCurrentWindowPosition();
  let activeSection = null;

  // looping through all available sections
  // and calculate every section start and end scroll Y value
  sections.forEach(function (section) {
    let sectionStart = getSectionStartPosition(section);
   /*  let sectionEnd =
      sectionStart + section.clientHeight + getSectionMarginTop(); */
    /**
     * if window scroll Y position is between section start
     * and section end this section will be marked as active section
     */
    if (scrollY >= sectionStart /* || scrollY <= sectionEnd */) {
      activeSection = section;
    }
  });

  return activeSection;
}

/**
 * remove active__section class from all
 * section and add this class to only the given
 * section
 *
 *
 * @param {HTMLElement} section
 * @returns  {void}
 */
function toggleActiveSection(section = null) {
  if (!section) {
    return;
  }

  // remove active class from all sections
  sections.forEach(function (item) {
    if (!item.isSameNode(section)) {
      item.classList.remove("active__section");
    }
  });

  section.classList.add("active__section");
}

/**
 * detect active section on page load
 *
 * @return {void}
 */
function detectActiveSectionOnStart() {
  let section = getCurrentActiveSection();

  // window scroll to section start position
  if (section) {
    window.scrollTo({
      top: getSectionStartPosition(section),
    });

    // activate window
    toggleActiveSection(section);
    activateMenuLink(section);
  }
}

/**
 * active menu link that corresponding to the
 * given section element
 *
 * @param {HTMLElement} section
 * @returns {void}
 */
function activateMenuLink(section = null) {
  if (!section) {
    return;
  }

  let activeMenuLink = document.querySelector(`a[href="#${section.id}"]`);

  toggleActiveNavMenuLink(activeMenuLink);
}

/**
 * remove active class from all links
 * and add this class only for the active link
 *
 * @param {HTMLAnchorElement} link
 * @returns {void}
 */
function toggleActiveNavMenuLink(link = null) {
  if (!link) {
    return;
  }

  navMenuLinks.forEach(function (item) {
    if (!item.isSameNode(link)) {
      item.parentElement.classList.remove("active-link");
    }
  });

  link.parentElement.classList.add("active-link");
}

/**
 * build page navigation menu base on
 * current founded sections elements
 *
 */
function buildNavigationMenu() {
  /**
   * looping through all section and
   * create li element and HTMLAnchorElement from section property [id, data-nav]
   *  - make section id as HTMLAnchorElement href property
   *  - make section data-nav value as HTMLAnchorElement textContent
   * and then adding event listener to every HTMlAnchorElement that
   * will scroll page to related section start position
   * and then append HTMLAnchorElement to li and the append all
   * li elements to navbarListItems and finally add this fragment
   * to navbarList
   *
   */
  sections.forEach((section) => {
    // creating a and li elements
    let navMenuLink = document.createElement("a");
    let navMenuItem = document.createElement("li");

    let id = section.id;
    let textContent = section.dataset.nav;

    let sectionStart = getSectionStartPosition(section);

    navMenuLink.href = `#${id}`;
    navMenuLink.textContent = textContent;

    navMenuLinks.push(navMenuLink);

    navMenuItem.appendChild(navMenuLink);
    navbarListItems.appendChild(navMenuItem);

    // add event listener to element click
    /* navMenuLink.addEventListener("click", function (e) {
      e.preventDefault();
      toggleActiveSection(section);
      window.scrollTo({
        top: sectionStart,
      });
    }); */
    navMenuLink.addEventListener("click", scrollToSection);
  });

  // append all fragment to navbarList
  navbarList.appendChild(navbarListItems);
}

/**
 * scroll to section when 
 * nav menu clicked
 * 
 * 
 * @param {Event} e 
 */
function scrollToSection(e) {
  e.preventDefault();
  let section = document.querySelector(e.target.getAttribute("href"));
  let sectionStart = getSectionStartPosition(section);
  toggleActiveSection(section);
  activateMenuLink(section);
  setTimeout(() => {
    window.scrollTo({
      top: sectionStart + getComputedStyleProp(section, "marginTop") + getComputedStyleProp(section, 'paddingTop'),
    });
  }, 0);
}

/**
 * build navigation menu on window load
 * and detect active section
 */
window.addEventListener("load", function () {
  buildNavigationMenu();
  detectActiveSectionOnStart();
});

/**
 * detect active section on window scroll
 *
 */
window.addEventListener("scroll", function () {
  let section = getCurrentActiveSection();
  if (section) {
    toggleActiveSection(section);
    activateMenuLink(section);
  }
});

/**
 * when window size changed
 * 
 */
window.addEventListener("resize", function (e) {
  detectActiveSectionOnStart();
});
