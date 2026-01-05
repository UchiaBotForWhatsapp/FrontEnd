import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { countriesService } from '../../services/api';
import styles from './Register.module.css';

interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    pais: '',
    cidade: '',
    telefone: '',
    genero: '',
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      const data = await countriesService.getCountries();
      setCountries(data);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (formData.pais) {
        const data = await countriesService.getCities(formData.pais);
        setCities(data);
      }
    };
    loadCities();
  }, [formData.pais]);

  const handleCountryChange = (value: string) => {
    const country = countries.find((c) => c.code === value);
    setSelectedCountry(country || null);
    setFormData({ ...formData, pais: value, cidade: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nome || !formData.email || !formData.senha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!termsAccepted) {
      setError('Você precisa aceitar os termos de uso.');
      return;
    }

    const success = await register(formData);
    if (success) {
      navigate('/verify');
    } else {
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  const genderOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' },
    { value: 'prefiro_nao_dizer', label: 'Prefiro não dizer' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>卍</span>
            <span className={styles.logoText}>Uchiha Bot</span>
          </Link>
          <h1 className={styles.title}>Criar Conta</h1>
          <p className={styles.subtitle}>Junte-se aos ninjas do WhatsApp</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <Input
            label="Nome Completo"
            type="text"
            placeholder="Seu nome completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <div className={styles.row}>
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={formData.senha}
              onChange={(e) =>
                setFormData({ ...formData, senha: e.target.value })
              }
            />
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              value={formData.confirmarSenha}
              onChange={(e) =>
                setFormData({ ...formData, confirmarSenha: e.target.value })
              }
            />
          </div>

          <div className={styles.row}>
            <Select
              label="País"
              placeholder="Selecione o país"
              options={countries.map((c) => ({
                value: c.code,
                label: `${c.flag} ${c.name}`,
              }))}
              value={formData.pais}
              onChange={handleCountryChange}
            />
            <Select
              label="Cidade"
              placeholder="Selecione a cidade"
              options={cities.map((city) => ({ value: city, label: city }))}
              value={formData.cidade}
              onChange={(value) => setFormData({ ...formData, cidade: value })}
              disabled={!formData.pais}
            />
          </div>

          <Input
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(e) =>
              setFormData({ ...formData, telefone: e.target.value })
            }
            inputPrefix={
              selectedCountry && (
                <span className={styles.phonePrefix}>
                  {selectedCountry.flag} {selectedCountry.dial_code}
                </span>
              )
            }
          />

          <Select
            label="Gênero"
            placeholder="Selecione o gênero"
            options={genderOptions}
            value={formData.genero}
            onChange={(value) => setFormData({ ...formData, genero: value })}
          />

          <div className={styles.terms}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className={styles.checkmark} />
              <span>
                Li e aceito os{' '}
                <button
                  type="button"
                  className={styles.termsLink}
                  onClick={() => setIsTermsOpen(true)}
                >
                  termos de uso
                </button>
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Criar Conta
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className={styles.link}>
              Fazer login
            </Link>
          </p>
        </div>
      </div>

      <Modal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Termos de Uso"
        size="lg"
      >
        <div className={styles.termsContent}>
          <h3>1. Privacidade e Armazenamento de Dados</h3>
          <p>
            Seus dados pessoais são armazenados de forma segura e criptografada.
            Utilizamos medidas de segurança padrão da indústria para proteger
            suas informações contra acesso não autorizado.
          </p>

          <h3>2. Uso dos Dados</h3>
          <p>
            Os dados coletados são utilizados exclusivamente para:
          </p>
          <ul>
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Personalizar sua experiência</li>
            <li>Enviar comunicações importantes sobre sua conta</li>
            <li>Garantir a segurança da plataforma</li>
          </ul>

          <h3>3. Responsabilidade do Usuário</h3>
          <p>
            O usuário é responsável por:
          </p>
          <ul>
            <li>Manter suas credenciais de acesso seguras</li>
            <li>Não utilizar a plataforma para fins ilegais</li>
            <li>Respeitar as políticas do WhatsApp</li>
            <li>Não enviar spam ou mensagens não solicitadas</li>
          </ul>

          <h3>4. Limitação de Responsabilidade</h3>
          <p>
            O Uchiha Bot não se responsabiliza por bloqueios de número de WhatsApp
            decorrentes do uso inadequado da plataforma pelo usuário.
          </p>

          <div className={styles.termsActions}>
            <Button
              variant="primary"
              onClick={() => {
                setTermsAccepted(true);
                setIsTermsOpen(false);
              }}
            >
              Aceitar Termos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
