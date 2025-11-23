import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import ChartCard from "../components/ChartCard/ChartCard";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import styles from "./InstructorDashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function InstructorDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("overview");

  // --- Sample interactive state (frontend-only) ---
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Web Development",
      code: "CS301",
      students: [
        { id: 1, name: "Layla", grade: 86 },
        { id: 2, name: "Hassan", grade: 74 },
        { id: 3, name: "Rana", grade: 92 },
      ],
      schedule: "Mon/Wed 10:00-11:30",
      room: "205",
    },
    {
      id: 2,
      name: "Databases",
      code: "CS210",
      students: [
        { id: 4, name: "Ali", grade: 80 },
        { id: 5, name: "Maya", grade: 88 },
      ],
      schedule: "Tue/Thu 14:00-15:30",
      room: "101",
    },
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      courseId: 1,
      title: "Final Project",
      dueDate: "2025-12-20",
      submissions: [
        { studentId: 1, studentName: "Layla", submittedAt: "2025-11-20", grade: null },
        { studentId: 2, studentName: "Hassan", submittedAt: "2025-11-22", grade: null },
      ],
    },
  ]);

  const [sessions, setSessions] = useState([
    { id: 1, courseId: 1, course: "Web Development", date: "2025-11-10", time: "14:00", link: "https://zoom.us/j/111111111" },
  ]);

  const [officeHours, setOfficeHours] = useState([
    { id: 1, courseId: 1, doctor: "You", day: "Wed", time: "09:00-10:00", room: "205" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Reminder: Grades submission deadline next week.", date: "2025-11-01" },
  ]);

  // --- Derived chart data (ready for backend replacement) ---
  const coursePerformance = useMemo(() => {
    const labels = courses.map(c => c.name);
    const avgGrades = courses.map(c => {
      if (!c.students || !c.students.length) return 0;
      const s = c.students.reduce((acc, st) => acc + (st.grade || 0), 0);
      return Math.round(s / c.students.length);
    });
    return {
      labels,
      datasets: [
        { label: "Avg Grade (%)", data: avgGrades, backgroundColor: "#4F46E5" },
      ],
    };
  }, [courses]);

  const engagementData = useMemo(() => {
    // mock daily logins / activities for chart
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        { label: "Student Activity", data: [30, 45, 38, 55, 60], borderColor: "#10B981", fill: false },
      ],
    };
  }, []);

  const gradeDistribution = useMemo(() => {
    // collect all student grades across courses
    const allGrades = courses.flatMap(c => (c.students || []).map(s => s.grade || 0));
    // create simple buckets A/B/C/D/F
    const buckets = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    allGrades.forEach(g => {
      if (g >= 85) buckets.A++;
      else if (g >= 75) buckets.B++;
      else if (g >= 65) buckets.C++;
      else if (g >= 50) buckets.D++;
      else buckets.F++;
    });
    return {
      labels: ["A (≥85)", "B (75–84)", "C (65–74)", "D (50–64)", "F (<50)"],
      datasets: [{ data: Object.values(buckets), backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#F97316", "#EF4444"] }],
    };
  }, [courses]);

  // --- Actions (all simulated frontend-only) ---
  const addCourse = () => {
    const name = prompt("Course name:");
    const code = prompt("Course code:");
    if (!name || !code) return alert("Creation cancelled.");
    const nextId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    setCourses([...courses, { id: nextId, name, code, students: [], schedule: "", room: "" }]);
    alert("Course created (simulated).");
  };

  const createAssignment = () => {
    const courseId = parseInt(prompt("Course ID to assign to (numeric):"), 10);
    const title = prompt("Assignment title:");
    const dueDate = prompt("Due date (YYYY-MM-DD):");
    if (!courseId || !title || !dueDate) return alert("Cancelled / incomplete.");
    const nextId = assignments.length ? Math.max(...assignments.map(a => a.id)) + 1 : 1;
    setAssignments([...assignments, { id: nextId, courseId, title, dueDate, submissions: [] }]);
    alert("Assignment created (simulated).");
  };

  const viewSubmissions = (assignment) => {
    const list = assignment.submissions.map(s => `${s.studentName} — submitted: ${s.submittedAt} — grade: ${s.grade ?? "N/A"}`).join("\n");
    alert(list || "No submissions yet.");
  };

  const gradeSubmission = (assignment, studentId) => {
    const grade = prompt("Enter grade for student (0-100):");
    if (grade === null) return;
    setAssignments(assignments.map(a => {
      if (a.id !== assignment.id) return a;
      return {
        ...a,
        submissions: a.submissions.map(s => s.studentId === studentId ? { ...s, grade: Number(grade) } : s),
      };
    }));
    alert("Grade assigned (simulated).");
  };

  const startSession = (s) => {
    // opens the session link in a new tab (simulated start)
    if (s.link) window.open(s.link, "_blank", "noopener,noreferrer");
    else alert("No link configured for this session.");
  };

  const addSession = () => {
    const courseId = parseInt(prompt("Course ID:"), 10);
    const course = courses.find(c => c.id === courseId);
    if (!course) return alert("Invalid course ID.");
    const date = prompt("Date (YYYY-MM-DD):");
    const time = prompt("Time (HH:MM):");
    const link = prompt("Session link (URL):");
    if (!date || !time) return alert("Cancelled.");
    const nextId = sessions.length ? Math.max(...sessions.map(s => s.id)) + 1 : 1;
    setSessions([...sessions, { id: nextId, courseId, course: course.name, date, time, link }]);
    alert("Session created (simulated).");
  };

  const addOfficeHour = () => {
    const courseId = parseInt(prompt("Course ID:"), 10);
    const course = courses.find(c => c.id === courseId);
    if (!course) return alert("Invalid course ID.");
    const day = prompt("Day (e.g. Mon):");
    const time = prompt("Time (e.g. 10:00-11:00):");
    const room = prompt("Room:");
    const nextId = officeHours.length ? Math.max(...officeHours.map(o => o.id)) + 1 : 1;
    setOfficeHours([...officeHours, { id: nextId, courseId, doctor: "You", course: course.name, day, time, room }]);
    alert("Office hour added (simulated).");
  };

  const postNotification = () => {
    const message = prompt("Notification message:");
    if (!message) return;
    const nextId = notifications.length ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
    setNotifications([{ id: nextId, message, date: new Date().toISOString().slice(0, 10) }, ...notifications]);
    alert("Notification posted (simulated).");
  };

  const removeCourse = (id) => {
    if (!window.confirm("Remove course? This action is simulated.")) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  // --- Render ---
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        links={[
          { id: "overview", label: "Overview" },
          { id: "courses", label: "Courses" },
          { id: "assignments", label: "Assignments" },
          { id: "sessions", label: "Sessions" },
          { id: "exams", label: "Exams" },
          { id: "officeHours", label: "Office Hours" },
          { id: "notifications", label: "Notifications" },
          { id: "chat", label: "Chat" },
        ]}
        active={activePage}
        onLinkClick={setActivePage}
      />

      <main style={{ flexGrow: 1, padding: 20 }}>
        <Navbar title="Instructor Dashboard" onLogout={onLogout} role="Instructor" />

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Overview */}
          {activePage === "overview" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
                <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
                  <h3>Teaching Load</h3>
                  <p>{courses.length} courses — {courses.reduce((acc,c)=>acc + (c.students?.length||0),0)} students total</p>
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <button className={styles.primaryBtn} onClick={addCourse}>Add Course</button>
                    <button className={styles.primaryBtn} onClick={createAssignment}>Create Assignment</button>
                  </div>
                </div>

                <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
                  <h3>Avg Grades (per course)</h3>
                  <ChartCard>
                    <Bar data={coursePerformance} />
                  </ChartCard>
                </div>

                <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
                  <h3>Grade Distribution</h3>
                  <ChartCard>
                    <Pie data={gradeDistribution} />
                  </ChartCard>
                </div>

                <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
                  <h3>Student Engagement</h3>
                  <ChartCard>
                    <Line data={engagementData} />
                  </ChartCard>
                </div>
              </div>
            </>
          )}

          {/* Courses */}
          {activePage === "courses" && (
            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <h2>Courses</h2>
              <div style={{ marginBottom: 8 }}>
                <button className={styles.primaryBtn} onClick={addCourse}>Create Course</button>
              </div>
              {courses.length === 0 ? <p>No courses yet.</p> : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {courses.map(c => (
                    <li key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eef2f7" }}>
                      <div>
                        <strong>{c.name}</strong> — {c.code} <br />
                        {c.schedule} — Room {c.room} — {c.students?.length ?? 0} students
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className={styles.primaryBtn} onClick={() => alert(`Manage course ${c.name} (simulated).`)}>Manage</button>
                        <button className={styles.dangerBtn} onClick={() => removeCourse(c.id)}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Assignments */}
          {activePage === "assignments" && (
            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <h2>Assignments</h2>
              <div style={{ marginBottom: 8 }}>
                <button className={styles.primaryBtn} onClick={createAssignment}>Create Assignment</button>
              </div>
              {assignments.length === 0 ? <p>No assignments created.</p> : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {assignments.map(a => (
                    <li key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eef2f7" }}>
                      <div>
                        <strong>{a.title}</strong> — Course ID: {a.courseId} — Due: {a.dueDate}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className={styles.primaryBtn} onClick={() => viewSubmissions(a)}>View Submissions</button>
                        <button className={styles.primaryBtn} onClick={() => {
                          const studentId = parseInt(prompt("Student ID to grade (numeric):"), 10);
                          if (!isNaN(studentId)) gradeSubmission(a, studentId);
                        }}>Grade</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Sessions */}
          {activePage === "sessions" && (
            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <h2>Sessions</h2>
              <div style={{ marginBottom: 8 }}>
                <button className={styles.primaryBtn} onClick={addSession}>Create Session</button>
              </div>
              {sessions.length === 0 ? <p>No sessions scheduled.</p> : (
                <ul className={styles.list}>
                  {sessions.map(s => (
                    <li key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{s.course}</strong> — {s.date} {s.time}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className={styles.primaryBtn} onClick={() => startSession(s)}>Start</button>
                        <button className={styles.primaryBtn} onClick={() => {
                          const newLink = prompt("Update link (leave blank to keep):", s.link || "");
                          if (newLink !== null) setSessions(sessions.map(x => x.id === s.id ? { ...x, link: newLink || x.link } : x));
                        }}>Edit</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Exams */}
          {activePage === "exams" && (
            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <h2>Exams</h2>
              <p>Exam schedule management would be here (upload / edit). Currently simulated.</p>
            </div>
          )}

          {/* Office Hours */}
          {activePage === "officeHours" && (
            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <h2>Office Hours</h2>
              <div style={{ marginBottom: 8 }}>
                <button className={styles.primaryBtn} onClick={addOfficeHour}>Add Office Hour</button>
              </div>
              {officeHours.length === 0 ? <p>No office hours defined.</p> : (
                <ul className={styles.list}>
                  {officeHours.map(o => (
                    <li key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><strong>{o.doctor}</strong> — {o.course} — {o.day} {o.time} — Room {o.room}</div>
                      <button className={styles.primaryBtn} onClick={() => alert(`Edit Office Hour ${o.id} (simulated).`)}>Edit</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Notifications */}
          {activePage === "notifications" && (
            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <h2>Notifications</h2>
              <div style={{ marginBottom: 8 }}>
                <button className={styles.primaryBtn} onClick={postNotification}>Post Announcement</button>
              </div>
              {notifications.length === 0 ? <p>No announcements.</p> : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {notifications.map(n => (
                    <li key={n.id} style={{ padding: "8px 0", borderBottom: "1px solid #eef2f7" }}>
                      <div><strong>{n.date}</strong> — {n.message}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Chat */}
          {activePage === "chat" && (
            <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
              <h2>Chat</h2>
              <p>Simple instructor messaging panel (replace with real-time chat later).</p>
              <div>
                <textarea placeholder="Type message to students or admin..." style={{ width: "100%", minHeight: 80, padding: 8, borderRadius: 6 }}></textarea>
                <div style={{ marginTop: 8 }}>
                  <button className={styles.primaryBtn} onClick={() => alert("Message sent (simulated).")}>Send</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
