import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    const success = await login(formData.identifier, formData.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>卍</span>
            <span className={styles.logoText}>Uchiha Bot</span>
          </Link>
          <h1 className={styles.title}>Bem-vindo de Volta</h1>
          <p className={styles.subtitle}>Entre na sua conta para continuar</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <Input
            label="Email ou Telefone"
            type="text"
            placeholder="seu@email.com ou (11) 99999-9999"
            value={formData.identifier}
            onChange={(e) =>
              setFormData({ ...formData, identifier: e.target.value })
            }
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Entrar
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className={styles.link}>
              Registrar-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
