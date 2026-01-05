import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import styles from './Verify.module.css';

export const Verify: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setError('Por favor, insira o código completo de 4 dígitos.');
      return;
    }

    setIsLoading(true);
    // Mock verification - in production, call authService.verifyAccount
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>卍</span>
            <span className={styles.logoText}>Uchiha Bot</span>
          </Link>
          <div className={styles.iconWrapper}>
            <span className={styles.emailIcon}>✉️</span>
          </div>
          <h1 className={styles.title}>Verificar Conta</h1>
          <p className={styles.subtitle}>
            Enviamos um código de 4 dígitos para o seu email. Digite-o abaixo
            para ativar sua conta.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.codeInputs}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles.codeInput}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Ativar Conta
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Não recebeu o código?{' '}
            <button className={styles.resendButton}>Reenviar</button>
          </p>
        </div>
      </div>
    </div>
  );
};
