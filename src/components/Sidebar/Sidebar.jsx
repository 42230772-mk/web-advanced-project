import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { Menu, X } from 'lucide-react';
import { Home, BookOpen } from "lucide-react";


const Sidebar = ({ links, active, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button */}
      <button className={styles.menuButton} onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <h2 className={styles.logo}>Dashboard</h2>
        <ul className={styles.navList}>
          {links.map((link) => (
            <li
              key={link.id}
              className={active === link.id ? styles.active : ''}
              onClick={() => onLinkClick(link.id)}
            >
              {link.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
