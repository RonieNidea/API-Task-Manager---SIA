const API_URL = "https://task-manager-sia-0gnt.onrender.com/api/tasks";

// MAIN ELEMENTS
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const category = document.getElementById("category");
const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("counter");
const loading = document.getElementById("loading");
const notifications = document.getElementById("notifications");
const assignedToInput = document.getElementById("assignedTo");
const deadlineInput = document.getElementById("deadline");
const remarksInput = document.getElementById("remarks");

// EDIT TASK MODAL
const editModal = document.getElementById("editModal");
const editTitle = document.getElementById("editTitle");
const editAssignedTo = document.getElementById("editAssignedTo");
const editDeadline = document.getElementById("editDeadline");
const editRemarks = document.getElementById("editRemarks");
const editCategory = document.getElementById("editCategory");
const editStatus = document.getElementById("editStatus");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
let currentTaskId = null;

// ADD SUBTASK MODAL
const addSubtaskModal = document.getElementById("addSubtaskModal");
const subtaskTitleInput = document.getElementById("subtaskTitle");
const subtaskAssignedToInput = document.getElementById("subtaskAssignedTo");
const subtaskDeadlineInput = document.getElementById("subtaskDeadline");
const subtaskRemarksInput = document.getElementById("subtaskRemarks");
const saveSubtaskBtn = document.getElementById("saveSubtaskBtn");
const cancelSubtaskBtn = document.getElementById("cancelSubtaskBtn");
let currentTaskForSubtask = null;

// EDIT SUBTASK MODAL
const editSubtaskModal = document.getElementById("editSubtaskModal");
const editSubtaskTitle = document.getElementById("editSubtaskTitle");
const editSubtaskAssignedTo = document.getElementById("editSubtaskAssignedTo");
const editSubtaskDeadline = document.getElementById("editSubtaskDeadline");
const editSubtaskRemarks = document.getElementById("editSubtaskRemarks");
const editSubtaskStatus = document.getElementById("editSubtaskStatus");
const saveSubtaskEditBtn = document.getElementById("saveSubtaskEditBtn");
const cancelSubtaskEditBtn = document.getElementById("cancelSubtaskEditBtn");
let currentTaskIdForSubtask = null;
let currentSubtaskId = null;

// NOTIFICATIONS
function showNotification(message, type) {
  const div = document.createElement("div");
  div.className = `notification ${type}`;
  div.textContent = message;
  notifications.appendChild(div);
  setTimeout(() => { div.remove(); }, 2000);
}

// LOADING STATE
function showLoading() { loading.style.display = "block"; }
function hideLoading() { loading.style.display = "none"; }

// LOAD TASKS FROM API
async function loadTasks() {
  try {
    showLoading();
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    showNotification("Failed to load tasks", "error");
  } finally {
    hideLoading();
  }
}

// RENDER TASKS & SUBTASKS TO THE BOARD
function renderTasks(tasks) {
  list.innerHTML = "";
  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = filterCategory.value;

  const filteredTasks = tasks.filter(task => {
    return (
      task.title.toLowerCase().includes(searchValue) &&
      (selectedCategory === "all" || task.category === selectedCategory)
    );
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "taskItem";

    // Main Task details
    const title = document.createElement("h2");
    title.textContent = task.title;
    if (task.status === "Completed") {
      title.classList.add("completedTask");
    }
    li.appendChild(title);

    const cat = document.createElement("p");
    cat.textContent = `Category: ${task.category}`;
    li.appendChild(cat);

    const assigned = document.createElement("p");
    assigned.textContent = `Assigned To: ${task.assignedTo || "Unassigned"}`;
    li.appendChild(assigned);

    const deadline = document.createElement("p");
    deadline.textContent = `Deadline: ${task.deadline || "No deadline"}`;
    li.appendChild(deadline);

    const status = document.createElement("p");
    status.textContent = `Status: ${task.status}`;
    li.appendChild(status);

    const remarks = document.createElement("p");
    remarks.textContent = `Remarks: ${task.remarks || "None"}`;
    li.appendChild(remarks);

    // Subtasks Header
    const subtaskHeader = document.createElement("h3");
    subtaskHeader.textContent = "Subtasks";
    li.appendChild(subtaskHeader);

    const subtaskList = document.createElement("ul");
    subtaskList.className = "subtaskList";

    if (task.subtasks && task.subtasks.length > 0) {
      task.subtasks.forEach(sub => {
        const subItem = document.createElement("li");
        subItem.className = "subtaskItem";

        const subTitle = document.createElement("p");
        subTitle.textContent = `${sub.title} | ${sub.status}`;
        if (sub.status === "Completed") {
          subTitle.classList.add("completedTask");
        }
        subItem.appendChild(subTitle);

        const subAssigned = document.createElement("p");
        subAssigned.textContent = `Assigned To: ${sub.assignedTo || "Unassigned"}`;
        subItem.appendChild(subAssigned);

        const subDeadline = document.createElement("p");
        subDeadline.textContent = `Deadline: ${sub.deadline || "No deadline"}`;
        subItem.appendChild(subDeadline);

        const subRemarks = document.createElement("p");
        subRemarks.textContent = `Remarks: ${sub.remarks || "None"}`;
        subItem.appendChild(subRemarks);

        // Subtask Actions
        const subBtnGroup = document.createElement("div");
        subBtnGroup.className = "btnGroup";

        const completeSubBtn = document.createElement("button");
        completeSubBtn.textContent = "Complete";
        completeSubBtn.addEventListener("click", async () => {
          try {
            await fetch(`${API_URL}/${task.id}/subtasks/${sub.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...sub, status: "Completed" })
            });
            showNotification("Subtask Completed", "success");
            loadTasks();
          } catch (error) {
            showNotification("Failed to complete subtask", "error");
          }
        });

        const editSubBtn = document.createElement("button");
        editSubBtn.textContent = "Edit";
        editSubBtn.className = "editBtn";
        editSubBtn.addEventListener("click", () => {
          currentTaskIdForSubtask = task.id;
          currentSubtaskId = sub.id;
          editSubtaskTitle.value = sub.title || "";
          editSubtaskAssignedTo.value = sub.assignedTo || "";
          editSubtaskDeadline.value = sub.deadline || "";
          editSubtaskRemarks.value = sub.remarks || "";
          editSubtaskStatus.value = sub.status || "Pending";
          editSubtaskModal.style.display = "flex";
        });

        const deleteSubBtn = document.createElement("button");
        deleteSubBtn.textContent = "Delete";
        deleteSubBtn.className = "deleteBtn";
        deleteSubBtn.addEventListener("click", async () => {
          try {
            await fetch(`${API_URL}/${task.id}/subtasks/${sub.id}`, { method: "DELETE" });
            showNotification("Subtask Deleted", "success");
            loadTasks();
          } catch (error) {
            showNotification("Failed to delete subtask", "error");
          }
        });

        subBtnGroup.append(completeSubBtn, editSubBtn, deleteSubBtn);
        subItem.appendChild(subBtnGroup);
        subtaskList.appendChild(subItem);
      });
    }
    li.appendChild(subtaskList);

    // Main Task Actions
    const btnGroup = document.createElement("div");
    btnGroup.className = "btnGroup";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.addEventListener("click", async () => {
      try {
        await fetch(`${API_URL}/${task.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed" })
        });
        showNotification("Task Completed", "success");
        loadTasks();
      } catch (error) {
        showNotification("Failed to complete task", "error");
      }
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "editBtn";
    editBtn.addEventListener("click", () => {
      currentTaskId = task.id;
      editTitle.value = task.title || "";
      editAssignedTo.value = task.assignedTo || "";
      editDeadline.value = task.deadline || "";
      editRemarks.value = task.remarks || "";
      editCategory.value = task.category || "Work";
      editStatus.value = task.status || "Pending";
      editModal.style.display = "flex";
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "deleteBtn";
    deleteBtn.addEventListener("click", async () => {
      try {
        await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
        showNotification("Task Deleted", "success");
        loadTasks();
      } catch (error) {
        showNotification("Failed to delete task", "error");
      }
    });

    const addSubtaskBtn = document.createElement("button");
    addSubtaskBtn.textContent = "+ Subtask";
    addSubtaskBtn.addEventListener("click", () => {
      currentTaskForSubtask = task.id;
      subtaskTitleInput.value = "";
      subtaskAssignedToInput.value = "";
      subtaskDeadlineInput.value = "";
      subtaskRemarksInput.value = "";
      addSubtaskModal.style.display = "flex";
    });

    btnGroup.append(completeBtn, editBtn, deleteBtn, addSubtaskBtn);
    li.appendChild(btnGroup);
    list.appendChild(li);
  });

  updateCounter(filteredTasks);
}

// SAVE DATA SUBMISSIONS (Modals & Forms)
saveEditBtn.onclick = async () => {
  try {
    await fetch(`${API_URL}/${currentTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle.value,
        assignedTo: editAssignedTo.value,
        deadline: editDeadline.value,
        remarks: editRemarks.value,
        category: editCategory.value,
        status: editStatus.value
      })
    });
    showNotification("Task Updated", "success");
    editModal.style.display = "none";
    loadTasks();
  } catch (error) {
    showNotification("Failed to update task", "error");
  }
};

cancelEditBtn.onclick = () => { editModal.style.display = "none"; };

saveSubtaskBtn.onclick = async () => {
  try {
    await fetch(`${API_URL}/${currentTaskForSubtask}/subtasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: subtaskTitleInput.value,
        assignedTo: subtaskAssignedToInput.value,
        deadline: subtaskDeadlineInput.value,
        remarks: subtaskRemarksInput.value
      })
    });
    showNotification("Subtask Added", "success");
    addSubtaskModal.style.display = "none";
    loadTasks();
  } catch (error) {
    showNotification("Failed to add subtask", "error");
  }
};

cancelSubtaskBtn.onclick = () => { addSubtaskModal.style.display = "none"; };

saveSubtaskEditBtn.onclick = async () => {
  try {
    await fetch(`${API_URL}/${currentTaskIdForSubtask}/subtasks/${currentSubtaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editSubtaskTitle.value,
        assignedTo: editSubtaskAssignedTo.value,
        deadline: editSubtaskDeadline.value,
        remarks: editSubtaskRemarks.value,
        status: editSubtaskStatus.value
      })
    });
    showNotification("Subtask Updated", "success");
    editSubtaskModal.style.display = "none";
    loadTasks();
  } catch (error) {
    showNotification("Failed to update subtask", "error");
  }
};

cancelSubtaskEditBtn.onclick = () => { editSubtaskModal.style.display = "none"; };

function updateCounter(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === "Completed").length;
  const pending = total - completed;
  counter.textContent = `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
}

// MAIN FORM SUBMIT EVENT
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return;

  try {
    showLoading();
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: taskText,
        category: category.value,
        assignedTo: assignedToInput.value,
        deadline: deadlineInput.value,
        remarks: remarksInput.value
      })
    });
    showNotification("Task Added", "success");
    form.reset();
    loadTasks();
  } catch (error) {
    showNotification("Failed to add task", "error");
  } finally {
    hideLoading();
  }
});

// EVENT LISTENERS
filterCategory.addEventListener("change", loadTasks);
searchInput.addEventListener("input", loadTasks);

// INITIAL LAYOUT EXECUTION
loadTasks();