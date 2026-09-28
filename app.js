const STORAGE_KEY = "mikal_nova_projects_v1";

function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  const empty = document.getElementById("emptyProjects");
  if (!grid) return;

  const projects = getProjects();
  grid.innerHTML = "";

  if (!projects.length) {
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");

  projects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card";
    const image = project.image || "assets/logo.png";

    card.innerHTML = `
      <img class="project-image" src="${escapeAttr(image)}" alt="${escapeAttr(project.title)}">
      <div class="project-body">
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description || "Tidak ada deskripsi.")}</p>
        ${project.url ? `<a class="project-link" href="${escapeAttr(project.url)}" target="_blank" rel="noopener">Buka Project ↗</a>` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}
function escapeAttr(value) {
  return escapeHtml(value);
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("mainNav");
  menuBtn?.addEventListener("click", () => nav?.classList.toggle("open"));
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
});
