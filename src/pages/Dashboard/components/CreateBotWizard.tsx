import React, { useState } from 'react';
import { User, Building2, AlertTriangle, Trash2, Plus } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useBots } from '../../../hooks/useBots';
import styles from './CreateBotWizard.module.css';

interface CreateBotWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'plan' | 'type' | 'details';

const plans = [
  {
    id: 'genin',
    name: 'Genin',
    price: 'Grátis',
    description: '7 dias • 100 mensagens',
  },
  {
    id: 'shunin',
    name: 'Shunin',
    price: 'R$ 49/mês',
    description: '1.000 mensagens',
  },
  {
    id: 'jounin',
    name: 'Jounin',
    price: 'R$ 99/mês',
    description: '5.000 mensagens',
  },
  {
    id: 'hokage',
    name: 'Hokage',
    price: 'R$ 199/mês',
    description: '10.000 mensagens',
  },
];

export const CreateBotWizard: React.FC<CreateBotWizardProps> = ({
  isOpen,
  onClose,
}) => {
  const { createBot } = useBots();
  const [step, setStep] = useState<Step>('plan');
  const [formData, setFormData] = useState({
    plano: '',
    tipo: '' as 'pessoal' | 'empresarial' | '',
    nome: '',
    descricao: '',
    nomeEmpresa: '',
    descricaoEmpresa: '',
    instrucoes: '',
    produtos: [{ nome: '', quantidade: 1 }],
  });

  const resetForm = () => {
    setStep('plan');
    setFormData({
      plano: '',
      tipo: '',
      nome: '',
      descricao: '',
      nomeEmpresa: '',
      descricaoEmpresa: '',
      instrucoes: '',
      produtos: [{ nome: '', quantidade: 1 }],
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNext = () => {
    if (step === 'plan' && formData.plano) {
      setStep('type');
    } else if (step === 'type' && formData.tipo) {
      setStep('details');
    }
  };

  const handleBack = () => {
    if (step === 'type') {
      setStep('plan');
    } else if (step === 'details') {
      setStep('type');
    }
  };

  const handleSubmit = () => {
    if (!formData.nome || !formData.descricao || !formData.tipo) return;

    createBot({
      nome: formData.nome,
      tipo: formData.tipo,
      plano: formData.plano as 'genin' | 'shunin' | 'jounin' | 'hokage',
      descricao: formData.descricao,
      nomeEmpresa: formData.nomeEmpresa,
      descricaoEmpresa: formData.descricaoEmpresa,
      instrucoes: formData.instrucoes,
      produtos: formData.produtos.filter((p) => p.nome),
    });

    handleClose();
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      produtos: [...formData.produtos, { nome: '', quantidade: 1 }],
    });
  };

  const updateProduct = (index: number, field: 'nome' | 'quantidade', value: string | number) => {
    const newProducts = [...formData.produtos];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setFormData({ ...formData, produtos: newProducts });
  };

  const removeProduct = (index: number) => {
    const newProducts = formData.produtos.filter((_, i) => i !== index);
    setFormData({ ...formData, produtos: newProducts });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Novo Bot"
      size="md"
    >
      <div className={styles.wizard}>
        {/* Progress */}
        <div className={styles.progress}>
          <div className={`${styles.progressStep} ${step === 'plan' ? styles.active : ''} ${['type', 'details'].includes(step) ? styles.completed : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Plano</span>
          </div>
          <div className={styles.progressLine} />
          <div className={`${styles.progressStep} ${step === 'type' ? styles.active : ''} ${step === 'details' ? styles.completed : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Tipo</span>
          </div>
          <div className={styles.progressLine} />
          <div className={`${styles.progressStep} ${step === 'details' ? styles.active : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Detalhes</span>
          </div>
        </div>

        {/* Step Content */}
        <div className={styles.content}>
          {step === 'plan' && (
            <div className={styles.plansGrid}>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  className={`${styles.planOption} ${formData.plano === plan.id ? styles.selected : ''}`}
                  onClick={() => setFormData({ ...formData, plano: plan.id })}
                >
                  <span className={styles.planName}>{plan.name}</span>
                  <span className={styles.planPrice}>{plan.price}</span>
                  <span className={styles.planDescription}>{plan.description}</span>
                </button>
              ))}
            </div>
          )}

          {step === 'type' && (
            <div className={styles.typeOptions}>
              <button
                className={`${styles.typeOption} ${formData.tipo === 'pessoal' ? styles.selected : ''}`}
                onClick={() => setFormData({ ...formData, tipo: 'pessoal' })}
              >
                <span className={styles.typeIcon}>
                  <User size={28} />
                </span>
                <span className={styles.typeName}>Bot Pessoal</span>
                <span className={styles.typeWarning}>
                  <AlertTriangle size={14} /> Pode usar qualquer conta de WhatsApp
                </span>
              </button>
              <button
                className={`${styles.typeOption} ${formData.tipo === 'empresarial' ? styles.selected : ''}`}
                onClick={() => setFormData({ ...formData, tipo: 'empresarial' })}
              >
                <span className={styles.typeIcon}>
                  <Building2 size={28} />
                </span>
                <span className={styles.typeName}>Bot Empresarial</span>
                <span className={styles.typeWarning}>
                  <AlertTriangle size={14} /> Requer conta WhatsApp Business
                </span>
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className={styles.detailsForm}>
              <Input
                label="Nome do Bot"
                placeholder="Ex: Atendente Virtual"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />

              <Input
                label="Descrição (comportamento e missão)"
                placeholder="Descreva como o bot deve se comportar..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />

              {formData.tipo === 'empresarial' && (
                <>
                  <Input
                    label="Nome da Empresa"
                    placeholder="Nome da sua empresa"
                    value={formData.nomeEmpresa}
                    onChange={(e) => setFormData({ ...formData, nomeEmpresa: e.target.value })}
                  />

                  <Input
                    label="Descrição da Empresa"
                    placeholder="Descreva sua empresa..."
                    value={formData.descricaoEmpresa}
                    onChange={(e) => setFormData({ ...formData, descricaoEmpresa: e.target.value })}
                  />

                  <Input
                    label="Instruções de Atendimento"
                    placeholder="Como o bot deve responder aos clientes..."
                    value={formData.instrucoes}
                    onChange={(e) => setFormData({ ...formData, instrucoes: e.target.value })}
                  />

                  <div className={styles.productsSection}>
                    <label className={styles.sectionLabel}>Produtos</label>
                    {formData.produtos.map((produto, index) => (
                      <div key={index} className={styles.productRow}>
                        <Input
                          placeholder="Nome do produto"
                          value={produto.nome}
                          onChange={(e) => updateProduct(index, 'nome', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Qtd"
                          value={produto.quantidade.toString()}
                          onChange={(e) => updateProduct(index, 'quantidade', parseInt(e.target.value) || 0)}
                        />
                        {formData.produtos.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeProduct(index)}>
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addProduct}>
                      <Plus size={16} style={{ marginRight: '0.25rem' }} /> Adicionar Produto
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {step !== 'plan' && (
            <Button variant="outline" onClick={handleBack}>
              Voltar
            </Button>
          )}
          {step === 'details' ? (
            <Button variant="primary" onClick={handleSubmit} disabled={!formData.nome || !formData.descricao}>
              Criar Bot
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext} disabled={step === 'plan' ? !formData.plano : !formData.tipo}>
              Próximo
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
