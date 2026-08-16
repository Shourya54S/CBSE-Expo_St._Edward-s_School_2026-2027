const $ = (selector, scope = document) =>
  scope.querySelector(selector);

const $$ = (selector, scope = document) =>
  [...scope.querySelectorAll(selector)];


/* =====================================================
   PERSPECTIVE CONTENT
===================================================== */

const perspectiveData = {
  news: {
    number: "01",
    type: "Evidence & credibility",
    title: "Newspaper Report",
    text:
      "A headline gives the story public record, context and credibility.",
    symbol: "N"
  },

  reel: {
    number: "02",
    type: "Speed & attention",
    title: "Instagram Reel",
    text:
      "A short visual hook makes the story immediate and easy to share.",
    symbol: "▶"
  },

  podcast: {
    number: "03",
    type: "Voice & intimacy",
    title: "Podcast",
    text:
      "Human voice creates closeness that a written headline cannot.",
    symbol: "🎙️"
  },

  documentary: {
    number: "04",
    type: "Observation & emotion",
    title: "Documentary",
    text:
      "Moving images connect daily routine, family context and human expression.",
    symbol: "[◉]"
  },

  infographic: {
    number: "05",
    type: "Data & scale",
    title: "Infographic",
    text:
      "Numbers make debt, time, work and responsibility visible at a glance.",
    symbol: "%"
  },

  poster: {
    number: "06",
    type: "Message & recall",
    title: "Posters",
    text:
      "A bold phrase turns one story into a public call to look again.",
    symbol: "!"
  },

  web: {
    number: "07",
    type: "Choice & exploration",
    title: "Webpage",
    text:
      "The audience chooses its own route through press, facts and reflection.",
    symbol: "⌘"
  },

  merch: {
    number: "08",
    type: "Purpose & continuation",
    title: "Merchandise",
    text:
      "A physical object carries the message beyond the exhibition space.",
    symbol: "📦"
  }
};


/* =====================================================
   SCROLL PROGRESS AND HEADER
===================================================== */

function updateScrollUI() {
  const scrollTop = window.scrollY;

  const maximum =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const percentage =
    maximum > 0
      ? (scrollTop / maximum) * 100
      : 0;

  const scrollProgress =
    $("#scrollProgress");

  const siteHeader =
    $("#siteHeader");

  if (scrollProgress) {
    scrollProgress.style.width =
      `${percentage}%`;
  }

  if (siteHeader) {
    siteHeader.classList.toggle(
      "scrolled",
      scrollTop > 32
    );
  }
}

window.addEventListener(
  "scroll",
  updateScrollUI,
  { passive: true }
);

updateScrollUI();


/* =====================================================
   MOBILE QUICK ACCESS MENU
===================================================== */

const menuToggle =
  $("#menuToggle");

const quickNav =
  $("#quickNav");

if (menuToggle && quickNav) {
  menuToggle.addEventListener(
    "click",
    () => {
      const opening =
        menuToggle.getAttribute(
          "aria-expanded"
        ) !== "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(opening)
      );

      quickNav.classList.toggle(
        "open",
        opening
      );

      document.body.classList.toggle(
        "menu-open",
        opening
      );
    }
  );

  $$("a", quickNav).forEach(
    (link) => {
      link.addEventListener(
        "click",
        () => {
          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          quickNav.classList.remove(
            "open"
          );

          document.body.classList.remove(
            "menu-open"
          );
        }
      );
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      quickNav.classList.remove(
        "open"
      );

      document.body.classList.remove(
        "menu-open"
      );
    }
  );
}


/* =====================================================
   SCROLL REVEAL ANIMATIONS
===================================================== */

if ("IntersectionObserver" in window) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(
          (entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -7% 0px"
      }
    );

  $$(".reveal").forEach(
    (element) => {
      revealObserver.observe(
        element
      );
    }
  );
} else {
  $$(".reveal").forEach(
    (element) => {
      element.classList.add(
        "visible"
      );
    }
  );
}


/* =====================================================
   ACTIVE QUICK ACCESS LINK
===================================================== */

const sections =
  $$("main section[id]");

const navLinks =
  quickNav
    ? $$("a[href^='#']", quickNav)
    : [];

if (
  "IntersectionObserver" in window &&
  sections.length &&
  navLinks.length
) {
  const sectionObserver =
    new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            navLinks.forEach(
              (link) => {
                const isActive =
                  link.getAttribute(
                    "href"
                  ) ===
                  `#${entry.target.id}`;

                link.classList.toggle(
                  "active",
                  isActive
                );
              }
            );
          }
        );
      },
      {
        rootMargin:
          "-30% 0px -58% 0px",
        threshold: 0.01
      }
    );

  sections.forEach(
    (section) => {
      sectionObserver.observe(
        section
      );
    }
  );
}


/* =====================================================
   SMOOTH SCROLLING
===================================================== */

$$('a[href^="#"]').forEach(
  (link) => {
    link.addEventListener(
      "click",
      (event) => {
        const targetID =
          link.getAttribute("href");

        if (
          !targetID ||
          targetID === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetID
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        const reducedMotion =
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

        target.scrollIntoView({
          behavior:
            reducedMotion
              ? "auto"
              : "smooth",

          block: "start"
        });
      }
    );
  }
);


/* =====================================================
   INTERACTIVE EIGHT PERSPECTIVES
===================================================== */

const tabButtons =
  $$("#perspectiveTabs [role='tab']");

function selectPerspective(button) {
  const key =
    button.dataset.key;

  const item =
    perspectiveData[key];

  if (!item) {
    return;
  }

  tabButtons.forEach(
    (tab) => {
      const active =
        tab === button;

      tab.classList.toggle(
        "active",
        active
      );

      tab.setAttribute(
        "aria-selected",
        String(active)
      );
    }
  );

  const displayNumber =
    $("#displayNumber");

  const displayType =
    $("#displayType");

  const displayTitle =
    $("#displayTitle");

  const displayText =
    $("#displayText");

  const displaySymbol =
    $("#displaySymbol");

  if (displayNumber) {
    displayNumber.textContent =
      item.number;
  }

  if (displayType) {
    displayType.textContent =
      item.type;
  }

  if (displayTitle) {
    displayTitle.textContent =
      item.title;
  }

  if (displayText) {
    displayText.textContent =
      item.text;
  }

  if (displaySymbol) {
    displaySymbol.textContent =
      item.symbol;
  }

  const display =
    $("#perspectiveDisplay");

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (
    display &&
    !reducedMotion &&
    typeof display.animate ===
      "function"
  ) {
    display.animate(
      [
        {
          opacity: 0.55,
          transform:
            "translateY(8px)"
        },
        {
          opacity: 1,
          transform:
            "translateY(0)"
        }
      ],
      {
        duration: 300,
        easing: "ease-out"
      }
    );
  }
}

tabButtons.forEach(
  (button, index) => {
    button.addEventListener(
      "click",
      () => {
        selectPerspective(
          button
        );
      }
    );

    button.addEventListener(
      "keydown",
      (event) => {
        const allowedKeys = [
          "ArrowDown",
          "ArrowUp",
          "ArrowRight",
          "ArrowLeft",
          "Home",
          "End"
        ];

        if (
          !allowedKeys.includes(
            event.key
          )
        ) {
          return;
        }

        event.preventDefault();

        let next =
          index;

        if (
          event.key ===
            "ArrowDown" ||
          event.key ===
            "ArrowRight"
        ) {
          next =
            (index + 1) %
            tabButtons.length;
        }

        if (
          event.key ===
            "ArrowUp" ||
          event.key ===
            "ArrowLeft"
        ) {
          next =
            (
              index -
              1 +
              tabButtons.length
            ) %
            tabButtons.length;
        }

        if (
          event.key === "Home"
        ) {
          next = 0;
        }

        if (
          event.key === "End"
        ) {
          next =
            tabButtons.length - 1;
        }

        tabButtons[next].focus();

        selectPerspective(
          tabButtons[next]
        );
      }
    );
  }
);

if (tabButtons.length) {
  const activeTab =
    tabButtons.find(
      (button) =>
        button.classList.contains(
          "active"
        )
    ) || tabButtons[0];

  selectPerspective(
    activeTab
  );
}


/* =====================================================
   NEWSPAPER IMAGE MODAL
===================================================== */

const imageModal =
  $("#imageModal");

const modalImage =
  $("#modalImage");

const modalCaption =
  $("#modalCaption");

const modalClose =
  $("#modalClose");

$$(".image-button").forEach(
  (button) => {
    button.addEventListener(
      "click",
      () => {
        if (
          !imageModal ||
          !modalImage
        ) {
          return;
        }

        modalImage.src =
          button.dataset.image || "";

        modalImage.alt =
          button.dataset.caption ||
          "Newspaper cutout";

        if (modalCaption) {
          modalCaption.textContent =
            button.dataset.caption ||
            "";
        }

        if (
          typeof imageModal.showModal ===
          "function"
        ) {
          imageModal.showModal();
        } else {
          imageModal.setAttribute(
            "open",
            ""
          );
        }
      }
    );
  }
);

if (modalClose && imageModal) {
  modalClose.addEventListener(
    "click",
    () => {
      imageModal.close();
    }
  );
}

if (imageModal) {
  imageModal.addEventListener(
    "click",
    (event) => {
      if (
        event.target === imageModal
      ) {
        imageModal.close();
      }
    }
  );
}


/* =====================================================
   REFLECTION WALL
===================================================== */

const reflectionForm =
  $("#reflectionForm");

const reflectionInput =
  $("#reflectionInput");

const reflectionWall =
  $("#reflectionWall");

const formStatus =
  $("#formStatus");

const storageKey =
  "echo-effect-reflections";

function readWords() {
  try {
    const stored =
      JSON.parse(
        localStorage.getItem(
          storageKey
        ) || "[]"
      );

    return Array.isArray(stored)
      ? stored
      : [];
  } catch {
    return [];
  }
}

function saveWords(words) {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(words)
    );
  } catch {
    console.warn(
      "Local storage is not available."
    );
  }
}

function addWordToWall(word) {
  if (!reflectionWall) {
    return;
  }

  const chip =
    document.createElement(
      "span"
    );

  chip.textContent =
    word;

  reflectionWall.appendChild(
    chip
  );

  if (
    typeof chip.animate ===
      "function" &&
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    chip.animate(
      [
        {
          opacity: 0,
          transform:
            "scale(0.8)"
        },
        {
          opacity: 1,
          transform:
            "scale(1)"
        }
      ],
      {
        duration: 280,
        easing: "ease-out"
      }
    );
  }
}

readWords().forEach(
  addWordToWall
);

if (
  reflectionForm &&
  reflectionInput
) {
  reflectionForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const value =
        reflectionInput.value
          .trim()
          .replace(
            /\s+/g,
            " "
          );

      if (!value) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter one word.";
        }

        reflectionInput.focus();
        return;
      }

      if (
        value.split(" ").length >
        2
      ) {
        if (formStatus) {
          formStatus.textContent =
            "Keep it to one short reflection.";
        }

        return;
      }

      const words =
        readWords();

      words.push(value);

      saveWords(
        words.slice(-20)
      );

      addWordToWall(
        value
      );

      reflectionInput.value =
        "";

      if (formStatus) {
        formStatus.textContent =
          "Your reflection has been added.";
      }
    }
  );
}


/* =====================================================
   ESCAPE KEY FOR MODAL
===================================================== */

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      imageModal &&
      imageModal.open
    ) {
      imageModal.close();
    }
  }
);