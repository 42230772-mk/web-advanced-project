import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import styles from "./AdminDashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

export default function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState("overview");

  const [users, setUsers] = useState([
    { id: 1, name: "Layla", role: "Student", email: "layla@liu.edu.lb" },
    { id: 2, name: "Dr. Karim", role: "Instructor", email: "karim@liu.edu.lb" },
  ]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("Student");

  const [examUploads, setExamUploads] = useState([
    { id: 1, course: "Databases", date: "2025-12-10", room: "101" },
  ]);

  const userStats = useMemo(() => ({
    labels: ["Students", "Instructors", "Admins"],
    datasets: [{
      label: "Counts",
      data: [
        users.filter(u => u.role==="Student").length,
        users.filter(u => u.role==="Instructor").length,
        users.filter(u => u.role==="Admin").length
      ],
      backgroundColor: ["#0b69ff","#10b981","#f59e0b"]
    }]
  }), [users]);

  const activityData = useMemo(() => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{ label: "Visits", data: [450,520,610,700,680], borderColor:"#4F46E5", fill:false }]
  }), []);

  const addUser = () => {
    if(!newUserName.trim()) return alert("Enter a name");
    const nextId = users.length ? Math.max(...users.map(u=>u.id))+1 : 1;
    setUsers([...users,{id:nextId,name:newUserName.trim(),role:newUserRole,email:`${newUserName.replace(/\s/g,"").toLowerCase()}@liu.edu.lb`}]);
    setNewUserName(""); setNewUserRole("Student");
  };

  const removeUser = (id) => {
    if(!window.confirm("Remove user?")) return;
    setUsers(users.filter(u=>u.id!==id));
  };

  const uploadExam = () => {
    const course = prompt("Course name:");
    const date = prompt("Date YYYY-MM-DD:");
    const room = prompt("Room number:");
    if(!course||!date||!room) return alert("Upload canceled");
    const id = examUploads.length ? Math.max(...examUploads.map(e=>e.id))+1 : 1;
    setExamUploads([...examUploads,{id,course,date,room}]);
    alert("Exam uploaded (simulated)");
  };

  return (
    <div className={styles.container}>
      <Sidebar
        links={[
          {id:"overview", label:"Overview"},
          {id:"users", label:"Manage Users"},
          {id:"exams", label:"Exam Schedules"},
          {id:"reports", label:"Analytics"}
        ]}
        active={activePage}
        onLinkClick={setActivePage}
      />

      <main className={styles.main}>
        <Navbar onLogout={onLogout} role="Admin" />
        <div className={styles.content}>
          {activePage==="overview" && <>
            <section className={styles.grid}>
              <div className={styles.card}>
                <h3>Total Users</h3>
                <div className={styles.bigStat}>{users.length}</div>
              </div>
              <div className={styles.card}>
                <h3>Active Sessions</h3>
                <div className={styles.bigStat}>18</div>
              </div>
              <div className={styles.card}>
                <h3>Upload Exam</h3>
                <button className={styles.primaryBtn} onClick={uploadExam}>Upload Schedule</button>
              </div>
            </section>
            <section className={styles.charts}>
              <div className={styles.chartCard}><h4>User Distribution</h4><Bar data={userStats}/></div>
              <div className={styles.chartCard}><h4>Platform Activity</h4><Line data={activityData}/></div>
            </section>
          </>}

          {activePage==="users" && <section className={styles.card}>
            <h2>Manage Users</h2>
            <div className={styles.formRow}>
              <input value={newUserName} onChange={e=>setNewUserName(e.target.value)} placeholder="Full name"/>
              <select value={newUserRole} onChange={e=>setNewUserRole(e.target.value)}>
                <option>Student</option><option>Instructor</option><option>Admin</option>
              </select>
              <button className={styles.primaryBtn} onClick={addUser}>Add User</button>
            </div>
            <table className={styles.table}>
              <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.role}</td><td>{u.email}</td>
                <td><button className={styles.dangerBtn} onClick={()=>removeUser(u.id)}>Remove</button></td></tr>)}
              </tbody>
            </table>
          </section>}

          {activePage==="exams" && <section className={styles.card}>
            <h2>Exam Schedules</h2>
            <button className={styles.primaryBtn} onClick={uploadExam}>Upload New Schedule</button>
            <ul className={styles.list}>{examUploads.map(e=><li key={e.id}>{e.course} — {e.date} — Room {e.room}</li>)}</ul>
          </section>}

          {activePage==="reports" && <section className={styles.card}>
            <h2>Analytics & Reports</h2>
            <p>Basic interactive charts shown in Overview. Backend analytics not implemented.</p>
          </section>}
        </div>
      </main>
    </div>
  );
}
