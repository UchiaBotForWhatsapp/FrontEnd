import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Bot size={28} className={styles.logoIcon} />
          <span className={styles.logoText}>Uchiha Bot</span>
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} />
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link
            to="/"
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Início
          </Link>
          <Link
            to="/#precos"
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Preços
          </Link>
          <Link
            to="/#beneficios"
            className={styles.navLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Benefícios
          </Link>
        </nav>

        <div className={`${styles.actions} ${isMenuOpen ? styles.actionsOpen : ''}`}>
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Registrar-se</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
