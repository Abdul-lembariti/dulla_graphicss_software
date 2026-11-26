import { categories, externalProjectUrl, loadProjects, projectImage } from "./projects.js";

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");
const header = document.querySelector(".site-header");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const precisePointer = matchMedia("(hover: hover) and (pointer: fine)");
const progress = header.querySelector(".scroll-progress");
let scrollUpdate = 0;

function reflectScroll() {
  if (scrollUpdate) return;
  scrollUpdate = requestAnimationFrame(() => {
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty("--page-progress", range > 0 ? String(scrollY / range) : "0");
    scrollUpdate = 0;
  });
}
addEventListener("scroll", reflectScroll, { passive: true });
addEventListener("resize", reflectScroll);
reflectScroll();
menu.hidden = false;
header.classList.add("has-menu");

function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "Close menu" : "Menu";
  nav.classList.toggle("is-open", open);
}
menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") === "false"));
nav.addEventListener("click", (event) => {
  if (!event.target.closest("a") || menu.getAttribute("aria-expanded") === "false") return;
  setMenu(false);
  document.querySelector(event.target.closest("a").hash)?.focus({ preventScroll: true });
});
document.querySelector(".header-contact").addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menu.focus();
  }
});
matchMedia("(min-width: 721px)").addEventListener("change", () => setMenu(false));

const navLinks = [...nav.querySelectorAll("a"), document.querySelector(".header-contact")];
const sections = [...document.querySelectorAll("main section[id]")];
sections.forEach((section) => { section.tabIndex = -1; });
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    const section = entries.find((entry) => entry.isIntersecting);
    if (!section) return;
    navLinks.forEach((link) => {
      if (link.hash === `#${section.target.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-26% 0px -56% 0px" });
  sections.forEach((section) => observer.observe(section));
}

document.querySelector("#current-year").textContent = String(new Date().getFullYear());

const grid = document.querySelector("#project-grid");
const filterBar = document.querySelector(".filter-bar");
const more = document.querySelector(".work-more");
const moreButton = document.querySelector("#show-projects");
const count = document.querySelector("#project-count");
const notice = document.querySelector("#project-notice");
const dialog = document.querySelector(".project-dialog");
const details = document.querySelector("#project-details");
const closeButton = dialog.querySelector(".dialog-close");
const initialCount = 5;

let projects = [];
let filter = "all";
let expanded = false;
let initialProject = location.hash.startsWith("#project/");
let projectActivator = null;
let galleryAnimation;
let tilting = null;

function clearTilt() {
  tilting?.classList.remove("is-tilting");
  tilting = null;
}

grid.addEventListener("pointermove", (event) => {
  if (reducedMotion.matches || !precisePointer.matches) return;
  const card = event.target.closest(".project-card");
  if (!card) {
    clearTilt();
    return;
  }
  if (tilting !== card) {
    clearTilt();
    tilting = card;
  }
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  card.style.setProperty("--tilt-x", `${y * -13}deg`);
  card.style.setProperty("--tilt-y", `${x * 17}deg`);
  card.classList.add("is-tilting");
});
grid.addEventListener("pointerleave", clearTilt);
reducedMotion.addEventListener("change", clearTilt);

function animateGallery() {
  if (reducedMotion.matches) return;
  galleryAnimation?.cancel();
  galleryAnimation = grid.animate(
    [{ opacity: .45, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
    { duration: 420, easing: "cubic-bezier(.22, 1, .36, 1)" },
  );
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function projectCategory(project) {
  return project.categoryLabel || categories[project.category] || "Project";
}

function makeCover(project) {
  const visual = element("div", "project-visual");
  const initials = project.title.split(/\s+/).slice(0, 2).map((word) => word[0]).join("");
  const mark = element("span", "project-cover-text", initials);
  visual.setAttribute("aria-hidden", "true");

  const src = projectImage(project.image);
  if (!src) {
    visual.append(mark);
    return visual;
  }
  if (project.imageFit === "contain") visual.classList.add("is-artwork");
  const image = element("img");
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => visual.replaceChildren(mark), { once: true });
  image.src = src;
  visual.append(image);
  return visual;
}

function makeProjectCard(project, featured) {
  const card = element("article", featured ? "project-card is-featured" : "project-card");
  const link = element("a");
  link.href = `#project/${project.id}`;
  link.addEventListener("click", () => { projectActivator = link; });
  card.append(link);
  const copy = element("div", "project-card-copy");
  const openText = element("span", "project-open", "View");
  openText.setAttribute("aria-hidden", "true");
  copy.append(
    element("p", "project-category", projectCategory(project)),
    element("h3", "", project.title),
    openText,
  );
  link.setAttribute("aria-label", `View ${project.title}`);
  link.append(makeCover(project), copy);
  return card;
}

function renderProjects() {
  const matching = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  const shown = expanded || filter !== "all" ? matching : matching.slice(0, initialCount);
  const featured = filter === "all" ? shown.find((project) => project.featured) : null;
  clearTilt();
  grid.replaceChildren(...shown.map((project) => makeProjectCard(project, featured === project)));
  count.textContent = shown.length === matching.length
    ? `${shown.length} ${shown.length === 1 ? "project" : "projects"}`
    : `${shown.length} of ${matching.length} projects`;
  more.hidden = shown.length === matching.length;
  moreButton.textContent = `View all ${matching.length} projects`;
  for (const button of filterBar.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  }
}

function makeFilters() {
  const options = [["all", "All work"], ...Object.entries(categories)];
  for (const [value, label] of options) {
    if (value !== "all" && !projects.some((project) => project.category === value)) continue;
    const button = element("button", "", label);
    button.type = "button";
    button.dataset.filter = value;
    button.addEventListener("click", () => {
      filter = value;
      renderProjects();
      animateGallery();
    });
    filterBar.append(button);
  }
  filterBar.hidden = false;
}
moreButton.addEventListener("click", () => {
  expanded = true;
  renderProjects();
  animateGallery();
  grid.children[initialCount]?.querySelector("a")?.focus();
});

function detailLink(label, rawUrl) {
  const url = externalProjectUrl(rawUrl);
  if (!url) return null;
  const link = element("a", "button button-text", label);
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function renderDetails(project) {
  const heading = element("h2", "", project?.title || "Project unavailable");
  heading.id = "detail-title";
  details.replaceChildren(heading);
  if (!project) {
    details.append(element("p", "detail-summary", "This project does not appear in the current catalog."));
    return;
  }
  details.prepend(element("p", "project-category detail-category", projectCategory(project)));
  if (project.description) details.append(element("p", "detail-summary", project.description));

  const rows = [
    ["Status", project.status],
    ["Role", project.role],
    ["Year", project.year],
    ["Tools & technologies", [...(project.technologies || []), ...(project.tools || [])].join(", ")],
    ["Challenge", project.caseStudy?.challenge],
    ["Approach", project.caseStudy?.approach],
    ["Outcome", project.caseStudy?.result],
  ].filter(([, value]) => value);
  if (rows.length) {
    const notes = element("dl", "detail-notes");
    for (const [label, value] of rows) {
      const row = element("div");
      row.append(element("dt", "", label), element("dd", "", String(value)));
      notes.append(row);
    }
    details.append(notes);
  }

  const links = element("div", "detail-links");
  for (const link of [detailLink("Visit live site", project.liveUrl), detailLink("View repository", project.github)]) {
    if (link) links.append(link);
  }
  if (navigator.clipboard) {
    const copy = element("button", "button button-text", "Copy project link");
    const feedback = element("p", "detail-share");
    feedback.setAttribute("role", "status");
    copy.type = "button";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        feedback.textContent = "Project link copied.";
      } catch {
        feedback.textContent = "Copy the project URL from your address bar.";
      }
    });
    links.append(copy);
    details.append(links, feedback);
  } else if (links.childElementCount) details.append(links);

  const images = [...new Set([project.image, ...(project.gallery || [])].map(projectImage).filter(Boolean))];
  if (images.length) {
    const gallery = element("div", "detail-gallery");
    images.forEach((src, index) => {
      const image = element("img");
      image.alt = index ? `${project.title}, supporting image ${index}` : `${project.title} project artwork`;
      image.loading = index ? "lazy" : "eager";
      image.decoding = "async";
      image.addEventListener("error", () => image.remove(), { once: true });
      image.src = src;
      gallery.append(image);
    });
    details.append(gallery);
  }
}

function syncProjectDialog() {
  const slug = location.hash.match(/^#project\/([a-z0-9-]+)$/)?.[1];
  if (!slug) {
    initialProject = false;
    if (dialog.open) {
      dialog.close();
      projectActivator?.focus({ preventScroll: true });
      projectActivator = null;
    }
    return;
  }
  renderDetails(projects.find((project) => project.id === slug));
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  closeButton.focus({ preventScroll: true });
}

function leaveProject() {
  if (initialProject) {
    history.replaceState(null, "", "#work");
    syncProjectDialog();
    document.querySelector("#work").focus();
    return;
  }
  history.back();
}

closeButton.addEventListener("click", leaveProject);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  leaveProject();
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) leaveProject();
});

try {
  projects = await loadProjects();
  makeFilters();
  renderProjects();
  syncProjectDialog();
  window.addEventListener("hashchange", syncProjectDialog);
} catch (error) {
  notice.textContent = "The project catalog is temporarily unavailable. Reload the page to try again.";
  notice.hidden = false;
  console.error(error);
}
