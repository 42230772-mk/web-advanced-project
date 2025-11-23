import React from "react";
import styles from "./Navbar.module.css";

export default function Navbar({ title, role, onLogout }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <h1 className={styles.brand}>{title}</h1>
      </div>
      <div className={styles.right}>
        <span className={styles.role}>{role}</span>
        <button className={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
