export const catalogPath = "projects.json";

export const categories = {
  software: "Software",
  design: "Design & branding",
  creative: "Photography & creative",
  motion: "Motion",
};

export const statuses = ["Completed", "In progress", "Independent concept"];

export function projectImage(value) {
  return typeof value === "string" && /^images\/work\/[a-z0-9-]+\.webp$/.test(value) ? value : null;
}

export function externalProjectUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export async function loadProjects() {
  const response = await fetch(new URL(catalogPath, import.meta.url));
  if (!response.ok) throw new Error("Project catalog is unavailable.");
  const projects = await response.json();
  if (!Array.isArray(projects)) throw new Error("Project catalog is invalid.");
  return projects;
}
