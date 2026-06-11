import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import './Login.css';

const PERFIS = [
  { label: 'Morador', value: 'morador' },
  { label: 'Síndico / Zelador', value: 'sindico' },
];

export default function Login() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState('morador');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const loginFn =
        perfil === 'morador'
          ? authService.loginMorador
          : authService.loginSindico;

      const data = await loginFn(email, senha);

      localStorage.setItem('token', data.token);
      localStorage.setItem('perfil', perfil);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      navigate(perfil === 'morador' ? '/morador' : '/sindico');
    } catch (err) {
      setErro(err.message || 'Credenciais inválidas.');
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
          <h1 className="login-title">Meu Condominio</h1>
          <p className="login-subtitle">Sistema de Gestão Condominial</p>
        </div>

        {/* Perfil toggle */}
        <div className="login-toggle" role="group" aria-label="Selecione o perfil">
          {PERFIS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`login-toggle-btn${perfil === p.value ? ' active' : ''}`}
              onClick={() => { setPerfil(p.value); setErro(''); }}
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

          <div className="login-field">
            <label className="login-label" htmlFor="senha">Senha</label>
            <input
              id="senha"
              className="login-input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="login-erro" role="alert">{erro}</p>
          )}

          <button
            className="login-btn"
            type="submit"
            disabled={carregando}
          >
            {carregando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        {/* Links utilitários */}
        <div className="login-links">
          <button
            type="button"
            className="login-link"
            onClick={() => {/* TODO: /recuperar-senha */}}
          >
            Esqueci minha senha
          </button>

          <span className="login-links-divider" aria-hidden="true">·</span>

          <button
            type="button"
            className="login-link"
            onClick={() => navigate('/cadastro')}
          >
            Ainda não tem acesso? <strong>Criar conta</strong>
          </button>
        </div>

      </div>
    </div>
  );
}

