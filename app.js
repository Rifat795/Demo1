const datasets = {
  Students: {
    description: "Manage student records, enrollment, and academic information.",
    columns: ["Student", "Student ID", "Grade", "Guardian", "Status"],
    rows: [
      ["Olivia Bennett", "ST-2048", "Grade 8-A", "Sarah Bennett", "Active"],
      ["Noah Williams", "ST-2047", "Grade 10-B", "Daniel Williams", "Active"],
      ["Emma Wilson", "ST-2046", "Grade 6-C", "Rachel Wilson", "Active"],
      ["Liam Chen", "ST-2045", "Grade 9-A", "Mei Chen", "Active"],
      ["Ava Thompson", "ST-2044", "Grade 7-B", "Robert Thompson", "Pending"],
      ["Ethan Patel", "ST-2043", "Grade 11-A", "Priya Patel", "Active"]
    ]
  },
  Teachers: {
    description: "Your faculty directory and staff information.",
    columns: ["Teacher", "Staff ID", "Department", "Email", "Status"],
    rows: [
      ["James Carter", "TC-0104", "Mathematics", "j.carter@northwood.edu", "Active"],
      ["Sophia Martinez", "TC-0103", "English", "s.martinez@northwood.edu", "Active"],
      ["Daniel Kim", "TC-0102", "Science", "d.kim@northwood.edu", "Active"],
      ["Amelia Johnson", "TC-0101", "History", "a.johnson@northwood.edu", "Active"]
    ]
  },
  Classes: {
    description: "Browse class sections, grade levels, and homeroom teachers.",
    columns: ["Class", "Grade", "Teacher", "Students", "Room"],
    rows: [
      ["Grade 8-A", "Grade 8", "James Carter", "28", "Room 204"],
      ["Grade 10-B", "Grade 10", "Sophia Martinez", "24", "Room 310"],
      ["Grade 6-C", "Grade 6", "Daniel Kim", "26", "Room 112"],
      ["Grade 9-A", "Grade 9", "Amelia Johnson", "22", "Room 208"]
    ]
  },
  Attendance: {
    description: "Daily attendance records and student presence.",
    columns: ["Class", "Teacher", "Present", "Absent", "Rate"],
    rows: [
      ["Grade 8-A", "James Carter", "27", "1", "96.4%"],
      ["Grade 10-B", "Sophia Martinez", "22", "2", "91.7%"],
      ["Grade 6-C", "Daniel Kim", "26", "0", "100%"],
      ["Grade 9-A", "Amelia Johnson", "20", "2", "90.9%"]
    ]
  },
  "Exams & grades": {
    description: "Review assessments, results, and upcoming exams.",
    columns: ["Assessment", "Class", "Date", "Submissions", "Status"],
    rows: [
      ["Mid-term Mathematics", "Grade 10-B", "Oct 28, 2024", "22 / 24", "Active"],
      ["English Literature", "Grade 8-A", "Oct 30, 2024", "28 / 28", "Active"],
      ["Science Project", "Grade 6-C", "Nov 04, 2024", "18 / 26", "Pending"],
      ["World History", "Grade 9-A", "Nov 06, 2024", "22 / 22", "Active"]
    ]
  },
  Finance: {
    description: "Track tuition payments and outstanding balances.",
    columns: ["Student", "Description", "Due date", "Amount", "Status"],
    rows: [
      ["Emma Wilson", "Tuition · Term 1", "Oct 30, 2024", "$1,200", "Active"],
      ["Noah Williams", "Tuition · Term 1", "Oct 30, 2024", "$1,200", "Pending"],
      ["Olivia Bennett", "Activity fee", "Nov 02, 2024", "$180", "Active"],
      ["Ava Thompson", "Tuition · Term 1", "Oct 30, 2024", "$1,200", "Pending"]
    ]
  },
  Calendar: {
    description: "Keep track of school events, meetings, and important dates.",
    columns: ["Event", "Date", "Time", "Location", "Type"],
    rows: [
      ["Morning assembly", "Oct 24, 2024", "08:30 AM", "Main auditorium", "School"],
      ["Staff meeting", "Oct 24, 2024", "10:00 AM", "Conference room", "Meeting"],
      ["Parent-teacher conference", "Oct 24, 2024", "01:30 PM", "Room 204", "Parents"],
      ["Mid-term examinations", "Oct 28, 2024", "All day", "Exam halls", "Academic"]
    ]
  },
  Messages: {
    description: "Recent announcements and messages from your school community.",
    columns: ["Subject", "From", "Date", "Audience", "Status"],
    rows: [
      ["Grade 8 field trip reminder", "Sophia Martinez", "Today, 9:42 AM", "Grade 8 parents", "Active"],
      ["Mid-term exam schedule", "Academic office", "Yesterday", "All families", "Active"],
      ["October newsletter", "Northwood Academy", "Oct 21, 2024", "All families", "Active"]
    ]
  },
  Settings: {
    description: "School workspace settings and administrator preferences.",
    columns: ["Setting", "Description", "Value"],
    rows: [
      ["School name", "Name shown to your school community", "Northwood Academy"],
      ["Academic year", "Current academic year", "2024–2025"],
      ["Time zone", "Used for schedules and notifications", "Eastern Time (ET)"],
      ["Attendance reminders", "Automatic daily attendance reminders", "Enabled"]
    ]
  }
};

const pageContent = document.getElementById("page-content");
const breadcrumb = document.getElementById("breadcrumb-current");
const searchInput = document.getElementById("search-input");
const toast = document.getElementById("toast");
const dashboardMarkup = pageContent.innerHTML;
let currentPage = "Overview";
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function renderPage(page) {
  currentPage = page;
  breadcrumb.textContent = page;
  document.querySelectorAll(".nav-item").forEach((item) => {
    const active = item.dataset.page === page;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  if (page === "Overview") {
    pageContent.innerHTML = dashboardMarkup;
    bindDashboardActions();
    return;
  }

  const dataset = datasets[page];
  if (!dataset) return;
  const title = page === "Exams & grades" ? "Exams & grades" : page;
  pageContent.innerHTML = `
    <section class="data-view panel">
      <div class="view-heading">
        <div><h2>${title}</h2><p>${dataset.description}</p></div>
        ${page === "Students" ? '<button class="button button-primary" id="add-student"><span>＋</span> Add student</button>' : ""}
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>${dataset.columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
          <tbody id="table-body"></tbody>
        </table>
        <div class="empty-state" id="empty-state" hidden><strong>No matching records</strong>Try adjusting your search.</div>
      </div>
    </section>
    <footer class="page-footer"><span>© 2024 Classroom</span><span>Made for better learning <i>♥</i></span></footer>`;
  renderRows();
  const addButton = document.getElementById("add-student");
  if (addButton) addButton.addEventListener("click", openStudentDialog);
}

function renderRows() {
  const dataset = datasets[currentPage];
  if (!dataset) return;
  const query = searchInput.value.trim().toLowerCase();
  const rows = dataset.rows.filter((row) => row.some((value) => value.toLowerCase().includes(query)));
  const tbody = document.getElementById("table-body");
  const emptyState = document.getElementById("empty-state");
  if (!tbody || !emptyState) return;
  emptyState.hidden = rows.length > 0;
  tbody.innerHTML = rows.map((row) => `<tr>${row.map((cell, index) => {
    if (index === 0 && currentPage !== "Settings") {
      const initials = cell.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
      return `<td><span class="person-cell"><span class="table-avatar">${escapeHTML(initials)}</span>${escapeHTML(cell)}</span></td>`;
    }
    if (cell === "Active" || cell === "Pending") {
      return `<td><span class="status-pill${cell === "Pending" ? " pending" : ""}">${escapeHTML(cell)}</span></td>`;
    }
    return `<td>${escapeHTML(cell)}</td>`;
  }).join("")}</tr>`).join("");
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function openStudentDialog() {
  document.getElementById("student-dialog").showModal();
  document.querySelector("#student-form [name='name']").focus();
}

function bindDashboardActions() {
  const reportButton = document.getElementById("report-button");
  if (reportButton) reportButton.addEventListener("click", () => showToast("Your school report is being prepared."));

  const periodButton = document.getElementById("period-button");
  if (periodButton) {
    periodButton.addEventListener("click", () => {
      const options = ["This week", "This month", "This semester"];
      const next = (options.indexOf(periodButton.firstChild.textContent.trim()) + 1) % options.length;
      periodButton.firstChild.textContent = options[next] + " ";
      showToast(`Showing attendance for ${options[next].toLowerCase()}.`);
    });
  }

  pageContent.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => renderPage(button.dataset.page));
  });
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    renderPage(button.dataset.page);
  });
});

searchInput.addEventListener("input", () => {
  if (currentPage !== "Overview") renderRows();
});

document.getElementById("support-button").addEventListener("click", () => showToast("Help center is ready to connect."));
document.querySelector(".switcher-arrow").addEventListener("click", () => showToast("You’re viewing Northwood Academy."));
document.querySelector(".profile-button").addEventListener("click", () => showToast("Administrator profile"));
document.querySelector(".dialog-close").addEventListener("click", () => document.getElementById("student-dialog").close());
document.getElementById("cancel-student").addEventListener("click", () => document.getElementById("student-dialog").close());
document.getElementById("student-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = formData.get("name").trim();
  const grade = formData.get("grade").trim();
  const guardian = formData.get("guardian").trim();
  const nextId = 2048 + datasets.Students.rows.length;
  datasets.Students.rows.unshift([name, `ST-${nextId}`, grade, guardian, "Active"]);
  event.currentTarget.reset();
  document.getElementById("student-dialog").close();
  searchInput.value = "";
  renderPage("Students");
  showToast(`${name} was added to the student list.`);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

bindDashboardActions();
