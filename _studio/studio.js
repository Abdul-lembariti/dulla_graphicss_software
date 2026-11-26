import { catalogPath, categories, externalProjectUrl, statuses } from "./projects.js";

const isLocalSession = location.hostname === "127.0.0.1"
  && location.protocol === "http:"
  && /^\/edit\/[A-Za-z0-9_-]{32}\/$/.test(location.pathname);

if (isLocalSession) startEditor();

function startEditor() {
  const owner = "Abdul-lembariti";
  const repository = "dulla_graphicss_software";
  const repoUrl = `https://github.com/${owner}/${repository}`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repository}`;
  const byId = (id) => document.getElementById(id);
  const value = (id) => byId(id).value.trim();
  const connectForm = byId("connect-form");
  const form = byId("project-form");
  const fieldset = form.querySelector("fieldset");
  const cover = byId("cover");
  const gallery = byId("gallery");
  const disconnect = byId("disconnect");
  const status = byId("studio-status");
  const maxFileSize = 20 * 1024 * 1024;
  const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
  let token = "";
  let baseBranch = "";
  let draftBranch = "";
  let previewUrls = [];

  byId("studio-unavailable").hidden = true;
  byId("connection").hidden = false;
  Object.entries(categories).forEach(([category, label]) => byId("category").add(new Option(label, category)));
  statuses.forEach((label) => byId("project-status").add(new Option(label, label)));

  function report(message, error = false) {
    status.textContent = message;
    status.dataset.error = String(error);
  }

  async function request(path, auth, method = "GET", data) {
    const response = await fetch(`${apiUrl}${path}`, {
      method,
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${auth}`,
        "Content-Type": "application/json",
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      const error = new Error(`GitHub returned ${response.status}. ${result.message || "Try again."}`);
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  function clearSession() {
    token = "";
    baseBranch = "";
    draftBranch = "";
    byId("connection").hidden = false;
    byId("review-links").hidden = true;
    form.hidden = true;
    form.reset();
    updatePreviews();
    report("Disconnected.");
    byId("token").focus();
  }

  connectForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const field = byId("token");
    const submit = connectForm.querySelector("button");
    const candidate = field.value.trim();
    field.value = "";
    if (!/^github_pat_[A-Za-z0-9_]+$/.test(candidate)) {
      report("Enter a fine-grained GitHub personal access token.", true);
      field.focus();
      return;
    }
    submit.disabled = true;
    field.disabled = true;
    report("Connecting to GitHub…");
    try {
      const repo = await request("", candidate);
      if (!repo.default_branch || repo.permissions?.push === false) {
        throw new Error("This token needs repository access with Contents read and write.");
      }
      await readCatalog(repo.default_branch, candidate);
      token = candidate;
      baseBranch = repo.default_branch;
      byId("connection").hidden = true;
      form.hidden = false;
      report("");
      byId("title").focus();
    } catch (error) {
      report(error.message, true);
      field.disabled = false;
      field.focus();
    } finally {
      submit.disabled = false;
      field.disabled = false;
    }
  });

  disconnect.addEventListener("click", clearSession);
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) clearSession();
  });

  function selectedFiles() {
    const files = [...cover.files, ...gallery.files];
    if (gallery.files.length > 4) throw new Error("Choose up to four gallery images.");
    for (const file of files) {
      if (!imageTypes.has(file.type) || file.size === 0 || file.size > maxFileSize) {
        throw new Error(`${file.name} needs to be a JPEG, PNG, or WebP image under 20 MB.`);
      }
    }
    return files;
  }

  function updatePreviews() {
    previewUrls.forEach(URL.revokeObjectURL);
    previewUrls = [];
    const previews = byId("image-previews");
    previews.replaceChildren();
    try {
      selectedFiles().forEach((file) => {
        const image = new Image();
        image.alt = file.name;
        image.src = URL.createObjectURL(file);
        previewUrls.push(image.src);
        previews.append(image);
      });
      if (status.dataset.error === "true") report("");
    } catch (error) {
      report(error.message, true);
    }
  }
  cover.addEventListener("change", updatePreviews);
  gallery.addEventListener("change", updatePreviews);

  async function convertImage(file) {
    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
    } catch {
      throw new Error(`The browser could not read ${file.name}. Try exporting it again.`);
    }
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      throw new Error("Image processing is unavailable in this browser.");
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", .84));
    if (blob?.type !== "image/webp") throw new Error("WebP image export is unavailable in this browser.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result.split(",")[1]), { once: true });
      reader.addEventListener("error", () => reject(new Error("The optimized image could not be read.")), { once: true });
      reader.readAsDataURL(blob);
    });
  }

  async function readCatalog(ref, auth) {
    let file;
    try {
      file = await request(`/contents/${catalogPath}?ref=${encodeURIComponent(ref)}`, auth);
    } catch (error) {
      if (error.status === 404) {
        throw new Error("The project catalog is missing on GitHub. Publish the revised portfolio source to the repository first, then reconnect.");
      }
      throw error;
    }
    if (file.encoding !== "base64") throw new Error("The project catalog could not be read.");
    const bytes = Uint8Array.from(atob(file.content), (character) => character.charCodeAt(0));
    const catalog = JSON.parse(new TextDecoder().decode(bytes));
    if (!Array.isArray(catalog)) throw new Error("The project catalog has an unexpected format.");
    return catalog;
  }

  function buildProject(catalog) {
    const title = value("title");
    const description = value("description");
    if (!title || !description) throw new Error("Enter a project title and overview.");
    const category = value("category");
    if (!Object.hasOwn(categories, category)) throw new Error("Choose a project category.");
    const slug = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70).replace(/-$/, "");
    if (!slug) throw new Error("The title needs at least one letter or number for its project link.");
    if (catalog.some((project) => project.id === slug)) throw new Error("A project already uses this title. Choose a different title.");

    const project = { id: slug, title, category, description };
    const projectStatus = value("project-status");
    if (statuses.includes(projectStatus)) project.status = projectStatus;
    if (value("role")) project.role = value("role");
    if (value("year")) project.year = value("year");
    if (byId("contain").checked) project.imageFit = "contain";

    for (const [field, key] of [["live-url", "liveUrl"], ["repository-url", "github"]]) {
      const input = value(field);
      if (!input) continue;
      const url = externalProjectUrl(input);
      if (!url) throw new Error("Use an HTTP or HTTPS URL for project links.");
      project[key] = url;
    }
    const tools = value("tools").split(",").map((item) => item.trim()).filter(Boolean);
    if (tools.length) project.technologies = tools;
    const notes = Object.fromEntries(["challenge", "approach", "result"]
      .map((key) => [key, value(key)]).filter(([, entry]) => entry));
    if (Object.keys(notes).length) project.caseStudy = notes;
    return project;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!token || fieldset.disabled) return;
    fieldset.disabled = true;
    disconnect.disabled = true;
    try {
      const files = selectedFiles();
      if (!cover.files.length) throw new Error("Choose a cover image.");
      report("Checking the GitHub catalog…");
      const ref = await request(`/git/ref/heads/${encodeURIComponent(draftBranch || baseBranch)}`, token);
      const parent = ref.object.sha;
      const [catalog, previousCommit] = await Promise.all([
        readCatalog(parent, token),
        request(`/git/commits/${parent}`, token),
      ]);
      const project = buildProject(catalog);
      const branch = draftBranch || `portfolio-drafts-${crypto.randomUUID().slice(0, 12)}`;
      const tree = [];
      report("Optimizing and uploading images…");
      for (const [index, file] of files.entries()) {
        const path = `images/work/upload-${crypto.randomUUID()}.webp`;
        const content = await convertImage(file);
        const blob = await request("/git/blobs", token, "POST", { content, encoding: "base64" });
        tree.push({ path, mode: "100644", type: "blob", sha: blob.sha });
        if (index === 0) project.image = path;
        else (project.gallery ??= []).push(path);
      }

      const insertAt = catalog[0]?.featured ? 1 : 0;
      catalog.splice(insertAt, 0, project);
      tree.push({
        path: catalogPath,
        mode: "100644",
        type: "blob",
        content: JSON.stringify(catalog, null, 2) + "\n",
      });
      report("Saving the GitHub draft…");
      const newTree = await request("/git/trees", token, "POST", { base_tree: previousCommit.tree.sha, tree });
      const commit = await request("/git/commits", token, "POST", {
        message: `Add portfolio project: ${project.title}`,
        tree: newTree.sha,
        parents: [parent],
      });

      try {
        if (draftBranch) {
          await request(`/git/refs/heads/${encodeURIComponent(branch)}`, token, "PATCH", { sha: commit.sha, force: false });
        } else {
          await request("/git/refs", token, "POST", { ref: `refs/heads/${branch}`, sha: commit.sha });
        }
      } catch (error) {
        // A connection can drop after GitHub updates the branch. Confirm before reporting failure.
        const latest = await request(`/git/ref/heads/${encodeURIComponent(branch)}`, token).catch(() => null);
        if (latest?.object?.sha !== commit.sha) {
          if (error.status === 409 || error.status === 422) {
            throw new Error("GitHub rejected the branch update. Your form is intact. Save again to read the latest catalog.");
          }
          throw error;
        }
      }

      draftBranch = branch;
      byId("review").href = `${repoUrl}/compare/${encodeURIComponent(baseBranch)}...${encodeURIComponent(branch)}?expand=1`;
      byId("saved-commit").href = `${repoUrl}/commit/${commit.sha}`;
      byId("review-links").hidden = false;
      form.reset();
      updatePreviews();
      report(`Saved “${project.title}” to a GitHub draft. Open the review link to merge when ready.`);
    } catch (error) {
      report(error.message, true);
    } finally {
      fieldset.disabled = false;
      disconnect.disabled = false;
    }
  });
}
