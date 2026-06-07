import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moradoresService } from '../../services/api';
import './Cadastro.css';

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    unidade: '',
    email: '',
    senha: '',
  });
  const [erro, setErro]         = useState('');
  const [sucesso, setSucesso]   = useState(false);
  const [salvando, setSalvando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (erro) setErro('');
  }

  function validar() {
    if (!form.nome.trim())    return 'Informe seu nome completo.';
    if (!form.unidade.trim()) return 'Informe a unidade (apto/bloco).';
    if (!form.email.trim())   return 'Informe um e-mail válido.';
    if (form.senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const msg = validar();
    if (msg) { setErro(msg); return; }

    setSalvando(true);
    setErro('');

    try {
      await moradoresService.criar(form);
      setSucesso(true);
      setTimeout(() => navigate('/'), 2200);
    } catch (err) {
      setErro(err.message || 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="cad-root">
      <div className="cad-panel">

        {/* Header */}
        <div className="cad-header">
          <div className="cad-logo">
            <span className="cad-logo-icon" aria-hidden="true">⚙</span>
          </div>
          <h1 className="cad-title">Criar Conta</h1>
          <p className="cad-subtitle">Preencha os dados para solicitar acesso</p>
        </div>

        {/* Sucesso */}
        {sucesso ? (
          <div className="cad-sucesso" role="status">
            <span className="cad-sucesso-icon" aria-hidden="true">✓</span>
            <p className="cad-sucesso-titulo">Conta criada com sucesso!</p>
            <p className="cad-sucesso-sub">Redirecionando para o login…</p>
          </div>
        ) : (
          <>
            {/* Form */}
            <form className="cad-form" onSubmit={handleSubmit} noValidate>

              <div className="cad-field">
                <label className="cad-label" htmlFor="nome">Nome Completo</label>
                <input
                  id="nome"
                  name="nome"
                  className="cad-input"
                  type="text"
                  autoComplete="name"
                  placeholder="Ex: João da Silva"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cad-field">
                <label className="cad-label" htmlFor="unidade">Unidade (Apto / Bloco)</label>
                <input
                  id="unidade"
                  name="unidade"
                  className="cad-input"
                  type="text"
                  autoComplete="off"
                  placeholder="Ex: 204-B"
                  value={form.unidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cad-field">
                <label className="cad-label" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  className="cad-input"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cad-field">
                <label className="cad-label" htmlFor="senha">
                  Senha
                  <span className="cad-label-hint">mínimo 6 caracteres</span>
                </label>
                <input
                  id="senha"
                  name="senha"
                  className="cad-input"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={handleChange}
                  required
                />
              </div>

              {erro && (
                <p className="cad-erro" role="alert">{erro}</p>
              )}

              <button
                className="cad-btn"
                type="submit"
                disabled={salvando}
              >
                {salvando ? 'Criando conta…' : 'Cadastrar'}
              </button>
            </form>

            {/* Link de volta */}
            <div className="cad-links">
              <button
                type="button"
                className="cad-link"
                onClick={() => navigate('/')}
              >
                Já tem uma conta? <strong>Voltar para o Login</strong>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
