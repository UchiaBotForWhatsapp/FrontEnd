import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>卍</span>
              <span className={styles.logoText}>Uchiha Bot</span>
            </Link>
            <p className={styles.description}>
              A plataforma mais poderosa para criar bots de WhatsApp inteligentes.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Produto</h4>
              <Link to="/#beneficios" className={styles.link}>Benefícios</Link>
              <Link to="/#precos" className={styles.link}>Preços</Link>
              <Link to="/#demo" className={styles.link}>Demonstração</Link>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Suporte</h4>
              <Link to="/help" className={styles.link}>Central de Ajuda</Link>
              <a href="mailto:suporte@uchihabot.com" className={styles.link}>Contato</a>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Legal</h4>
              <Link to="/terms" className={styles.link}>Termos de Uso</Link>
              <Link to="/privacy" className={styles.link}>Privacidade</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Uchiha Bot. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
