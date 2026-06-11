import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chamadosService } from '../../services/api';
import NovoChamadoModal from "../chamado/NovoChamadoModal.jsx";
import './MoradorHome.css';

const STATUS_META = {
  ABERTO:      { label: 'Aberto',      cls: 'status-aberto' },
  EM_ANDAMENTO:{ label: 'Em andamento', cls: 'status-andamento' },
  CONCLUIDO:   { label: 'Concluído',   cls: 'status-concluido' },
  CANCELADO:   { label: 'Cancelado',   cls: 'status-cancelado' },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? { label: status, cls: '' };
  return <span className={`status-badge ${meta.cls}`}>{meta.label}</span>;
}

export default function MoradorHome() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const carregarChamados = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      // 1. Comentamos a chamada da API para o Java não reclamar:
      // const data = await chamadosService.listarPorMorador(usuario.id);
      
      // 2. Criamos os dados na mão (mockados) iguais aos do seu protótipo:
      const data = [
        { 
          id: 1, 
          titulo: 'Lâmpada queimada no corredor', 
          descricao: 'A lâmpada do corredor próximo ao apartamento 302 está queimada há 3 dias.', 
          status: 'EM_ANDAMENTO', 
          localOcorrencia: 'Bloco B - 3º andar' 
        },
        { 
          id: 2, 
          titulo: 'Vazamento na garagem', 
          descricao: 'Há um vazamento aparente vindo do teto da garagem.', 
          status: 'ABERTO', 
          localOcorrencia: 'Garagem - Vaga 45' 
        }
      ];
      
      // 3. O React pega esses dados de mentira e joga na tela
      setChamados(data);
    } catch (err) {
      setErro('Não foi possível carregar os chamados.');
    } finally {
      setCarregando(false);
    }
  }, [usuario.id]);

  useEffect(() => { carregarChamados(); }, [carregarChamados]);

  function handleSair() {
    localStorage.clear();
    navigate('/');
  }

  function handleChamadoCriado() {
    setModalAberto(false);
    carregarChamados();
  }

  return (
    <div className="mh-root">

      {/* ── Header ── */}
      <header className="mh-header">
        <div className="mh-header-inner">
          <div className="mh-brand">
            <span className="mh-brand-icon" aria-hidden="true">⚙</span>
            <span className="mh-brand-name">Meu Condominio</span>
          </div>
          <div className="mh-header-right">
            <span className="mh-usuario">
              {usuario.nome ?? 'Morador'} &mdash; Unidade {usuario.unidade ?? '—'}
            </span>
            <button className="mh-btn-sair" onClick={handleSair}>Sair</button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mh-main">

        {/* Toolbar */}
        <div className="mh-toolbar">
          <div>
            <h1 className="mh-page-title">Meus Chamados</h1>
            <p className="mh-page-sub">Acompanhe e gerencie suas solicitações</p>
          </div>
          <button
            className="mh-btn-novo"
            onClick={() => setModalAberto(true)}
          >
            + Novo Chamado
          </button>
        </div>

        {/* Feedback states */}
        {erro && <p className="mh-erro">{erro}</p>}

        {carregando ? (
          <div className="mh-loading">
            <span className="mh-spinner" aria-label="Carregando" />
            Carregando chamados…
          </div>
        ) : chamados.length === 0 ? (
          <div className="mh-empty">
            <span className="mh-empty-icon" aria-hidden="true">📋</span>
            <p>Você ainda não abriu nenhum chamado.</p>
            <button
              className="mh-btn-novo mh-btn-novo--sm"
              onClick={() => setModalAberto(true)}
            >
              Abrir primeiro chamado
            </button>
          </div>
        ) : (
          <div className="mh-grid">
            {chamados.map((c) => (
              <div key={c.id} className="mh-card">
                <div className="mh-card-top">
                  <span className="mh-card-id">#{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h2 className="mh-card-titulo">{c.titulo}</h2>
                <p className="mh-card-desc">{c.descricao}</p>
                <div className="mh-card-footer">
                  <span className="mh-card-local">
                    <span aria-hidden="true">📍</span> {c.localOcorrencia ?? c.local_ocorrencia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal Novo Chamado ── */}
      {modalAberto && (
        <NovoChamadoModal
          moradorId={usuario.id}
          onClose={() => setModalAberto(false)}
          onSucesso={handleChamadoCriado}
        />
      )}
    </div>
  );
}
