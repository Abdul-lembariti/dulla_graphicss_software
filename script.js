import { DEFAULT_PROJECT_IMAGE, projects } from "./projects.js";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const navLinks = [...document.querySelectorAll(".primary-nav a")];

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const projectGrid = document.querySelector("#project-grid");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const visibleCount = document.querySelector("#visible-count");
const visibleLabel = document.querySelector("#visible-label");
const filterEmpty = document.querySelector("#filter-empty");

const categoryNames = {
  software: "Software",
  design: "Design",
  branding: "Branding",
  motion: "Motion",
  creative: "Other creative",
};

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function makeProjectCard(project, index) {
  const card = makeElement("article", "project-card");
  card.dataset.category = project.category;
  card.dataset.projectId = project.id;
  if (project.featured) card.classList.add("project-featured");
  if (project.projectType === "independent-redesign") card.classList.add("independent-card");

  const figure = makeElement("figure", "project-visual");
  const image = makeElement("img");
  image.src = project.image || DEFAULT_PROJECT_IMAGE;
  image.alt = project.image ? `${project.title} project artwork` : "";
  image.loading = index < 3 ? "eager" : "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = "true";
    image.alt = "";
    image.src = DEFAULT_PROJECT_IMAGE;
  });
  figure.append(image);

  const visualLabel = project.projectType === "independent-redesign"
    ? "INDEPENDENT REDESIGN"
    : `${String(index + 1).padStart(2, "0")} / ${(categoryNames[project.category] || project.category).toUpperCase()}`;
  figure.append(makeElement("span", "image-index", visualLabel));

  if (project.liveUrl) {
    const imageLink = makeElement("a", "project-image-link");
    imageLink.href = project.liveUrl;
    imageLink.target = "_blank";
    imageLink.rel = "noopener noreferrer";
    imageLink.setAttribute("aria-label", `Visit ${project.title}${project.projectType === "independent-redesign" ? " redesign" : " project"} (opens in a new tab)`);
    const openIcon = makeElement("span", "image-open", "↗");
    openIcon.setAttribute("aria-hidden", "true");
    figure.append(openIcon);
    imageLink.append(figure);
    card.append(imageLink);
  } else {
    card.append(figure);
  }

  const meta = makeElement("div", "project-meta");
  meta.append(makeElement("span", "", project.categoryLabel || categoryNames[project.category] || project.category));
  meta.append(makeElement("span", "", String(index + 1).padStart(2, "0")));
  card.append(meta);

  const heading = makeElement("div", "project-card-heading");
  heading.append(makeElement("h3", "", project.title));
  if (project.liveUrl) {
    const arrow = makeElement("a", "project-arrow", "↗");
    arrow.href = project.liveUrl;
    arrow.target = "_blank";
    arrow.rel = "noopener noreferrer";
    arrow.setAttribute("aria-label", `Visit ${project.title}${project.projectType === "independent-redesign" ? " redesign" : " project"} (opens in a new tab)`);
    heading.append(arrow);
  }
  card.append(heading);

  if (project.description) {
    card.append(makeElement("p", "project-description", project.description));
  }

  const projectTags = [...project.technologies, ...project.tools];
  if (projectTags.length) {
    const tags = makeElement("ul", "project-tags");
    tags.setAttribute("aria-label", `${project.title} technologies and tools`);
    projectTags.forEach((tag) => tags.append(makeElement("li", "", tag)));
    card.append(tags);
  }

  if (project.caseStudy) {
    const caseStudy = makeElement("details", "project-case-study");
    caseStudy.append(makeElement("summary", "", "Case study notes"));
    const notes = makeElement("dl", "case-study-notes");
    const fields = [
      ["Challenge", project.caseStudy.challenge],
      ["Approach", project.caseStudy.approach],
      ["My role", project.caseStudy.role || project.role],
      ["Technologies / tools", project.caseStudy.technologies],
      ["Result", project.caseStudy.result],
    ];
    fields.forEach(([label, value]) => {
      if (value) {
        notes.append(makeElement("dt", "", label));
        notes.append(makeElement("dd", "", value));
      }
    });
    caseStudy.append(notes);
    card.append(caseStudy);
  }

  if (project.liveUrl) {
    const visitLabel = project.projectType === "independent-redesign" ? "Visit redesign" : "Visit project";
    const visitLink = makeElement("a", "project-visit");
    visitLink.href = project.liveUrl;
    visitLink.target = "_blank";
    visitLink.rel = "noopener noreferrer";
    visitLink.append(document.createTextNode(visitLabel));
    visitLink.append(makeElement("span", "", " ↗"));
    visitLink.querySelector("span").setAttribute("aria-hidden", "true");
    card.append(visitLink);
  }

  return card;
}

function renderProjects() {
  if (!projectGrid) return;
  const cards = projects.map(makeProjectCard);
  projectGrid.replaceChildren(...cards);

  document.querySelectorAll("[data-filter-count='all']").forEach((count) => {
    count.textContent = String(projects.length);
  });
  setFilter("all");
}

function setFilter(filter) {
  if (!projectGrid) return;

  const cards = [...projectGrid.querySelectorAll(".project-card")];
  let count = 0;
  cards.forEach((card, index) => {
    const visible = filter === "all" || card.dataset.category === filter;
    card.hidden = !visible;
    if (visible) {
      count += 1;
      card.style.animationDelay = `${Math.min(index % 5, 4) * 35}ms`;
    }
  });

  if (visibleCount) visibleCount.textContent = String(count);
  if (visibleLabel) visibleLabel.textContent = count === 1 ? "project" : "projects";
  if (filterEmpty) filterEmpty.hidden = count !== 0;

  filterButtons.forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

renderProjects();

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

if ("IntersectionObserver" in window) {
  const sections = [...document.querySelectorAll("main section[id]")];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));
}