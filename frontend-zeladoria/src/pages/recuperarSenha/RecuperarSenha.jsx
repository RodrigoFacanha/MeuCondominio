import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import './RecuperarSenha.css';

const PERFIS = [
  { label: 'Morador', value: 'morador' },
  { label: 'Síndico / Zelador', value: 'sindico' },
];

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState('morador');
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      const recuperarFn =
        perfil === 'morador'
          ? authService.recuperarSenhaMorador
          : authService.recuperarSenhaSindico;

      await recuperarFn(email);
      setSucesso('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      setEmail('');
    } catch (err) {
      setErro(err.message || 'Não foi possível solicitar a recuperação para este e-mail.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-root">
      <div className="login-panel">

        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-icon" aria-hidden="true">⚙</span>
          </div>
          <h1 className="login-title">Recuperar Senha</h1>
          <p className="login-subtitle">Insira seu e-mail cadastrado</p>
        </div>

        {/* Perfil toggle */}
        <div className="login-toggle" role="group" aria-label="Selecione o perfil">
          {PERFIS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`login-toggle-btn${perfil === p.value ? ' active' : ''}`}
              onClick={() => { setPerfil(p.value); setErro(''); setSucesso(''); }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              className="login-input"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="login-erro" role="alert">{erro}</p>
          )}

          {sucesso && (
            <p className="login-sucesso" role="alert">{sucesso}</p>
          )}

          <button
            className="login-btn"
            type="submit"
            disabled={carregando}
          >
            {carregando ? 'Enviando…' : 'Enviar Link'}
          </button>
        </form>

        {/* Links utilitários */}
        <div className="login-links">
          <button
            type="button"
            className="login-link"
            onClick={() => navigate('/')}
          >
            Voltar para o <strong>Login</strong>
          </button>
        </div>

      </div>
    </div>
  );
}