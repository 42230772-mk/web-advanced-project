// src/pages/StudentDashboard.jsx
import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import ChartCard from "../components/ChartCard/ChartCard";
import Navbar from "../components/Navbar/Navbar";
import StudentChat from "../components/StudentChat/StudentChat";
import { jsPDF } from "jspdf";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import styles from "./StudentDashboard.module.css";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function StudentDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("home");

  // Sessions data
  const [sessions] = useState([
    { id: 1, course: "React Basics", date: "2025-11-05", time: "10:00 AM", link: "https://zoom.us/j/1234567890" },
    { id: 2, course: "Node.js Advanced", date: "2025-11-07", time: "2:00 PM", link: "https://zoom.us/j/0987654321" },
  ]);

  // Exams data
  const [exams] = useState([
    { id: 1, course: "React Basics", date: "2025-11-15", room: "101" },
    { id: 2, course: "Node.js Advanced", date: "2025-11-20", room: "202" },
    { id: 3, course: "Python Fundamentals", date: "2025-11-25", room: "303" },
  ]);

  // Office Hours data
  const [officeHours] = useState([
    { id: 1, doctor: "Dr. Karim", course: "React Basics", day: "Mon", time: "10:00-12:00", room: "101" },
    { id: 2, doctor: "Dr. Layla", course: "Node.js Advanced", day: "Wed", time: "14:00-16:00", room: "202" },
  ]);

  // Notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, type: "Room Update", message: "Room for React Basics changed to 105.", date: "2025-11-01", read: false },
    { id: 2, type: "Assignment Due", message: "Assignment 2 for Node.js Advanced is due tomorrow.", date: "2025-11-03", read: false },
    { id: 3, type: "Session Reminder", message: "React Basics session tomorrow at 10:00 AM.", date: "2025-11-04", read: false },
  ]);

  // Courses data
  const [courses] = useState([
    { id: 1, name: "React Basics", instructor: "Dr. Karim", schedule: "Mon/Wed 10:00-11:30", room: "105", grade: 85 },
    { id: 2, name: "Node.js Advanced", instructor: "Dr. Layla", schedule: "Tue/Thu 14:00-15:30", room: "202", grade: 78 },
    { id: 3, name: "Python Fundamentals", instructor: "Dr. Sami", schedule: "Fri 09:00-12:00", room: "303", grade: 90 },
  ]);

  // Assignments data (now with setter so we can toggle submitted)
  const [assignments, setAssignments] = useState([
    { id: 1, course: "React Basics", title: "Assignment 1", dueDate: "2025-11-10", submitted: true },
    { id: 2, course: "React Basics", title: "Assignment 2", dueDate: "2025-11-17", submitted: false },
    { id: 3, course: "Node.js Advanced", title: "Assignment 1", dueDate: "2025-11-12", submitted: true },
    { id: 4, course: "Python Fundamentals", title: "Assignment 1", dueDate: "2025-11-14", submitted: false },
  ]);

  // Track uploaded submissions: { [assignmentId]: { name, url, uploadedAt } }
  const [submissions, setSubmissions] = useState({});

  // Hidden file input ref + current assignment id being uploaded
  const fileInputRef = useRef(null);
  const [currentUploadId, setCurrentUploadId] = useState(null);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Download exams schedule as PDF
  const downloadExamSchedulePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Exam Schedule", 20, 20);
    exams.forEach((exam, index) => {
      doc.text(`${index + 1}. ${exam.course} — ${exam.date} — Room ${exam.room}`, 20, 30 + index * 10);
    });
    doc.save("exam_schedule.pdf");
  };

  // Apply Petition handler
  const applyPetition = (exam) => {
    alert(`Petition applied for ${exam.course} exam on ${exam.date}`);
  };

  // Book office hour slot
  const bookOfficeHour = (slot) => {
    alert(`You booked a slot with ${slot.doctor} for ${slot.course} on ${slot.day} at ${slot.time}`);
  };

  // View grade
  const viewGrade = (course) => {
    alert(`Your grade for ${course.name}: ${course.grade}`);
  };

  // Trigger file input to upload for a specific assignment
  const triggerUpload = (assignment) => {
    setCurrentUploadId(assignment.id);
    if (fileInputRef.current) fileInputRef.current.value = null; // reset
    fileInputRef.current && fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || currentUploadId === null) return;
    // create object URL to allow download in this demo
    const url = URL.createObjectURL(file);
    const uploadedAt = new Date().toISOString();
    setSubmissions(prev => ({ ...prev, [currentUploadId]: { name: file.name, url, uploadedAt } }));
    // mark assignment submitted
    setAssignments(prev => prev.map(a => a.id === currentUploadId ? { ...a, submitted: true } : a));
    setCurrentUploadId(null);
    alert(`Uploaded "${file.name}" (simulated).`);
  };

  // Download submitted file for an assignment
  const downloadSubmission = (assignmentId) => {
    const sub = submissions[assignmentId];
    if (!sub) return alert("No submission found for this assignment.");
    const a = document.createElement("a");
    a.href = sub.url;
    a.download = sub.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Fallback: download assignment description (simulated)
  const downloadAssignment = (assignment) => {
    // if student submitted, allow downloading their submission
    if (submissions[assignment.id]) {
      downloadSubmission(assignment.id);
      return;
    }
    // otherwise create a small txt file simulating assignment brief
    const text = `Assignment: ${assignment.title}\nCourse: ${assignment.course}\nDue: ${assignment.dueDate}\n\n(This is a simulated download.)`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assignment.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Prepare data for Overview pie chart
  const gradeData = {
    labels: courses.map(c => c.name),
    datasets: [
      {
        label: "Grades",
        data: courses.map(c => c.grade),
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B"],
        borderWidth: 1,
      },
    ],
  };

  // Next upcoming assignment
  const nextAssignment = assignments.filter(a => !a.submitted).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  // Next upcoming session
  const nextSession = sessions.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  // Next exam
  const nextExam = exams.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <div className={styles.dashboard}>
      {/* Hidden file input used for uploading assignment files */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.zip,.txt"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      <Sidebar
        links={[
          { id: "home", label: "Overview" },
          { id: "courses", label: "My Courses" },
          { id: "assignments", label: "Assignments" },
          { id: "chat", label: "Chat" },
          { id: "sessions", label: "Sessions" },
          { id: "exams", label: "Exams" },
          { id: "officeHours", label: "Office Hours" },
          { id: "notifications", label: "Notifications" },
        ]}
        active={activePage}
        onLinkClick={setActivePage}
      />

      <main className={styles.mainContent}>
        <Navbar title="Student Dashboard" onLogout={onLogout} role="Student" />
        <div className={styles.content}>
          {activePage === "home" && (
            <div className={styles.section}>
              <h2>Overview</h2>
              <ChartCard title="Grades Overview (Pie Chart)">
                <Pie data={gradeData} />
              </ChartCard>
              {nextAssignment && (
                <p><strong>Next Assignment:</strong> {nextAssignment.title} ({nextAssignment.course}) — Due {nextAssignment.dueDate}</p>
              )}
              {nextSession && (
                <p><strong>Next Session:</strong> {nextSession.course} on {nextSession.date} at {nextSession.time}</p>
              )}
              {nextExam && (
                <p><strong>Next Exam:</strong> {nextExam.course} on {nextExam.date} — Room {nextExam.room}</p>
              )}
            </div>
          )}

          {/* My Courses Tab */}
          {activePage === "courses" && (
            <div className={styles.section}>
              <h2>My Courses</h2>
              {courses.length === 0 ? (
                <p>You are not enrolled in any courses.</p>
              ) : (
                <ul className={styles.list}>
                  {courses.map(course => (
                    <li key={course.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{course.name}</strong> — {course.instructor} <br />
                        Schedule: {course.schedule} — Room {course.room}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className={styles.primaryBtn} onClick={() => alert(`View materials for ${course.name}`)}>View Materials</button>
                        {sessions.some(s => s.course === course.name) && (
                          <a href={sessions.find(s => s.course === course.name).link} target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
                            Join Session
                          </a>
                        )}
                        <button className={styles.primaryBtn} onClick={() => viewGrade(course)}>View Grade</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activePage === "assignments" && (
            <div className={styles.section}>
              <h2>Assignments</h2>
              {assignments.length === 0 ? (
                <p>No assignments available.</p>
              ) : (
                <ul className={styles.list}>
                  {assignments.map((a) => (
                    <li key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{a.title}</strong> — {a.course} — Due: {a.dueDate} — Status: {a.submitted ? "Submitted" : "Not Submitted"}
                        {submissions[a.id] && (
                          <div className={styles.tiny} style={{ marginTop: 6 }}>
                            Submitted: {submissions[a.id].name} — {new Date(submissions[a.id].uploadedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className={styles.primaryBtn} onClick={() => triggerUpload(a)}>{a.submitted ? "Re-upload" : "Upload"}</button>
                        <button className={styles.primaryBtn} onClick={() => downloadAssignment(a)}>Download</button>
                        {submissions[a.id] && (
                          <button className={styles.primaryBtn} onClick={() => downloadSubmission(a.id)}>Download Submission</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {activePage === "chat" && (
            <div className={styles.section}>
              <h2>Chat with Instructor/Admin</h2>
              <StudentChat />
            </div>
          )}

          {/* Sessions Tab */}
          {activePage === "sessions" && (
            <div className={styles.section}>
              <h2>Online Sessions</h2>
              {sessions.length === 0 ? <p>No upcoming sessions.</p> : (
                <ul className={styles.list}>
                  {sessions.map((s) => (
                    <li key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span><strong>{s.course}</strong> — {s.date} at {s.time}</span>
                      <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px", color: "#0b69ff" }}>Join</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Exams Tab */}
          {activePage === "exams" && (
            <div className={styles.section}>
              <h2>Upcoming Exams</h2>
              {exams.length === 0 ? <p>No upcoming exams.</p> : (
                <>
                  <ul className={styles.list}>
                    {exams.map((exam) => (
                      <li key={exam.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span><strong>{exam.course}</strong> — {exam.date} — Room {exam.room}</span>
                        <button className={styles.primaryBtn} onClick={() => applyPetition(exam)}>Apply Petition</button>
                      </li>
                    ))}
                  </ul>
                  <button className={styles.uploadBtn} onClick={downloadExamSchedulePDF}>Download Schedule (PDF)</button>
                </>
              )}
            </div>
          )}

          {/* Office Hours Tab */}
          {activePage === "officeHours" && (
            <div className={styles.section}>
              <h2>Office Hours</h2>
              {officeHours.length === 0 ? <p>No office hours available.</p> : (
                <ul className={styles.list}>
                  {officeHours.map((slot) => (
                    <li key={slot.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span><strong>{slot.doctor}</strong> — {slot.course} — {slot.day} {slot.time} — Room {slot.room}</span>
                      <button className={styles.primaryBtn} onClick={() => bookOfficeHour(slot)}>Book Slot</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activePage === "notifications" && (
            <div className={styles.section}>
              <h2>Notifications</h2>
              {notifications.length === 0 ? <p>No notifications.</p> : (
                <ul className={styles.list}>
                  {notifications.map((n) => (
                    <li key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: n.read ? "#f1f5f9" : "#fff" }}>
                      <div>
                        <strong>{n.type}:</strong> {n.message} <em>({n.date})</em>
                      </div>
                      {!n.read && <button className={styles.primaryBtn} onClick={() => markAsRead(n.id)}>Mark as Read</button>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
