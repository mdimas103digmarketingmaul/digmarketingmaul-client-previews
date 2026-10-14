(() => {
  const projects = Array.isArray(window.DM_PROJECTS) ? window.DM_PROJECTS : [];
  const grid = document.getElementById("projectGrid");
  const emptyState = document.getElementById("emptyState");
  const projectCount = document.getElementById("projectCount");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();
  if (projectCount) projectCount.textContent = projects.length;

  if (!projects.length) {
    if (emptyState) emptyState.hidden = false;
    return;
  }

  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);

  grid.innerHTML = projects.map((project) => {
    const name = escapeHtml(project.name);
    const slug = encodeURIComponent(project.slug);
    const type = escapeHtml(project.type || "Website Project");
    const status = escapeHtml(project.status || "Preview");
    const updated = escapeHtml(project.updated || "");
    const options = Number(project.options || 0);
    const accent = escapeHtml(project.accent || "#d9ff57");

    return `
      <a class="project-card" href="/${slug}/" style="--card-accent:${accent}">
        <div class="card-top">
          <span class="status">${status}</span>
          <span class="option-count">${options} ${options === 1 ? "Option" : "Options"}</span>
        </div>

        <div class="card-body">
          <p class="card-kicker">${type}</p>
          <h3>${name}</h3>
        </div>

        <div class="card-bottom">
          <span class="updated">${updated ? `Updated ${updated}` : "DIGMARKETINGMAUL"}</span>
          <span class="open-link">Open Project <span>↗</span></span>
        </div>
      </a>
    `;
  }).join("");
})();
