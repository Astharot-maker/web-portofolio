const STORAGE_KEY = "mikal_nova_projects_v1";
const SESSION_KEY = "mikal_nova_admin_logged_in_v1";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

let editingId = null;
let pendingImage = null;

function getProjects() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}
function showDashboard() {
  document.getElementById("loginView")?.classList.add("hidden");
  document.getElementById("dashboardView")?.classList.remove("hidden");
  renderAdminProjects();
}
function showLogin() {
  document.getElementById("dashboardView")?.classList.add("hidden");
  document.getElementById("loginView")?.classList.remove("hidden");
}

function renderAdminProjects() {
  const list = document.getElementById("adminProjectList");
  const empty = document.getElementById("adminEmpty");
  const count = document.getElementById("projectCount");
  const projects = getProjects();

  count.textContent = projects.length;
  list.innerHTML = "";

  if (!projects.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  projects.forEach(project => {
    const item = document.createElement("div");
    item.className = "admin-item";
    item.innerHTML = `
      <img class="admin-thumb" src="${escapeHtml(project.image || "assets/logo.png")}" alt="">
      <div class="admin-info">
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description || "Tanpa deskripsi")}</p>
      </div>
      <div class="admin-buttons">
        <button class="small-btn" data-edit="${escapeHtml(project.id)}">Edit</button>
        <button class="small-btn delete" data-delete="${escapeHtml(project.id)}">Hapus</button>
      </div>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => startEdit(btn.dataset.edit));
  });
  list.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => deleteProject(btn.dataset.delete));
  });
}

function resetForm() {
  editingId = null;
  pendingImage = null;
  document.getElementById("projectForm").reset();
  document.getElementById("projectId").value = "";
  document.getElementById("formTitle").textContent = "Tambah Project";
  document.getElementById("saveBtn").textContent = "Simpan Project";
  document.getElementById("cancelEdit").classList.add("hidden");
  document.getElementById("imagePreview").classList.add("hidden");
  document.getElementById("imagePreview").innerHTML = "";
}

function startEdit(id) {
  const project = getProjects().find(p => p.id === id);
  if (!project) return;

  editingId = id;
  pendingImage = project.image || "";
  document.getElementById("projectId").value = id;
  document.getElementById("projectTitle").value = project.title;
  document.getElementById("projectDescription").value = project.description || "";
  document.getElementById("projectUrl").value = project.url || "";
  document.getElementById("formTitle").textContent = "Edit Project";
  document.getElementById("saveBtn").textContent = "Update Project";
  document.getElementById("cancelEdit").classList.remove("hidden");

  if (project.image) {
    const preview = document.getElementById("imagePreview");
    preview.classList.remove("hidden");
    preview.innerHTML = `<img src="${escapeHtml(project.image)}" alt="Preview">`;
  }
  window.scrollTo({top:0, behavior:"smooth"});
}

function deleteProject(id) {
  const project = getProjects().find(p => p.id === id);
  if (!project) return;
  if (!confirm(`Hapus project "${project.title}"?`)) return;
  saveProjects(getProjects().filter(p => p.id !== id));
  if (editingId === id) resetForm();
  renderAdminProjects();
}

document.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn()) showDashboard(); else showLogin();

  document.getElementById("loginForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      error.textContent = "";
      showDashboard();
    } else {
      error.textContent = "Username atau password salah.";
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  document.getElementById("cancelEdit")?.addEventListener("click", resetForm);

  document.getElementById("projectImage")?.addEventListener("change", e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1500000) {
      alert("Gambar terlalu besar. Gunakan gambar maksimal sekitar 1.5 MB agar localStorage tidak cepat penuh.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      pendingImage = reader.result;
      const preview = document.getElementById("imagePreview");
      preview.classList.remove("hidden");
      preview.innerHTML = `<img src="${reader.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("projectForm")?.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("projectTitle").value.trim();
    const description = document.getElementById("projectDescription").value.trim();
    const url = document.getElementById("projectUrl").value.trim();

    if (!title) return;

    const projects = getProjects();

    if (editingId) {
      const index = projects.findIndex(p => p.id === editingId);
      if (index !== -1) {
        projects[index] = {
          ...projects[index],
          title,
          description,
          url,
          image: pendingImage || projects[index].image || ""
        };
      }
    } else {
      projects.unshift({
        id: uid(),
        title,
        description,
        url,
        image: pendingImage || "",
        createdAt: new Date().toISOString()
      });
    }

    try {
      saveProjects(projects);
    } catch (err) {
      alert("Gagal menyimpan. Penyimpanan browser mungkin penuh. Coba gunakan gambar yang lebih kecil.");
      return;
    }

    resetForm();
    renderAdminProjects();
    alert(editingId ? "Project berhasil diupdate." : "Project berhasil ditambahkan.");
  });

  document.getElementById("clearProjects")?.addEventListener("click", () => {
    if (!getProjects().length) return;
    if (confirm("Hapus SEMUA project dari browser ini?")) {
      localStorage.removeItem(STORAGE_KEY);
      resetForm();
      renderAdminProjects();
    }
  });
});
