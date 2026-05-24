const API = "https://task-manager-sia-0gnt.onrender.com";

async function loadStats(){
  try{

    const res = await fetch(`${API}/dashboard`);

    if(!res.ok) throw new Error();

    const d = await res.json();

    document.getElementById("s-total").textContent = d.totalTasks ?? "—";
    document.getElementById("s-done").textContent = d.completed ?? "—";
    document.getElementById("s-prog").textContent = d.inProgress ?? "—";
    document.getElementById("s-over").textContent = d.overdue ?? "—";

    document.getElementById("live-status").textContent =
      `${d.totalTasks} tasks · Live`;

  }catch{

    document.getElementById("live-status").textContent =
      "System Online";

  }
}

loadStats();