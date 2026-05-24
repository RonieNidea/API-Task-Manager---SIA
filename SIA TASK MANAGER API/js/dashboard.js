const API = "https://task-manager-sia-0gnt.onrender.com/api";

function updateClock(){

  const now = new Date();

  document.getElementById("now-time").textContent =
    now.toLocaleDateString("en-US",{
      weekday:"short",
      month:"short",
      day:"numeric"
    }) +
    " · " +
    now.toLocaleTimeString("en-US",{
      hour:"2-digit",
      minute:"2-digit"
    });

}

updateClock();
setInterval(updateClock,30000);

function fmtDate(d){

  if(!d) return "—";

  return new Date(d).toLocaleDateString("en-US",{
    month:"short",
    day:"numeric",
    year:"numeric"
  });

}

function daysUntil(d){
  return Math.ceil((new Date(d)-new Date())/86400000);
}

function esc(s){

  if(!s) return "";

  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");

}

async function loadAll(){

  try{

    const [dashRes,actRes,tasksRes] = await Promise.all([
      fetch(`${API}/dashboard`),
      fetch(`${API}/activity`),
      fetch(`${API}/tasks`)
    ]);

    if(!dashRes.ok) throw new Error("Dashboard failed");

    const dash = await dashRes.json();
    const activity = actRes.ok ? await actRes.json() : [];
    const tasks = tasksRes.ok ? await tasksRes.json() : [];

    renderStats(dash);
    renderProgress(dash);
    renderDeadlines(dash.upcomingDeadlines || []);
    renderActivity(activity);
    renderTable(tasks);

  }catch(e){

    console.error(e);

    document.getElementById("deadlines-list").innerHTML =
      '<div class="empty">Could not reach backend.</div>';

    document.getElementById("activity-list").innerHTML =
      '<div class="empty">—</div>';

    document.getElementById("tasks-table").innerHTML =
      '<div class="empty">—</div>';

  }

}

function renderStats(d){

  document.getElementById("c-total").textContent =
    d.totalTasks ?? "—";

  document.getElementById("c-pending").textContent =
    d.pending ?? "—";

  document.getElementById("c-progress").textContent =
    d.inProgress ?? "—";

  document.getElementById("c-done").textContent =
    d.completed ?? "—";

  document.getElementById("c-overdue").textContent =
    d.overdue ?? "—";

}

function renderProgress(d){

  const total = d.totalTasks || 1;

  const pct = v =>
    ((v/total)*100).toFixed(1)+"%";

  document.getElementById("bar-done").style.width =
    pct(d.completed || 0);

  document.getElementById("bar-prog").style.width =
    pct(d.inProgress || 0);

  document.getElementById("bar-pend").style.width =
    pct(d.pending || 0);

  document.getElementById("bar-over").style.width =
    pct(d.overdue || 0);

  document.getElementById("pct-text").textContent =
    Math.round(((d.completed || 0)/total)*100)
    + "% complete";

}

function renderDeadlines(tasks){

  const el = document.getElementById("deadlines-list");

  if(!tasks.length){

    el.innerHTML =
      '<div class="empty">No upcoming deadlines 🎉</div>';

    return;

  }

  el.innerHTML = tasks.map(t => {

    const days = daysUntil(t.deadline);

    const cls =
      days < 0 ? "urgent" :
      days <= 3 ? "soon" : "ok";

    const icon =
      days < 0 ? "🔴" :
      days <= 3 ? "🟡" : "🟢";

    const label =
      days < 0 ? `${Math.abs(days)}d overdue` :
      days === 0 ? "Due today" :
      `${days}d left`;

    return `
      <div class="deadline-item">

        <div class="deadline-icon ${cls}">
          ${icon}
        </div>

        <div class="deadline-info">
          <div class="name">${esc(t.title)}</div>
          <div class="who">${esc(t.assignedTo || "—")}</div>
        </div>

        <div class="deadline-date ${cls}">
          ${label}
        </div>

      </div>
    `;

  }).join("");

}

function renderActivity(activity){

  const el = document.getElementById("activity-list");

  if(!activity.length){

    el.innerHTML =
      '<div class="empty">No recent activity.</div>';

    return;

  }

  el.innerHTML = activity.slice(0,8).map(a => `

    <div class="activity-item">

      <div class="activity-dot"></div>

      <div>
        <div class="activity-text">
          ${esc(a.message)}
        </div>

        <div class="activity-time">
          ${
            a.created_at
            ? new Date(a.created_at).toLocaleDateString(
              "en-US",
              { month:"short", day:"numeric" }
            )
            : ""
          }
        </div>
      </div>

    </div>

  `).join("");

}

function renderTable(tasks){

  const el = document.getElementById("tasks-table");

  if(!tasks.length){

    el.innerHTML =
      '<div class="empty">No tasks found.</div>';

    return;

  }

  el.innerHTML = `

    <table>

      <thead>
        <tr>
          <th>Task</th>
          <th>Category</th>
          <th>Assigned To</th>
          <th>Deadline</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>

        ${tasks.map(t => {

          const over =
            t.deadline &&
            new Date(t.deadline) < new Date() &&
            t.status !== "Completed";

          const bc =
            over
            ? "Overdue"
            : (t.status || "Pending").replace(" ","-");

          return `

            <tr>

              <td style="font-weight:500">
                ${esc(t.title)}
              </td>

              <td style="color:var(--text-muted)">
                ${esc(t.category || "—")}
              </td>

              <td>
                ${esc(t.assignedTo || "—")}
              </td>

              <td style="color:${
                over
                ? "var(--neon-red)"
                : "inherit"
              }">
                ${fmtDate(t.deadline)}
              </td>

              <td>
                <span class="badge ${bc}">
                  ${
                    over
                    ? "Overdue"
                    : esc(t.status || "Pending")
                  }
                </span>
              </td>

            </tr>

          `;

        }).join("")}

      </tbody>

    </table>

  `;

}

loadAll();